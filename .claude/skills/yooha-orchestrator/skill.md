---
name: yooha-orchestrator
description: "유하 영어학습 앱 전체 개발 파이프라인을 오케스트레이션한다. 커리큘럼 설계 → 콘텐츠/스토리 병렬 제작 → 앱 개발 → QA 검증 → Vercel 배포까지 에이전트 팀을 조율하여 자동 완성한다. 유하 앱 개발 시작, 전체 파이프라인 실행, yooha 프로젝트 빌드 요청 시 반드시 이 스킬을 사용할 것."
---

# Yooha Orchestrator — 유하 영어학습 앱 전체 파이프라인

유하 영어학습 프로그램 개발을 처음부터 끝까지 에이전트 팀으로 자동 완성한다.

## 실행 모드: 에이전트 팀 (파이프라인 + 팬아웃 복합)

```
Phase 1: curriculum-designer (단독)
              ↓
Phase 2: content-creator ⟷ story-writer (병렬 + 상호 조율)
              ↓
Phase 3: developer (단독, 긴 작업)
              ↓
Phase 4: qa-agent (증분 + 최종 검증)
```

## 에이전트 구성

| 팀원 | 에이전트 타입 | 모델 | 역할 | 출력 |
|------|-------------|------|------|------|
| curriculum-designer | curriculum-designer | sonnet | 파닉스/어휘 커리큘럼 설계 | `_workspace/01_curriculum_spec.md` |
| content-creator | content-creator | sonnet | 세션 콘텐츠 + 게임 제작 | `_workspace/02_content_sessions.md` |
| story-writer | story-writer | sonnet | 동화/만화 스크립트 + Claude API 프롬프트 | `_workspace/02_story_scripts.md` |
| developer | developer | sonnet | Next.js 앱 + DB + 배포 | `_workspace/03_deployment_info.md` |
| qa-agent | qa-agent | sonnet | 교차 검증 + QA 보고서 | `_workspace/04_qa_report.md` |

## 워크플로우

### Phase 0: 준비

1. `_workspace/` 디렉토리 생성
2. CLAUDE.md 내용 숙지 및 핵심 제약 재확인:
   - 금지 소재: 피자, 햄버거
   - 금지 표현: 시험, 점수 압박
   - 필수 포함: 친구 6명, 가족, 동물 캐릭터 3종
   - 기기: 모바일 퍼스트

### Phase 1: 팀 구성 + 커리큘럼 설계

**팀 생성:**
```
TeamCreate(
  team_name: "yooha-team",
  members: [
    {
      name: "curriculum-designer",
      agent_type: "curriculum-designer",
      model: "sonnet",
      prompt: "유하(초등 3학년, 8~9세) 영어 파닉스·어휘 커리큘럼을 설계하세요.
               curriculum-design 스킬을 사용하여 _workspace/01_curriculum_spec.md에 출력.
               완료 후 content-creator와 story-writer에게 SendMessage로 파일 경로 전달.
               CLAUDE.md의 유하 정보 숙지 필수."
    },
    {
      name: "content-creator",
      agent_type: "content-creator",
      model: "sonnet",
      prompt: "curriculum-designer로부터 커리큘럼 스펙을 받은 후 시작.
               content-creation 스킬을 사용하여 유하 맞춤 세션 콘텐츠 + 게임 4종을 제작.
               _workspace/02_content_sessions.md에 출력.
               피자/햄버거 금지, 친구 이름 6명 모두 활용."
    },
    {
      name: "story-writer",
      agent_type: "story-writer",
      model: "sonnet",
      prompt: "curriculum-designer로부터 커리큘럼 스펙을 받은 후 시작.
               story-writing 스킬을 사용하여 영어동화 3편, 만화 2편, Claude API 프롬프트 템플릿 제작.
               _workspace/02_story_scripts.md에 출력."
    },
    {
      name: "developer",
      agent_type: "developer",
      model: "sonnet",
      prompt: "content-creator와 story-writer 모두 완료 후 시작.
               app-development 스킬을 사용하여 Next.js 앱 구현.
               GitHub MCP → Supabase MCP → Vercel MCP 순서로 자동화.
               _workspace/03_deployment_info.md에 배포 정보 기록."
    },
    {
      name: "qa-agent",
      agent_type: "qa-agent",
      model: "sonnet",
      prompt: "developer 배포 완료 후 전체 검증 시작. 단, DB 스키마 완성 즉시 증분 QA도 수행.
               qa-validation 스킬을 사용하여 교차 비교 방식으로 검증.
               _workspace/04_qa_report.md에 보고서 출력."
    }
  ]
)
```

**작업 등록:**
```
TaskCreate(tasks: [
  {
    title: "커리큘럼 스펙 생성",
    description: "파닉스 6레벨, 어휘 테마별 세트, 세션 구조, 복습 트리거 기준 설계",
    assignee: "curriculum-designer"
  },
  {
    title: "세션 콘텐츠 + 게임 4종 제작",
    description: "유하 맞춤 예문, 어휘 카드, 게임 시나리오, 배지 시스템 제작",
    assignee: "content-creator",
    depends_on: ["커리큘럼 스펙 생성"]
  },
  {
    title: "동화·만화 스크립트 + Claude API 프롬프트",
    description: "레벨별 동화 3편, 만화 2편, 동적 생성 프롬프트 템플릿 작성",
    assignee: "story-writer",
    depends_on: ["커리큘럼 스펙 생성"]
  },
  {
    title: "Next.js 앱 + GitHub + Supabase + Vercel",
    description: "전체 앱 구현, DB 스키마, GitHub 푸시, Vercel 배포",
    assignee: "developer",
    depends_on: ["세션 콘텐츠 + 게임 4종 제작", "동화·만화 스크립트 + Claude API 프롬프트"]
  },
  {
    title: "QA 검증 + 보고서",
    description: "API 경계면, 모바일 UI, 콘텐츠 규칙, 대시보드 정합성 교차 검증",
    assignee: "qa-agent",
    depends_on: ["Next.js 앱 + GitHub + Supabase + Vercel"]
  }
])
```

### Phase 2: 커리큘럼 → 콘텐츠/스토리 (팬아웃)

**실행 방식:** curriculum-designer 완료 후 content-creator + story-writer 병렬 실행

팀원 간 통신:
- curriculum-designer 완료 → `SendMessage(to: "content-creator")` + `SendMessage(to: "story-writer")`: `_workspace/01_curriculum_spec.md` 경로 전달
- content-creator ↔ story-writer: 어휘 목록 교차 확인 (`SendMessage`)

**산출물 저장:**
| 팀원 | 출력 경로 |
|------|----------|
| curriculum-designer | `_workspace/01_curriculum_spec.md` |
| content-creator | `_workspace/02_content_sessions.md` |
| story-writer | `_workspace/02_story_scripts.md` |

### Phase 3: 앱 개발

Phase 2 완료 확인 후 developer 작업 시작.

developer의 내부 실행 순서:
1. GitHub MCP로 `yooha-english` 저장소 생성
2. Next.js 프로젝트 스캐폴딩 + 컴포넌트 구현
3. Supabase MCP로 스키마 생성 → **즉시 qa-agent에게 증분 QA 요청**
4. Claude API 연동
5. GitHub MCP로 코드 푸시
6. Vercel MCP로 배포
7. 배포 URL → qa-agent에게 SendMessage

### Phase 4: QA + 버그 수정 루프

qa-agent 검증 → Fail 발견 시 developer에게 즉시 SendMessage → 수정 → 재검증

**최대 2회 재시도**: 2회 후에도 Fail이면 리더에게 에스컬레이션.

### Phase 5: 정리

1. 모든 팀원에게 종료 요청 (SendMessage to: "all")
2. TeamDelete
3. `_workspace/` 보존
4. 사용자에게 최종 보고:
   - Vercel 배포 URL
   - Supabase 프로젝트 URL
   - GitHub 저장소 URL
   - QA 결과 요약

## 데이터 흐름

```
CLAUDE.md
    ↓
[curriculum-designer] → 01_curriculum_spec.md
                                ↓           ↓
              [content-creator]   [story-writer]
                     ↓                  ↓
          02_content_sessions.md  02_story_scripts.md
                     ↓                  ↓
                     └──────┬───────────┘
                             ↓
                       [developer]
                    GitHub + Supabase + Vercel
                             ↓
                    03_deployment_info.md
                             ↓
                        [qa-agent]
                             ↓
                    04_qa_report.md → 최종 배포 URL 보고
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| curriculum-designer 실패 | 1회 재시도. 재실패 시 리더가 직접 기본 커리큘럼 스펙 생성 |
| content-creator 또는 story-writer 실패 | 완료된 쪽 결과만 사용, developer에게 누락 알림 |
| GitHub/Supabase/Vercel MCP 실패 | developer가 로컬 저장 + 수동 단계 안내 문서 생성 |
| QA Fail 2회 초과 | 리더가 버그 목록 수동 검토 후 user에게 에스컬레이션 |
| 팀원 타임아웃 | TaskGet으로 상태 확인 → 현재까지 결과로 다음 Phase 진행 |

## 테스트 시나리오

### 정상 흐름
1. `yooha-orchestrator` 스킬 트리거
2. Phase 1: yooha-team 생성 (5명), 5개 작업 등록
3. Phase 2: curriculum-designer 완료 → content-creator + story-writer 병렬 시작
4. Phase 3: developer가 GitHub → Supabase → Vercel 순서로 자동화
5. Phase 4: qa-agent 증분 QA + 최종 검증 → PASS
6. Phase 5: 팀 정리 + Vercel URL 보고
7. 예상 결과: https://yooha-english.vercel.app 접근 가능

### 에러 흐름
1. Phase 3에서 Vercel MCP 배포 실패
2. developer가 빌드 로그 확인 → 에러 수정 → 재배포 시도
3. 재배포 성공 시 qa-agent에게 URL 전달
4. 재배포도 실패 시: `_workspace/03_deployment_info.md`에 에러 로그 기록 + 리더에게 에스컬레이션
5. 리더가 user에게 "Vercel 배포 수동 개입 필요" 안내
