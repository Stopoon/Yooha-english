import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { seedSessions } from '@/lib/seed-data'

export async function GET() {
  await seedSessions()

  const [sessionsResult, logsResult] = await Promise.all([
    supabase
      .from('sessions')
      .select('*')
      .order('level', { ascending: true })
      .order('order_in_level', { ascending: true }),
    supabase
      .from('learning_logs')
      .select('session_id, completed_at')
      .order('completed_at', { ascending: false }),
  ])

  if (sessionsResult.error) {
    return NextResponse.json({ error: sessionsResult.error.message }, { status: 500 })
  }

  // 완료된 세션 ID 목록 (중복 제거)
  const completedIds = [...new Set((logsResult.data ?? []).map(l => l.session_id))]

  return NextResponse.json({ sessions: sessionsResult.data, completedIds })
}
