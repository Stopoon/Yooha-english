import { supabase } from './supabase'

export const SESSION_SEED = [
  // ===== 레벨 1: 단모음 & 기초 어휘 (초3 기준) =====
  {
    level: 1,
    order_in_level: 1,
    title: '뭉치와 short-a! 🐶',
    phonics_pattern: 'short-a (cat, bat, hat, mat, can, fan)',
    game_type: 'phonics_match',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'cat', pronunciation: '캣', meaning_kr: '고양이', example_en: 'Nyangi is a cute cat.', example_kr: '냥이는 귀여운 고양이예요.', character: 'nyangi' },
      { word: 'bat', pronunciation: '뱃', meaning_kr: '박쥐/방망이', example_en: 'The bat can fly at night.', example_kr: '박쥐는 밤에 날 수 있어요.', character: null },
      { word: 'hat', pronunciation: '햇', meaning_kr: '모자', example_en: 'Hawon wears a red hat.', example_kr: '하원이는 빨간 모자를 써요.', character: null },
      { word: 'mat', pronunciation: '맷', meaning_kr: '매트/돗자리', example_en: 'Moongchi sleeps on the mat.', example_kr: '뭉치는 매트 위에서 자요.', character: 'moongchi' },
      { word: 'can', pronunciation: '캔', meaning_kr: '할 수 있다', example_en: 'I can read and write well.', example_kr: '나는 잘 읽고 쓸 수 있어요.', character: null },
      { word: 'fan', pronunciation: '팬', meaning_kr: '선풍기', example_en: 'The fan keeps us cool.', example_kr: '선풍기가 우리를 시원하게 해요.', character: null },
    ],
  },
  {
    level: 1,
    order_in_level: 2,
    title: '동물 친구들 🐾',
    phonics_pattern: 'short-e (pet, bed, red, wet, leg)',
    game_type: 'memory_match',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'dog', pronunciation: '독', meaning_kr: '강아지', example_en: 'Moongchi is my favorite dog.', example_kr: '뭉치는 내가 제일 좋아하는 강아지예요.', character: 'moongchi' },
      { word: 'rabbit', pronunciation: '래빗', meaning_kr: '토끼', example_en: 'Kongi is a fluffy white rabbit.', example_kr: '콩이는 복슬복슬한 흰 토끼예요.', character: 'kongi' },
      { word: 'fish', pronunciation: '피쉬', meaning_kr: '물고기', example_en: 'The fish swims in the pond.', example_kr: '물고기가 연못에서 헤엄쳐요.', character: null },
      { word: 'bird', pronunciation: '버드', meaning_kr: '새', example_en: 'The little bird sings sweetly.', example_kr: '작은 새가 예쁘게 노래해요.', character: null },
      { word: 'frog', pronunciation: '프록', meaning_kr: '개구리', example_en: 'The green frog jumps high.', example_kr: '초록 개구리가 높이 뛰어요.', character: null },
      { word: 'tiger', pronunciation: '타이거', meaning_kr: '호랑이', example_en: 'The tiger is very strong.', example_kr: '호랑이는 매우 강해요.', character: null },
    ],
  },
  {
    level: 1,
    order_in_level: 3,
    title: '우리 가족 💕',
    phonics_pattern: 'short-i (big, sit, hit, lip, tip, zip)',
    game_type: 'memory_match',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'mom', pronunciation: '맘', meaning_kr: '엄마', example_en: 'My mom cooks delicious food.', example_kr: '우리 엄마는 맛있는 음식을 만들어요.', character: null },
      { word: 'dad', pronunciation: '대드', meaning_kr: '아빠', example_en: 'My dad is strong and kind.', example_kr: '우리 아빠는 강하고 친절해요.', character: null },
      { word: 'grandma', pronunciation: '그랜마', meaning_kr: '할머니', example_en: 'Grandma tells me good stories.', example_kr: '할머니는 나에게 좋은 이야기를 해줘요.', character: null },
      { word: 'sister', pronunciation: '시스터', meaning_kr: '언니/여동생', example_en: 'My sister and I play together.', example_kr: '언니와 나는 함께 놀아요.', character: null },
      { word: 'aunt', pronunciation: '앤트', meaning_kr: '이모/고모', example_en: 'My aunt visits on weekends.', example_kr: '이모는 주말에 방문해요.', character: null },
      { word: 'family', pronunciation: '패밀리', meaning_kr: '가족', example_en: 'I love spending time with my family.', example_kr: '나는 가족과 시간 보내는 걸 좋아해요.', character: null },
    ],
  },
  {
    level: 1,
    order_in_level: 4,
    title: '학교 가는 날 🎒',
    phonics_pattern: 'short-o (hot, top, box, fox, pop)',
    game_type: 'sentence_fill',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'friend', pronunciation: '프렌드', meaning_kr: '친구', example_en: 'Hayun is my best friend.', example_kr: '하윤이는 내 제일 친한 친구예요.', character: null },
      { word: 'school', pronunciation: '스쿨', meaning_kr: '학교', example_en: 'We study hard at school.', example_kr: '우리는 학교에서 열심히 공부해요.', character: null },
      { word: 'book', pronunciation: '북', meaning_kr: '책', example_en: 'I read a new book every week.', example_kr: '나는 매주 새 책을 읽어요.', character: null },
      { word: 'teacher', pronunciation: '티쳐', meaning_kr: '선생님', example_en: 'Our teacher is very smart.', example_kr: '우리 선생님은 매우 똑똑해요.', character: null },
      { word: 'class', pronunciation: '클래스', meaning_kr: '수업/반', example_en: 'I like my English class.', example_kr: '나는 영어 수업을 좋아해요.', character: null },
      { word: 'study', pronunciation: '스터디', meaning_kr: '공부하다', example_en: 'I study with Chaeyul after school.', example_kr: '학교 끝나고 채율이랑 공부해요.', character: null },
    ],
  },
  {
    level: 1,
    order_in_level: 5,
    title: '색깔과 모양 🎨',
    phonics_pattern: 'short-u (run, sun, fun, bun, cup)',
    game_type: 'memory_match',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'red', pronunciation: '레드', meaning_kr: '빨간색', example_en: 'Kongi has a red ribbon.', example_kr: '콩이는 빨간 리본을 해요.', character: 'kongi' },
      { word: 'blue', pronunciation: '블루', meaning_kr: '파란색', example_en: 'The sky is bright blue.', example_kr: '하늘은 밝은 파란색이에요.', character: null },
      { word: 'green', pronunciation: '그린', meaning_kr: '초록색', example_en: 'The grass is green and soft.', example_kr: '풀이 초록색이고 부드러워요.', character: null },
      { word: 'big', pronunciation: '빅', meaning_kr: '큰', example_en: 'The elephant is very big.', example_kr: '코끼리는 매우 커요.', character: null },
      { word: 'small', pronunciation: '스몰', meaning_kr: '작은', example_en: 'Nyangi is small and cute.', example_kr: '냥이는 작고 귀여워요.', character: 'nyangi' },
      { word: 'round', pronunciation: '라운드', meaning_kr: '둥근', example_en: 'The ball is perfectly round.', example_kr: '공은 완벽하게 둥글어요.', character: null },
    ],
  },
  {
    level: 1,
    order_in_level: 6,
    title: '복습: 레벨 1 총정리 ⭐',
    phonics_pattern: 'review: short vowels a / e / i / o / u',
    game_type: 'memory_match',
    story_unlock_after: 1,
    vocab_set: [
      { word: 'cat', pronunciation: '캣', meaning_kr: '고양이', example_en: 'I love my cat Nyangi.', example_kr: '나는 내 고양이 냥이를 사랑해요.', character: 'nyangi' },
      { word: 'dog', pronunciation: '독', meaning_kr: '강아지', example_en: 'My dog Moongchi plays outside.', example_kr: '내 강아지 뭉치가 밖에서 놀아요.', character: 'moongchi' },
      { word: 'family', pronunciation: '패밀리', meaning_kr: '가족', example_en: 'We are a happy family.', example_kr: '우리는 행복한 가족이에요.', character: null },
      { word: 'school', pronunciation: '스쿨', meaning_kr: '학교', example_en: 'I go to school every morning.', example_kr: '나는 매일 아침 학교에 가요.', character: null },
      { word: 'green', pronunciation: '그린', meaning_kr: '초록색', example_en: 'I like green apples.', example_kr: '나는 초록 사과를 좋아해요.', character: null },
      { word: 'friend', pronunciation: '프렌드', meaning_kr: '친구', example_en: 'Junhee is a wonderful friend.', example_kr: '준희는 훌륭한 친구예요.', character: null },
    ],
  },

  // ===== 레벨 2: 장모음 & 확장 어휘 (초3 발전) =====
  {
    level: 2,
    order_in_level: 1,
    title: '마법의 long-a! 🪄',
    phonics_pattern: 'long-a: magic-e (cake, lake, name, came, brave, shake)',
    game_type: 'word_builder',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'cake', pronunciation: '케익', meaning_kr: '케이크', example_en: 'Mom made a yummy birthday cake.', example_kr: '엄마가 맛있는 생일 케이크를 만들었어요.', character: null },
      { word: 'lake', pronunciation: '레익', meaning_kr: '호수', example_en: 'We swim in the cool lake.', example_kr: '우리는 시원한 호수에서 수영해요.', character: null },
      { word: 'name', pronunciation: '네임', meaning_kr: '이름', example_en: 'My name is Yooha.', example_kr: '내 이름은 유하예요.', character: null },
      { word: 'game', pronunciation: '게임', meaning_kr: '게임/놀이', example_en: 'Let\'s play a fun word game!', example_kr: '재미있는 단어 게임을 해요!', character: null },
      { word: 'brave', pronunciation: '브레이브', meaning_kr: '용감한', example_en: 'Moongchi is very brave.', example_kr: '뭉치는 매우 용감해요.', character: 'moongchi' },
      { word: 'shake', pronunciation: '쉐이크', meaning_kr: '흔들다', example_en: 'Shake your hands and dance!', example_kr: '손을 흔들며 춤춰요!', character: null },
    ],
  },
  {
    level: 2,
    order_in_level: 2,
    title: '나무와 벌꿀 🌳🍯',
    phonics_pattern: 'long-e (tree, bee, sleep, sweet, teeth)',
    game_type: 'memory_match',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'tree', pronunciation: '트리', meaning_kr: '나무', example_en: 'The big tree gives cool shade.', example_kr: '큰 나무가 시원한 그늘을 만들어요.', character: null },
      { word: 'bee', pronunciation: '비', meaning_kr: '벌', example_en: 'A busy bee collects honey.', example_kr: '부지런한 벌이 꿀을 모아요.', character: null },
      { word: 'sleep', pronunciation: '슬립', meaning_kr: '자다', example_en: 'Kongi likes to sleep after lunch.', example_kr: '콩이는 점심 후 자는 것을 좋아해요.', character: 'kongi' },
      { word: 'teeth', pronunciation: '티스', meaning_kr: '이빨/치아', example_en: 'Brush your teeth twice a day.', example_kr: '하루에 두 번 이를 닦아요.', character: null },
      { word: 'sweet', pronunciation: '스윗', meaning_kr: '달콤한', example_en: 'This honey is so sweet.', example_kr: '이 꿀은 정말 달콤해요.', character: null },
      { word: 'between', pronunciation: '비트윈', meaning_kr: '사이에', example_en: 'I sat between Jaehee and Jimin.', example_kr: '재희와 지민 사이에 앉았어요.', character: null },
    ],
  },
  {
    level: 2,
    order_in_level: 3,
    title: '건강한 음식 🥗',
    phonics_pattern: 'long-i: magic-e (bike, like, time, five, wide)',
    game_type: 'sentence_fill',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'rice', pronunciation: '라이스', meaning_kr: '쌀밥', example_en: 'Grandma makes warm rice every morning.', example_kr: '할머니는 매일 아침 따뜻한 밥을 만들어요.', character: null },
      { word: 'soup', pronunciation: '숩', meaning_kr: '국/수프', example_en: 'The vegetable soup smells wonderful.', example_kr: '채소 국이 맛있는 냄새가 나요.', character: null },
      { word: 'carrot', pronunciation: '캐럿', meaning_kr: '당근', example_en: 'Kongi loves crunchy orange carrots.', example_kr: '콩이는 바삭한 주황 당근을 좋아해요.', character: 'kongi' },
      { word: 'healthy', pronunciation: '헬씨', meaning_kr: '건강한', example_en: 'Eating vegetables keeps you healthy.', example_kr: '채소를 먹으면 건강해져요.', character: null },
      { word: 'hungry', pronunciation: '헝그리', meaning_kr: '배고픈', example_en: 'I am so hungry after gym class.', example_kr: '체육 수업 후 너무 배고파요.', character: null },
      { word: 'delicious', pronunciation: '딜리셔스', meaning_kr: '맛있는', example_en: 'Mom\'s cooking is always delicious.', example_kr: '엄마의 요리는 항상 맛있어요.', character: null },
    ],
  },
  {
    level: 2,
    order_in_level: 4,
    title: '자음 블렌드 🔡',
    phonics_pattern: 'consonant blends: bl-, cl-, fl-, gl-, st-, str-',
    game_type: 'word_builder',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'black', pronunciation: '블랙', meaning_kr: '검은색', example_en: 'Nyangi has shiny black fur.', example_kr: '냥이는 반짝이는 검은 털이 있어요.', character: 'nyangi' },
      { word: 'flower', pronunciation: '플라워', meaning_kr: '꽃', example_en: 'The spring flowers are beautiful.', example_kr: '봄꽃이 아름다워요.', character: null },
      { word: 'clock', pronunciation: '클록', meaning_kr: '시계', example_en: 'The clock shows three o\'clock.', example_kr: '시계가 3시를 가리켜요.', character: null },
      { word: 'strong', pronunciation: '스트롱', meaning_kr: '강한', example_en: 'Dad is very strong.', example_kr: '아빠는 매우 강해요.', character: null },
      { word: 'glad', pronunciation: '글래드', meaning_kr: '기쁜', example_en: 'I am so glad to see you!', example_kr: '너를 만나서 정말 기뻐요!', character: null },
      { word: 'star', pronunciation: '스타', meaning_kr: '별', example_en: 'Stars shine brightly at night.', example_kr: '밤에 별이 밝게 빛나요.', character: null },
    ],
  },
  {
    level: 2,
    order_in_level: 5,
    title: '복습: 레벨 2 총정리 ⭐⭐',
    phonics_pattern: 'review: long vowels & consonant blends',
    game_type: 'memory_match',
    story_unlock_after: 2,
    vocab_set: [
      { word: 'cake', pronunciation: '케익', meaning_kr: '케이크', example_en: 'I love birthday cake!', example_kr: '생일 케이크가 좋아요!', character: null },
      { word: 'tree', pronunciation: '트리', meaning_kr: '나무', example_en: 'Climb the tall tree.', example_kr: '키 큰 나무에 올라가요.', character: null },
      { word: 'healthy', pronunciation: '헬씨', meaning_kr: '건강한', example_en: 'Stay healthy every day.', example_kr: '매일 건강하게 지내요.', character: null },
      { word: 'black', pronunciation: '블랙', meaning_kr: '검은색', example_en: 'The night sky is black.', example_kr: '밤하늘은 검은색이에요.', character: null },
      { word: 'brave', pronunciation: '브레이브', meaning_kr: '용감한', example_en: 'Be brave like Moongchi!', example_kr: '뭉치처럼 용감해요!', character: 'moongchi' },
      { word: 'delicious', pronunciation: '딜리셔스', meaning_kr: '맛있는', example_en: 'The soup is really delicious.', example_kr: '국이 정말 맛있어요.', character: null },
    ],
  },

  // ===== 레벨 3: 이중자음 & 심화 어휘 (초3 응용) =====
  {
    level: 3,
    order_in_level: 1,
    title: 'sh, ch, th 마법 🔮',
    phonics_pattern: 'digraphs: sh-, ch-, th-',
    game_type: 'phonics_match',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'ship', pronunciation: '쉽', meaning_kr: '배/선박', example_en: 'The big ship sails the ocean.', example_kr: '큰 배가 바다를 항해해요.', character: null },
      { word: 'share', pronunciation: '쉐어', meaning_kr: '나누다', example_en: 'We share our snacks with friends.', example_kr: '우리는 친구와 과자를 나눠요.', character: null },
      { word: 'chair', pronunciation: '체어', meaning_kr: '의자', example_en: 'Please sit down on the chair.', example_kr: '의자에 앉으세요.', character: null },
      { word: 'think', pronunciation: '씽크', meaning_kr: '생각하다', example_en: 'Think carefully before you answer.', example_kr: '대답하기 전에 잘 생각해요.', character: null },
      { word: 'three', pronunciation: '쓰리', meaning_kr: '셋/3', example_en: 'I have three best friends.', example_kr: '나는 가장 친한 친구가 셋이에요.', character: null },
      { word: 'shout', pronunciation: '샤웃', meaning_kr: '소리치다', example_en: 'We shout with joy on the playground.', example_kr: '운동장에서 기뻐서 소리쳐요.', character: null },
    ],
  },
  {
    level: 3,
    order_in_level: 2,
    title: '신나는 동작 단어 🏃',
    phonics_pattern: 'action words + ow / ew (throw, grow, know)',
    game_type: 'sentence_fill',
    story_unlock_after: 5,
    vocab_set: [
      { word: 'dance', pronunciation: '댄스', meaning_kr: '춤추다', example_en: 'Yooha loves to dance with friends.', example_kr: '유하는 친구들과 춤추는 걸 좋아해요.', character: null },
      { word: 'throw', pronunciation: '쓰로우', meaning_kr: '던지다', example_en: 'Throw the ball to Jaehee!', example_kr: '재희에게 공을 던져요!', character: null },
      { word: 'catch', pronunciation: '캐취', meaning_kr: '잡다', example_en: 'Can you catch the ball?', example_kr: '공을 잡을 수 있어요?', character: null },
      { word: 'climb', pronunciation: '클라임', meaning_kr: '오르다', example_en: 'I climb the big tree every day.', example_kr: '나는 매일 큰 나무에 올라요.', character: null },
      { word: 'whisper', pronunciation: '위스퍼', meaning_kr: '속삭이다', example_en: 'Whisper a secret to Jimin.', example_kr: '지민에게 비밀을 속삭여요.', character: null },
      { word: 'explore', pronunciation: '익스플로어', meaning_kr: '탐험하다', example_en: 'Let\'s explore the garden together.', example_kr: '함께 정원을 탐험해요.', character: null },
    ],
  },
]

export async function seedSessions() {
  // 중복 확인: 총 행 수가 고유 (level, order_in_level) 조합과 다르면 재시드
  const { data: existing } = await supabase
    .from('sessions')
    .select('level, order_in_level')

  if (existing) {
    const unique = new Set(existing.map(s => `${s.level}-${s.order_in_level}`))
    const expectedCount = SESSION_SEED.length

    // 비어있거나 중복이 있거나 콘텐츠가 부족하면 전체 재시드
    if (existing.length === 0 || existing.length !== unique.size || unique.size < expectedCount) {
      // 기존 데이터 모두 삭제
      await supabase.from('sessions').delete().gte('level', 1)

      // 새 데이터 삽입
      const { error } = await supabase.from('sessions').insert(
        SESSION_SEED.map(s => ({
          ...s,
          vocab_set: s.vocab_set,
        }))
      )
      if (error) console.error('Seed error:', error)
    }
  }
}
