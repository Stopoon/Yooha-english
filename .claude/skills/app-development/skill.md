---
name: app-development
description: "유하 영어학습 Next.js 앱을 구현하고 GitHub MCP로 푸시, Supabase MCP로 DB 스키마 생성, Vercel MCP로 배포한다. 앱 코드 작성, GitHub 저장소 연결, Supabase 스키마 생성, Vercel 배포 요청 시 반드시 이 스킬을 사용할 것."
---

# App Development — Next.js 앱 구현 + 인프라 자동화

커리큘럼/콘텐츠/스토리 스펙을 받아 완성된 앱을 구현하고 `_workspace/03_deployment_info.md`에 배포 정보를 기록한다.

## 구현 순서

순서를 지켜야 한다. 각 단계가 다음 단계의 기반이 된다.

1. **GitHub 저장소 생성** (GitHub MCP)
2. **Next.js 프로젝트 스캐폴딩** (로컬)
3. **Supabase 스키마 생성** (Supabase MCP)
4. **핵심 컴포넌트 구현** (학생 화면 → 부모 대시보드)
5. **Claude API 연동** (동화 동적 생성)
6. **GitHub 푸시** (GitHub MCP)
7. **Vercel 배포** (Vercel MCP)

## Step 1: GitHub 저장소

GitHub MCP로 `yooha-english` 저장소 생성:
- Public 저장소
- README.md 초기화
- main 브랜치

## Step 2: Next.js 프로젝트 구조

```bash
npx create-next-app@latest yooha-english \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*"
```

핵심 디렉토리:
```
src/
├── app/
│   ├── (student)/         # 유하 학습 화면 (인증 불필요)
│   │   ├── page.tsx       # 홈 — 오늘의 세션 카드
│   │   ├── session/[id]/  # 세션 진행
│   │   ├── story/[id]/    # 동화 읽기
│   │   └── rewards/       # 배지 컬렉션
│   ├── (parent)/          # 부모 대시보드 (Supabase Auth)
│   │   └── dashboard/
│   └── api/
│       ├── sessions/
│       ├── progress/
│       └── story/generate/
├── components/
│   ├── games/             # 게임 4종 컴포넌트
│   ├── phonics/           # 파닉스 연습 컴포넌트
│   ├── vocab/             # 어휘 카드 컴포넌트
│   └── dashboard/         # 부모 대시보드 컴포넌트
└── lib/
    ├── supabase.ts
    └── claude.ts
```

## Step 3: Supabase 스키마

Supabase MCP의 `apply_migration`으로 실행할 SQL:

```sql
-- 세션 정의
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INTEGER NOT NULL,
  order_in_level INTEGER NOT NULL,
  title TEXT NOT NULL,
  phonics_pattern TEXT NOT NULL,
  vocab_set JSONB NOT NULL DEFAULT '[]',
  game_type TEXT NOT NULL CHECK (game_type IN ('phonics_match','word_builder','memory_match','sentence_fill')),
  story_unlock_after INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학습 기록
CREATE TABLE learning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  phonics_score INTEGER DEFAULT 0,
  vocab_score INTEGER DEFAULT 0,
  game_score INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  streak_day INTEGER DEFAULT 1
);

-- 어휘 숙달도
CREATE TABLE vocab_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  correct_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- 배지
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  session_id UUID REFERENCES sessions(id)
);

-- 동화 접근 기록 (Claude API 캐시 포함)
CREATE TABLE story_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  generated_content TEXT,
  vocab_used JSONB DEFAULT '[]'
);

-- 스트릭 집계 뷰
CREATE VIEW streak_summary AS
SELECT
  COUNT(*) FILTER (WHERE completed_at >= NOW() - INTERVAL '7 days') AS week_sessions,
  MAX(streak_day) AS max_streak,
  COUNT(*) FILTER (WHERE DATE(completed_at) = CURRENT_DATE) AS today_sessions
FROM learning_logs;
```

## Step 4: 핵심 컴포넌트

### 모바일 퍼스트 원칙
```typescript
// 모든 버튼: 최소 h-11(44px) + 충분한 padding
<button className="h-11 min-w-[44px] px-6 rounded-2xl text-base font-bold
                   bg-yellow-400 active:scale-95 transition-transform">

// 폰트: 최소 text-base(16px)
// 카드: rounded-2xl + shadow-md
// 게임 그리드: 터치 간격 충분히 (gap-3 이상)
```

### 세션 진행 화면 (`session/[id]/page.tsx`)
```typescript
// 4단계 프로그레스: 파닉스 → 어휘 → 게임 → 복습
type SessionStep = 'phonics' | 'vocab' | 'game' | 'review'

// 진행 표시: 상단 프로그레스 바 (dots 4개)
// 단계 전환: 슬라이드 애니메이션
// 완료 시: 뭉치 축하 화면 + 점수 없이 별 표시
```

### 게임 컴포넌트 (`components/games/`)
```
PhonicsMatch.tsx  — 그림 + 알파벳 4지선다 탭
WordBuilder.tsx   — 글자 타일 드래그앤드롭
MemoryMatch.tsx   — 카드 뒤집기 그리드
SentenceFill.tsx  — 빈칸 채우기 3지선다
```

### 부모 대시보드 (`(parent)/dashboard/`)
```typescript
// 핵심 지표 (Supabase 집계 쿼리)
const { data: stats } = await supabase
  .from('learning_logs')
  .select('*')
  .gte('completed_at', weekAgo)

// 표시 항목:
// - 오늘 세션 완료 여부
// - 주간 스트릭 캘린더
// - 파닉스 레벨 진도율
// - 취약 어휘 목록 (correct_count/total_count < 0.5)
```

## Step 5: Claude API 연동

```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function generateStory(params: {
  level: number
  learnedVocab: string[]
  friendName: string
  animalCharacter: string
}) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: buildStoryPrompt(params)
    }]
  })
  return message.content[0].type === 'text' ? message.content[0].text : ''
}
```

## Step 6~7: GitHub → Vercel 배포

```
GitHub MCP:
1. yooha-english 저장소 생성
2. 초기 코드 전체 커밋 + 푸시

Vercel MCP:
1. GitHub 저장소 연결
2. 환경변수 설정:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - ANTHROPIC_API_KEY
3. 첫 배포 실행
4. 배포 URL 확인
```

## 출력 파일 형식

`_workspace/03_deployment_info.md`:
```markdown
# 배포 정보

## GitHub
- 저장소: https://github.com/{owner}/yooha-english
- 브랜치: main

## Supabase
- 프로젝트 URL: ...
- 테이블: sessions, learning_logs, vocab_mastery, badges, story_access

## Vercel
- 배포 URL: https://yooha-english.vercel.app
- 환경변수: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY

## QA 테스트 계정
- 학생 화면: 인증 없이 접근 가능
- 부모 대시보드: test@parent.com / [password]
```
