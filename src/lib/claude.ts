import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const FRIENDS = ['Hawon', 'Hayun', 'Chaeyul', 'Junhee', 'Jaehee', 'Jimin']
const ANIMALS = [
  { name: 'Moongchi', kr: '뭉치', type: '강아지' },
  { name: 'Nyangi', kr: '냥이', type: '고양이' },
  { name: 'Kongi', kr: '콩이', type: '토끼' },
]

export async function generateStory(params: {
  level: number
  learnedVocab: string[]
  sessionCount: number
}) {
  const friend = FRIENDS[params.sessionCount % FRIENDS.length]
  const animal = ANIMALS[params.sessionCount % ANIMALS.length]

  const prompt = `당신은 유하(8세, 한국 초등학교 3학년)를 위한 영어 동화 작가입니다.

[유하의 세계]
- 주인공: 유하 (Yooha)
- 등장 친구: ${friend}
- 동물 캐릭터: ${animal.name} (${animal.kr}, ${animal.type})
- 가족: 외할머니(grandma)가 따뜻한 조연으로 등장

[학습 연계]
- 레벨: ${params.level}
- 오늘 배운 어휘: ${params.learnedVocab.join(', ')}
- 이 단어들이 이야기 속에 자연스럽게 등장해야 합니다

[이야기 규칙]
- 길이: 150~200 단어
- 문장: 짧고 단순하게 (4~8 단어)
- 결말: 따뜻하고 긍정적 (외할머니 집밥 장면 권장)
- 절대 금지: 피자, 햄버거, 무서운 장면, 슬픈 결말
- 문법 설명 없음

[출력 형식]
제목을 먼저 쓰고, 영어 이야기를 2~3 문단으로 나누세요.
각 문단 아래에 한국어 번역을 추가하세요.
학습한 단어는 **굵게** 표시하세요.
마지막에 "오늘 배운 단어:" 섹션을 추가하세요.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
