import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Session = {
  id: string
  level: number
  order_in_level: number
  title: string
  phonics_pattern: string
  vocab_set: VocabItem[]
  game_type: 'phonics_match' | 'word_builder' | 'memory_match' | 'sentence_fill'
  story_unlock_after: number
  created_at: string
}

export type VocabItem = {
  word: string
  pronunciation: string
  meaning_kr: string
  example_en: string
  example_kr: string
  character?: string
  theme?: string
}

export type LearningLog = {
  id: string
  session_id: string
  completed_at: string
  phonics_score: number
  vocab_score: number
  game_score: number
  duration_seconds: number
  streak_day: number
}

export type Badge = {
  id: string
  badge_type: 'streak' | 'level_up' | 'perfect_score' | 'story_unlock' | 'first_session'
  badge_name: string
  badge_emoji: string
  earned_at: string
  session_id?: string
}

export type WeeklyStats = {
  total_sessions: number
  today_sessions: number
  week_sessions: number
  avg_phonics: number
  avg_vocab: number
  max_streak: number
  total_seconds: number
}
