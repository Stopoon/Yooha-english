'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { WeeklyStats, Badge } from '@/lib/supabase'

type ProgressData = {
  stats: WeeklyStats | null
  weakVocab: { word: string; meaning_kr?: string; accuracy_pct: number }[]
  badges: Badge[]
  recentLogs: {
    id: string
    completed_at: string
    phonics_score: number
    vocab_score: number
    game_score: number
    duration_seconds: number
    streak_day: number
    sessions: { title: string; level: number } | null
  }[]
}

export default function ParentDashboard() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/progress')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">통계 불러오는 중...</p>
      </div>
    )
  }

  const stats = data?.stats
  const totalMin = Math.round((stats?.total_seconds ?? 0) / 60)

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 gap-5">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 text-2xl">←</Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">👨‍👩‍👧 부모 대시보드</h1>
          <p className="text-sm text-gray-500">유하의 학습 현황</p>
        </div>
      </div>

      {/* 오늘 학습 */}
      <div className={`rounded-3xl p-5 ${
        (stats?.today_sessions ?? 0) > 0
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-gray-50 border-2 border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">
            {(stats?.today_sessions ?? 0) > 0 ? '✅' : '📅'}
          </span>
          <div>
            <p className="font-bold text-gray-800">오늘 학습</p>
            <p className="text-gray-500 text-sm">
              {(stats?.today_sessions ?? 0) > 0
                ? `${stats!.today_sessions}세션 완료`
                : '아직 학습 전이에요'}
            </p>
          </div>
        </div>
      </div>

      {/* 핵심 지표 3개 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '연속 학습', value: `${stats?.max_streak ?? 0}일`, icon: '🔥', color: 'orange' },
          { label: '이번 주', value: `${stats?.week_sessions ?? 0}세션`, icon: '📊', color: 'blue' },
          { label: '총 학습', value: `${totalMin}분`, icon: '⏱️', color: 'purple' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <div className="text-2xl">{item.icon}</div>
            <div className="font-bold text-lg text-gray-800 mt-1">{item.value}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* 파닉스/어휘 평균 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-700 mb-4">📈 평균 성취도</h2>
        {[
          { label: '파닉스', value: stats?.avg_phonics ?? 0, color: 'bg-amber-400' },
          { label: '어휘', value: stats?.avg_vocab ?? 0, color: 'bg-blue-400' },
        ].map(item => (
          <div key={item.label} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-800">{item.value}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all`}
                style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* 취약 어휘 */}
      {(data?.weakVocab.length ?? 0) > 0 && (
        <div className="bg-red-50 rounded-3xl p-5 border-2 border-red-100">
          <h2 className="font-bold text-red-600 mb-3">⚠️ 취약 어휘 (정답률 50% 미만)</h2>
          <div className="flex flex-wrap gap-2">
            {data!.weakVocab.map(v => (
              <div key={v.word} className="bg-white rounded-xl px-3 py-1.5 text-sm shadow-sm">
                <span className="font-medium text-gray-800">{v.word}</span>
                <span className="text-gray-400 ml-1">({v.accuracy_pct}%)</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-400 mt-3">
            💡 이 단어들을 일상에서 말해주시면 도움이 돼요!
          </p>
        </div>
      )}

      {/* 최근 학습 기록 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-700 mb-4">📋 최근 학습 기록</h2>
        {(data?.recentLogs.length ?? 0) === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">아직 학습 기록이 없어요</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data!.recentLogs.map(log => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="text-2xl">
                  {(log.phonics_score + log.vocab_score + log.game_score) / 3 >= 90 ? '⭐' : '📘'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {log.sessions?.title ?? '세션'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.completed_at).toLocaleDateString('ko-KR')} ·
                    파닉스 {log.phonics_score}% · 어휘 {log.vocab_score}%
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(log.duration_seconds / 60)}분
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 배지 */}
      {(data?.badges.length ?? 0) > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-3">🏅 획득한 배지</h2>
          <div className="flex flex-wrap gap-3">
            {data!.badges.map(b => (
              <div key={b.id}
                className="flex items-center gap-2 bg-amber-50 rounded-2xl px-3 py-2 border border-amber-100">
                <span className="text-xl">{b.badge_emoji}</span>
                <span className="text-sm font-medium text-amber-700">{b.badge_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
