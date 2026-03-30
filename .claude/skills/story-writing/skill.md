---
name: story-writing
description: "유하 주인공 영어동화·만화 스크립트를 작성하고 Claude API 동적 생성 프롬프트를 설계한다. 세션 이수 후 복습용으로 제공되는 이야기를 유하의 친구·가족·동물 캐릭터로 채운다. 동화 작성, 만화 스크립트, 스토리 제작, Claude API 프롬프트 설계 요청 시 반드시 이 스킬을 사용할 것."
---

# Story Writing — 유하 맞춤 영어동화·만화 스크립트

커리큘럼 어휘를 자연스럽게 녹인 영어 이야기를 작성하고 `_workspace/02_story_scripts.md`에 출력한다.

## 이야기 설계 원칙

동화는 **학습의 연장이 아니라 보상**이다.
유하가 "드디어 내 이야기가 나왔다!"고 느끼도록, 현실의 유하를 이야기 속에 데려간다.

- 주인공은 언제나 유하 (Yooha) 또는 유하의 친구
- 동물 뭉치·냥이·콩이는 항상 든든한 동반자
- 결말은 따뜻하고 긍정적 — 외할머니 집에서 함께 밥 먹기 같은 장면
- 어휘는 해당 레벨에서 배운 단어 80% 이상 자연스럽게 등장
- 금지: 피자/햄버거, 무섭거나 슬픈 결말, 문법 설명

## 동화 레벨별 구성

### 레벨 1~2 동화: "뭉치를 찾아라!"

```
Find Moongchi! (뭉치를 찾아라!)

It was a sunny day.
Yooha looked for Moongchi.
"Moongchi! Moongchi!"

Moongchi ran to the mat.
He sat on the mat.
Yooha ran to Moongchi.
"I can see you, Moongchi!"

Hawon came to Yooha.
"Is that your dog?"
"Yes! He is my dog!"

Grandma made rice soup.
Yooha, Moongchi, and Hawon
all had a warm, happy day.

---
[한국어 번역]
맑은 날이었어요.
유하는 뭉치를 찾았어요.
"뭉치야! 뭉치야!"
...
```

### 레벨 3~4 동화: "냥이의 비밀 책"

```
Nyangi's Secret Book (냥이의 비밀 책)

[레벨 3~4 어휘 활용: school, desk, pencil, read, draw...]
Hayun found a small book near the desk.
The book had a cat on the cover.
"This is Nyangi's book!" said Hayun.
...
```

### 레벨 5~6 동화: "콩이의 마법 숲"

```
Kongi's Magic Forest (콩이의 마법 숲)

[레벨 5~6 어휘 활용: home, make, like, rain, tree...]
One rainy day, Yooha made a wish.
"I like the forest," she said.
Kongi the rabbit came out of the rain.
"Come with me," said Kongi.
...
```

## 만화 대본 (6컷 구성)

```
만화 1: "배지를 찾아서"

컷 1: [유하가 앱을 열고 있다]
대사: "오늘도 영어 공부 시작!"
지문: Yooha opens her tablet.

컷 2: [뭉치가 옆에 앉아 있다]
뭉치: "Woof! Let's go, Yooha!"
유하: "뭉치야, 오늘은 무슨 단어 배울까?"

컷 3: [어휘 카드 - rabbit 등장]
냥이: "This is a rabbit. Say it!"
유하: "Rab-bit! Rabbit!"

컷 4: [게임 화면 - 단어 조립]
유하: "R-A-B-B-I-T... rabbit! 완성!"

컷 5: [배지 획득 애니메이션]
지문: ⭐ 레벨업 배지 획득!
유하: "야호! 레벨 2!"

컷 6: [외할머니 댁 저녁 식사]
외할머니: "유하야, 밥 먹자!"
유하: "네! 오늘 영어 많이 배웠어요!"
```

## Claude API 동적 생성 프롬프트 템플릿

```python
STORY_PROMPT_TEMPLATE = """
당신은 유하(8세, 한국 초등학교 3학년)를 위한 영어 동화 작가입니다.

[유하의 세계]
- 친구들: {friend_names} 중 {featured_friend} 등장
- 동물 캐릭터: {animal_character} (뭉치=강아지, 냥이=고양이, 콩이=토끼)
- 가족: 외할머니(grandma)가 따뜻한 조연으로 등장

[학습 연계]
- 이번 세션 파닉스 패턴: {phonics_pattern}
- 오늘 배운 어휘: {vocab_list}
- 이 단어들이 이야기 속에 자연스럽게 등장해야 합니다

[이야기 규칙]
- 길이: 200~300 단어
- 문장: 짧고 단순하게 (4~8 단어)
- 결말: 따뜻하고 긍정적 (외할머니 집밥 장면 권장)
- 금지: 피자, 햄버거, 무서운 장면, 슬픈 결말

[출력 형식]
영어 이야기를 쓰고, 각 문단 아래에 한국어 번역을 넣어주세요.
학습한 단어는 **굵게** 표시해주세요.
마지막에 "오늘 배운 단어" 섹션으로 등장 단어를 요약해주세요.
"""
```

## 어휘 하이라이트 맵 (JSON)

```json
{
  "story_id": "level1_find_moongchi",
  "vocab_highlights": [
    {"word": "mat", "position": "paragraph_2", "context": "sat on the mat"},
    {"word": "ran", "position": "paragraph_2", "context": "Moongchi ran"},
    {"word": "dog", "position": "paragraph_3", "context": "my dog"}
  ]
}
```

## 출력 파일 형식

`_workspace/02_story_scripts.md`:

```markdown
# 유하 영어동화·만화 스크립트

## 동화 3편 (레벨별)
[전문 + 한국어 번역 + 어휘 하이라이트 표시]

## 만화 대본 2편
[컷별 대사 + 지문 + 배경 설명]

## Claude API 프롬프트 템플릿
[동적 생성용 Python 형식 프롬프트]

## 어휘 하이라이트 맵
[JSON 형식 - developer가 UI 하이라이트 기능 구현용]
```
