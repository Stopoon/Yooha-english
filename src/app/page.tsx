'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Session } from '@/lib/supabase'

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [streak, setStreak] = useState(0)
  const [todayDone, setTodayDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/sessions').then(r => r.json()),
      fetch('/api/progress').then(r => r.json()),
    ]).then(([sessData, progData]) => {
      setSessions(sessData.sessions ?? [])
      setStreak(progData.stats?.max_streak ?? 0)
      setTodayDone((progData.stats?.today_sessions ?? 0) > 0)
      setLoading(false)
    })
  }, [])

  const nextSession = sessions[0]
  const levelSessions = sessions.filter(s => s.level === (nextSession?.level ?? 1))
  const currentIndex = sessions.findIndex(s => s.id === nextSession?.id)

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 gap-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-600">유하의 영어 나라 🐶</h1>
          <p className="text-sm text-gray-500 mt-0.5">안녕, 유하야! 오늘도 함께 배워요 ✨</p>
        </div>
        <Link href="/parent/dashboard"
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
          👨‍👩‍👧 부모
        </Link>
      </div>

      {/* 스트릭 */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔥</span>
          <div>
            <p className="text-xl font-bold">{streak}일 연속 학습 중!</p>
            <p className="text-sm opacity-90">
              {streak === 0 ? '오늘 첫 번째 세션을 시작해봐요!' :
               streak < 3 ? '잘하고 있어요! 계속해봐요!' :
               '대단해요! 뭉치가 자랑스러워해요!'}
            </p>
          </div>
        </div>
        {/* 7일 점 표시 */}
        <div className="flex gap-2 mt-3">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i}
              className={`flex-1 h-2 rounded-full ${i < streak ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* 오늘의 세션 */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 animate-pulse">불러오는 중... 🐰</p>
        </div>
      ) : nextSession ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-700">
            {todayDone ? '✅ 오늘 학습 완료!' : '🎯 오늘의 세션'}
          </h2>

          <Link href={`/session/${nextSession.id}`}>
            <div className={`rounded-3xl p-5 shadow-md transition-all active:scale-95 ${
              todayDone
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-white border-2 border-amber-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl">
                  {nextSession.game_type === 'phonics_match' ? '🔤' :
                   nextSession.game_type === 'word_builder' ? '🔨' :
                   nextSession.game_type === 'memory_match' ? '🎴' : '✍️'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      레벨 {nextSession.level}
                    </span>
                    <span className="text-xs text-gray-400">
                      파닉스: {nextSession.phonics_pattern}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{nextSession.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    단어 {(nextSession.vocab_set as unknown[]).length}개 · 게임 1개 · 약 15분
                  </p>
                </div>
              </div>
              <div className={`mt-4 py-3 rounded-2xl text-center font-bold text-lg ${
                todayDone
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-400 text-white'
              }`}>
                {todayDone ? '복습하기 🔄' : '시작하기! 🚀'}
              </div>
            </div>
          </Link>

          {/* 레벨 진도 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">레벨 {nextSession.level} 진도</span>
              <span className="text-sm text-amber-600 font-bold">
                {Math.min(currentIndex + 1, levelSessions.length)}/{levelSessions.length} 세션
              </span>
            </div>
            <div className="flex gap-1.5">
              {levelSessions.map((s, i) => (
                <div key={s.id}
                  className={`flex-1 h-2.5 rounded-full ${
                    i < currentIndex ? 'bg-amber-400' :
                    i === currentIndex ? 'bg-amber-200' : 'bg-gray-100'
                  }`} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <span className="text-6xl">🎉</span>
          <p className="text-xl font-bold text-gray-700">모든 세션 완료!</p>
          <p className="text-gray-500">유하 최고예요! 뭉치가 기뻐해요 🐶</p>
        </div>
      )}

      {/* 동물 캐릭터 */}
      <div className="flex gap-3 justify-center mt-2">
        {['🐶 뭉치', '🐱 냥이', '🐰 콩이'].map(char => (
          <div key={char} className="bg-white rounded-2xl px-4 py-2 shadow-sm text-sm font-medium text-gray-600">
            {char}
          </div>
        ))}
      </div>
    </div>
  )
}
