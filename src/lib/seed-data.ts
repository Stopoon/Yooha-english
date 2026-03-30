import { supabase } from './supabase'

export const SESSION_SEED = [
  // 레벨 1: 단모음 'a' + 기본 자음
  {
    level: 1,
    order_in_level: 1,
    title: '뭉치와 cat!',
    phonics_pattern: 'short-a (cat, mat, hat)',
    game_type: 'phonics_match',
    vocab_set: [
      { word: 'cat', pronunciation: '캣', meaning_kr: '고양이', example_en: 'Nyangi is a cat.', example_kr: '냥이는 고양이예요.', character: 'nyangi' },
      { word: 'mat', pronunciation: '맷', meaning_kr: '매트', example_en: 'Moongchi sat on the mat.', example_kr: '뭉치가 매트에 앉았어요.', character: 'moongchi' },
      { word: 'hat', pronunciation: '햇', meaning_kr: '모자', example_en: 'Hawon has a hat.', example_kr: '하원이는 모자를 가지고 있어요.', character: null },
      { word: 'bat', pronunciation: '뱃', meaning_kr: '박쥐 / 방망이', example_en: 'The bat is black.', example_kr: '박쥐는 검정색이에요.', character: null },
      { word: 'rat', pronunciation: '랫', meaning_kr: '쥐', example_en: 'A rat ran fast.', example_kr: '쥐가 빠르게 달렸어요.', character: null },
    ],
  },
  // 레벨 1: 단모음 'a' 동물 어휘
  {
    level: 1,
    order_in_level: 2,
    title: '동물 친구들',
    phonics_pattern: 'short-a (ran, can, pan)',
    game_type: 'word_builder',
    vocab_set: [
      { word: 'dog', pronunciation: '독', meaning_kr: '강아지', example_en: 'Moongchi is my dog.', example_kr: '뭉치는 내 강아지예요.', character: 'moongchi' },
      { word: 'rabbit', pronunciation: '래빗', meaning_kr: '토끼', example_en: 'Kongi is a white rabbit.', example_kr: '콩이는 하얀 토끼예요.', character: 'kongi' },
      { word: 'fish', pronunciation: '피쉬', meaning_kr: '물고기', example_en: 'Grandma cooks fish.', example_kr: '외할머니가 생선을 요리해요.', character: null },
      { word: 'bird', pronunciation: '버드', meaning_kr: '새', example_en: 'A bird can fly.', example_kr: '새는 날 수 있어요.', character: null },
      { word: 'frog', pronunciation: '프록', meaning_kr: '개구리', example_en: 'The frog can jump.', example_kr: '개구리는 뛸 수 있어요.', character: null },
    ],
  },
  // 레벨 1: 가족 어휘
  {
    level: 1,
    order_in_level: 3,
    title: '우리 가족',
    phonics_pattern: 'short-a blends (clap, snap)',
    game_type: 'memory_match',
    vocab_set: [
      { word: 'mom', pronunciation: '맘', meaning_kr: '엄마', example_en: 'My mom is kind.', example_kr: '우리 엄마는 친절해요.', character: null },
      { word: 'dad', pronunciation: '대드', meaning_kr: '아빠', example_en: 'My dad is tall.', example_kr: '우리 아빠는 키가 커요.', character: null },
      { word: 'grandma', pronunciation: '그랜마', meaning_kr: '할머니', example_en: 'Grandma makes rice soup.', example_kr: '외할머니는 쌀국을 만들어요.', character: null },
      { word: 'aunt', pronunciation: '앤트', meaning_kr: '이모/고모', example_en: 'My aunt has a cat.', example_kr: '이모는 고양이가 있어요.', character: 'nyangi' },
      { word: 'family', pronunciation: '패밀리', meaning_kr: '가족', example_en: 'I love my family.', example_kr: '나는 우리 가족을 사랑해요.', character: null },
    ],
  },
  // 레벨 1: 학교와 친구
  {
    level: 1,
    order_in_level: 4,
    title: '학교 가는 날',
    phonics_pattern: 'short-e (pen, hen, ten)',
    game_type: 'sentence_fill',
    vocab_set: [
      { word: 'friend', pronunciation: '프렌드', meaning_kr: '친구', example_en: 'Hayun is my friend.', example_kr: '하윤이는 내 친구예요.', character: null },
      { word: 'school', pronunciation: '스쿨', meaning_kr: '학교', example_en: 'We go to school.', example_kr: '우리는 학교에 가요.', character: null },
      { word: 'book', pronunciation: '북', meaning_kr: '책', example_en: 'Nyangi loves books.', example_kr: '냥이는 책을 좋아해요.', character: 'nyangi' },
      { word: 'pen', pronunciation: '펜', meaning_kr: '펜', example_en: 'I have a red pen.', example_kr: '나는 빨간 펜이 있어요.', character: null },
      { word: 'run', pronunciation: '런', meaning_kr: '달리다', example_en: 'Junhee can run fast.', example_kr: '준희는 빠르게 달릴 수 있어요.', character: null },
    ],
  },
  // 레벨 1: 리뷰 세션 (5번째 → 동화 해금)
  {
    level: 1,
    order_in_level: 5,
    title: '복습: 레벨 1 ⭐',
    phonics_pattern: 'review: short-a, short-e',
    game_type: 'memory_match',
    story_unlock_after: 1,
    vocab_set: [
      { word: 'cat', pronunciation: '캣', meaning_kr: '고양이', example_en: 'I see a cat.', example_kr: '고양이가 보여요.', character: 'nyangi' },
      { word: 'dog', pronunciation: '독', meaning_kr: '강아지', example_en: 'My dog runs.', example_kr: '내 강아지가 달려요.', character: 'moongchi' },
      { word: 'mom', pronunciation: '맘', meaning_kr: '엄마', example_en: 'I love mom.', example_kr: '엄마를 사랑해요.', character: null },
      { word: 'friend', pronunciation: '프렌드', meaning_kr: '친구', example_en: 'Chaeyul is my friend.', example_kr: '채율이는 내 친구예요.', character: null },
      { word: 'run', pronunciation: '런', meaning_kr: '달리다', example_en: 'We run and play.', example_kr: '우리는 달리고 놀아요.', character: null },
    ],
  },
  // 레벨 2: 단어 패밀리 -at, -an
  {
    level: 2,
    order_in_level: 1,
    title: '-at, -an 패밀리',
    phonics_pattern: 'word families: -at, -an',
    game_type: 'word_builder',
    vocab_set: [
      { word: 'apple', pronunciation: '애플', meaning_kr: '사과', example_en: 'Jaehee eats an apple.', example_kr: '재희는 사과를 먹어요.', character: null },
      { word: 'rice', pronunciation: '라이스', meaning_kr: '쌀밥', example_en: 'Grandma makes rice.', example_kr: '외할머니는 밥을 만들어요.', character: null },
      { word: 'soup', pronunciation: '숩', meaning_kr: '국', example_en: 'The soup is warm.', example_kr: '국이 따뜻해요.', character: null },
      { word: 'carrot', pronunciation: '캐럿', meaning_kr: '당근', example_en: 'Kongi likes carrots.', example_kr: '콩이는 당근을 좋아해요.', character: 'kongi' },
      { word: 'happy', pronunciation: '해피', meaning_kr: '행복한', example_en: 'I am happy today.', example_kr: '나는 오늘 행복해요.', character: null },
    ],
  },
]

export async function seedSessions() {
  const { data: existing } = await supabase.from('sessions').select('id').limit(1)
  if (existing && existing.length > 0) return

  const { error } = await supabase.from('sessions').insert(
    SESSION_SEED.map(s => ({
      ...s,
      story_unlock_after: s.story_unlock_after ?? 5,
    }))
  )
  if (error) console.error('Seed error:', error)
}
