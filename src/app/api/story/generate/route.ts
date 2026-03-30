import { NextRequest, NextResponse } from 'next/server'
import { generateStory } from '@/lib/claude'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { level, learnedVocab, sessionCount, storyId } = await req.json()

  // 캐시 확인
  if (storyId) {
    const { data: cached } = await supabase
      .from('story_access')
      .select('generated_content')
      .eq('story_id', storyId)
      .not('generated_content', 'is', null)
      .single()

    if (cached?.generated_content) {
      return NextResponse.json({ story: cached.generated_content, cached: true })
    }
  }

  try {
    const story = await generateStory({ level, learnedVocab, sessionCount })

    if (storyId) {
      await supabase.from('story_access').upsert({
        story_id: storyId,
        generated_content: story,
        vocab_used: learnedVocab,
        level,
      }, { onConflict: 'story_id' })
    }

    return NextResponse.json({ story, cached: false })
  } catch (err) {
    console.error('Claude API error:', err)
    const fallback = `# Yooha and Moongchi 🐶

Yooha went outside with **Moongchi**.
It was a sunny day.

"Let's **run**, Moongchi!" said Yooha.
Moongchi ran fast.

Grandma called from inside.
"Yooha! Come and eat!"
They had warm rice soup together.

---
유하는 **뭉치**와 밖에 나갔어요.
맑은 날이었어요.
"**달리자**, 뭉치야!" 유하가 말했어요.
외할머니가 부르셨어요. "유하야! 밥 먹어!"
모두 함께 따뜻한 국을 먹었어요. 🍚`

    return NextResponse.json({ story: fallback, cached: false, fallback: true })
  }
}
