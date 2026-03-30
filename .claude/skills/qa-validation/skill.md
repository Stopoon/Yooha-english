---
name: qa-validation
description: "유하 영어학습 앱의 API 경계면 정합성, 모바일 UI, 8~9세 콘텐츠 규칙 준수, 부모 대시보드 데이터 정합성을 교차 비교 방식으로 검증한다. QA 검증, UI 점검, 데이터 정합성, 연령 적합성 확인, 금지 소재 검사 요청 시 반드시 이 스킬을 사용할 것."
---

# QA Validation — 교차 비교 기반 품질 검증

배포된 앱을 "경계면 교차 비교" 방식으로 검증하고 `_workspace/04_qa_report.md`에 결과를 출력한다.

## 핵심 원칙: 존재 확인이 아닌 교차 비교

단순히 "파일이 있는가?"가 아니라, 두 지점을 동시에 읽고 연결이 맞는지 확인한다.

```
나쁜 QA: "API route가 존재함 ✓", "훅 파일이 존재함 ✓"
좋은 QA: API route의 응답 shape과 훅의 타입 파라미터를 동시에 읽고 비교
```

## 검증 영역 1: API ↔ 프론트 경계면

각 API route에 대해:

```
1. Grep으로 NextResponse.json() 호출부 찾기
2. 해당 route에 대응하는 훅 파일 Read
3. fetchJson<T> 또는 useSWR의 T 타입 확인
4. API 응답 shape과 T가 일치하는지 라인별 비교

주의 패턴:
- 래핑 구조: API가 { data: [...] }인데 훅이 배열 직접 기대
- 필드명: DB snake_case → API camelCase → 프론트 타입 일치 여부
- 페이지네이션: { items, total, page } vs 배열 기대
```

**점검 대상 경로:**
```
/api/sessions → useSession 훅 타입
/api/progress → 부모 대시보드 컴포넌트 props
/api/story/generate → 스토리 컴포넌트 응답 처리
```

## 검증 영역 2: 라우터 경로 정합성

```
1. Glob으로 src/app/**/page.tsx 경로 목록 추출
2. URL 경로로 변환 ((student) 그룹 제거, [id] → 파라미터)
3. Grep으로 코드 내 href=, router.push(, redirect( 수집
4. 각 링크가 실제 page.tsx와 1:1 매핑되는지 확인

특히 주의:
- (student) 그룹: URL에서 그룹 이름 제거됨
- (parent) 그룹: 별도 레이아웃 적용
- /session/[id] 동적 경로: 링크에 실제 id 값 전달 여부
```

## 검증 영역 3: 모바일 UI (코드 레벨)

```bash
# 터치 타겟 크기 확인
Grep "h-8|h-9|h-10" --glob "*.tsx"  # 44px 미만 버튼 찾기
# → h-11(44px) 이상이어야 함

# 폰트 크기 확인
Grep "text-xs|text-sm" --glob "*.tsx"  # 작은 텍스트 찾기
# → 학생 화면에서는 text-base(16px) 이상이어야 함

# 반응형 확인
Grep "overflow-x|scrollbar" --glob "*.tsx"  # 가로 스크롤 방지 확인
```

**체크리스트:**
- [ ] 모든 게임 버튼 h-11(44px) 이상
- [ ] 학생 화면 폰트 text-base 이상
- [ ] 카드 컴포넌트 rounded-2xl + 충분한 padding
- [ ] 게임 그리드 gap-3 이상 (터치 간격)
- [ ] 가로 스크롤 없음 (overflow-hidden 적용)

## 검증 영역 4: 콘텐츠 규칙 준수

```bash
# 금지 소재 전수 검색
Grep "pizza|피자|hamburger|햄버거|burger" --glob "*.ts,*.tsx,*.json,*.md"

# 금지 표현 검색 (학생 화면 파일만)
Grep "틀렸|오답|점수|시험|테스트" --glob "src/app/(student)/**/*.tsx"

# 유하 세계 등장 확인
Grep "Hawon|Hayun|Chaeyul|Junhee|Jaehee|Jimin|하원|하윤|채율|준희|재희|지민"
Grep "Moongchi|Nyangi|Kongi|뭉치|냥이|콩이"
```

**체크리스트:**
- [ ] 피자/햄버거 소재 없음 (0건)
- [ ] 시험/점수 압박 표현 없음 (학생 화면)
- [ ] 친구 이름 6명 중 최소 3명 콘텐츠에 등장
- [ ] 동물 캐릭터 3종 UI에 존재
- [ ] 격려 표현 사용 (다시 해볼까요, 잘했어요 등)

## 검증 영역 5: 부모 대시보드 데이터 정합성

```
1. learning_logs 집계 쿼리 Read (Supabase 쿼리 코드)
2. 대시보드 컴포넌트 props 타입 Read
3. 집계 쿼리의 반환 필드명 ↔ 컴포넌트 사용 필드명 교차 비교

streak_day 계산 검증:
- learning_logs에서 날짜별 그룹핑 로직 확인
- 연속 여부 판단 로직이 올바른지 (날짜 gap = 1일)

진도율 계산 검증:
- phonics_score, vocab_score 집계가 올바른지
- 취약 어휘: correct_count / total_count < 0.5 조건 확인
```

## 검증 영역 6: Claude API 연동

```
- ANTHROPIC_API_KEY 환경변수 사용 (하드코딩 없음)
- 에러 응답 처리 코드 존재 (try/catch)
- 폴백: API 실패 시 정적 동화로 대체
- 프롬프트 내 금지 소재 없음
```

## 보고서 형식

`_workspace/04_qa_report.md`:

```markdown
# QA 검증 보고서

## 최종 판정: PASS / FAIL

## 영역별 결과

### 1. API ↔ 프론트 경계면
| API | 훅 | Shape 일치 | 판정 |
|-----|---|-----------|------|
| /api/sessions | useSession | ✓ | PASS |

### 2. 라우터 경로
| 링크 | 대응 page.tsx | 판정 |
|------|--------------|------|

### 3. 모바일 UI
[항목별 Pass/Fail]

### 4. 콘텐츠 규칙
[검색 결과 + Pass/Fail]

### 5. 대시보드 데이터
[교차 비교 결과]

## 발견된 버그
[버그 목록 + 수정 권고]

## 재검증 필요 항목
[Fail 항목 수정 후 확인 필요 목록]
```
