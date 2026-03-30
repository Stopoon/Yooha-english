import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { seedSessions } from '@/lib/seed-data'

export async function GET() {
  await seedSessions()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('level', { ascending: true })
    .order('order_in_level', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sessions: data })
}
