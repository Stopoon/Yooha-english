import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const [statsResult, weakResult, badgesResult, recentResult] = await Promise.all([
    supabase.from('weekly_stats').select('*').single(),
    supabase.from('weak_vocab').select('*').limit(10),
    supabase.from('badges').select('*').order('earned_at', { ascending: false }).limit(10),
    supabase.from('learning_logs').select('*, sessions(title, level)').order('completed_at', { ascending: false }).limit(7),
  ])

  return NextResponse.json({
    stats: statsResult.data,
    weakVocab: weakResult.data ?? [],
    badges: badgesResult.data ?? [],
    recentLogs: recentResult.data ?? [],
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { session_id, phonics_score, vocab_score, game_score, duration_seconds } = body

  // 오늘 이미 학습했는지 확인 (스트릭 계산용)
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const { data: lastLog } = await supabase
    .from('learning_logs')
    .select('streak_day, completed_at')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  let streak_day = 1
  if (lastLog) {
    const lastDate = new Date(lastLog.completed_at).toISOString().split('T')[0]
    if (lastDate === yesterday) {
      streak_day = (lastLog.streak_day ?? 1) + 1
    } else if (lastDate === today) {
      streak_day = lastLog.streak_day ?? 1
    }
  }

  const { data, error } = await supabase
    .from('learning_logs')
    .insert({ session_id, phonics_score, vocab_score, game_score, duration_seconds, streak_day })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 배지 체크
  const newBadges = []
  if (phonics_score === 100 && vocab_score === 100) {
    newBadges.push({ badge_type: 'perfect_score', badge_name: '완벽해요!', badge_emoji: '💎', session_id })
  }
  if (streak_day === 3) {
    newBadges.push({ badge_type: 'streak', badge_name: '3일 연속!', badge_emoji: '🔥', session_id })
  }
  if (streak_day === 7) {
    newBadges.push({ badge_type: 'streak', badge_name: '7일 연속 챔피언!', badge_emoji: '🏆', session_id })
  }
  if (newBadges.length > 0) {
    await supabase.from('badges').insert(newBadges)
  }

  return NextResponse.json({ log: data, newBadges, streak_day })
}
