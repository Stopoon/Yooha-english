'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Session } from '@/lib/supabase'

type CharKey = 'moongchi' | 'nyangi' | 'kongi'
const CHARS: Record<CharKey, { emoji: string; name: string }> = {
  moongchi: { emoji: '🐶', name: '뭉치' },
  nyangi:   { emoji: '🐱', name: '냥이' },
  kongi:    { emoji: '🐰', name: '콩이' },
}

const GAME_EMOJI: Record<string, string> = {
  phonics_match: '🔤',
  word_builder: '🔨',
  memory_match: '🎴',
  sentence_fill: '✍️',
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedChar, setSelectedChar] = useState<CharKey>('moongchi')

  // 캐릭터 선택 - localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('yooha_char') as CharKey | null
    if (saved && saved in CHARS) setSelectedChar(saved)
  }, [])

  const pickChar = (key: CharKey) => {
    setSelectedChar(key)
    localStorage.setItem('yooha_char', key)
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/sessions').then(r => r.json()),
      fetch('/api/progress').then(r => r.json()),
    ]).then(([sessData, progData]) => {
      setSessions(sessData.sessions ?? [])
      setCompletedIds(sessData.completedIds ?? [])
      setStreak(progData.stats?.max_streak ?? 0)
      setLoading(false)
    })
  }, [])

  // 미완료 세션 / 완료 세션 분류
  const incompleteSessions = sessions.filter(s => !completedIds.includes(s.id))
  const completedSessions = sessions.filter(s => completedIds.includes(s.id))

  // 오늘의 세션 2개
  const todaySessions = incompleteSessions.slice(0, 2)
  // 내일 예습 2개
  const previewSessions = incompleteSessions.slice(2, 4)
  // 최근 복습 2개 (스페이스드 리피티션)
  const reviewSessions = completedSessions.slice(-2).reverse()

  const todayAllDone = todaySessions.length === 0
  const char = CHARS[selectedChar]

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 gap-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-600">유하의 영어 나라</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            안녕, 유하야! {char.emoji} {char.name}와 함께 배워요 ✨
          </p>
        </div>
        <Link href="/parent/dashboard"
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
          👨‍👩‍👧 부모
        </Link>
      </div>

      {/* 캐릭터 선택 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-gray-400 mb-2 font-medium">내 친구 선택</p>
        <div className="flex gap-2">
          {(Object.entries(CHARS) as [CharKey, { emoji: string; name: string }][]).map(([key, c]) => (
            <button
              key={key}
              onClick={() => pickChar(key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                selectedChar === key
                  ? 'bg-amber-400 text-white shadow-md scale-105'
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-xs font-medium">{c.name}</span>
            </button>
          ))}
        </div>
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
               `대단해요! ${char.emoji} ${char.name}가 자랑스러워해요!`}
            </p>
          </div>
        </div>
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
          <p className="text-gray-400 animate-pulse">불러오는 중... {char.emoji}</p>
        </div>
      ) : todayAllDone && incompleteSessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <span className="text-6xl">🎉</span>
          <p className="text-xl font-bold text-gray-700">모든 세션 완료!</p>
          <p className="text-gray-500">유하 최고예요! {char.emoji} {char.name}가 기뻐해요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* 오늘 섹션 헤더 */}
          <h2 className="text-lg font-bold text-gray-700">
            {todayAllDone ? '✅ 오늘 학습 완료!' : '🎯 오늘의 세션 (2개)'}
          </h2>

          {todaySessions.map((session, idx) => (
            <Link key={session.id} href={`/session/${session.id}`}>
              <div className={`rounded-3xl p-5 shadow-md transition-all active:scale-95 ${
                idx === 0
                  ? 'bg-white border-2 border-amber-300'
                  : 'bg-amber-50 border-2 border-amber-100'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {GAME_EMOJI[session.game_type] ?? '📖'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        레벨 {session.level}
                      </span>
                      {idx === 1 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          2번째
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{session.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      파닉스: {session.phonics_pattern}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      단어 {(session.vocab_set as unknown[]).length}개 · 게임 1개 · 약 15분
                    </p>
                  </div>
                </div>
                <div className="mt-3 py-2.5 rounded-2xl text-center font-bold text-base bg-amber-400 text-white">
                  {idx === 0 ? `시작하기! 🚀` : '이것도 해봐요! →'}
                </div>
              </div>
            </Link>
          ))}

          {/* 레벨 진도 */}
          {todaySessions.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">전체 진도</span>
                <span className="text-sm text-amber-600 font-bold">
                  {completedIds.length}/{sessions.length} 세션
                </span>
              </div>
              <div className="flex gap-1">
                {sessions.map((s) => (
                  <div key={s.id}
                    className={`flex-1 h-2.5 rounded-full ${
                      completedIds.includes(s.id) ? 'bg-amber-400' :
                      todaySessions.some(t => t.id === s.id) ? 'bg-amber-200' : 'bg-gray-100'
                    }`} />
                ))}
              </div>
            </div>
          )}

          {/* 내일 예습 */}
          {previewSessions.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-sm font-bold text-blue-600 mb-2">📅 내일 예습 미리보기</p>
              <div className="flex flex-col gap-2">
                {previewSessions.map(session => (
                  <Link key={session.id} href={`/session/${session.id}`}>
                    <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm active:scale-95 transition-all">
                      <span className="text-2xl">{GAME_EMOJI[session.game_type] ?? '📖'}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-700">{session.title}</p>
                        <p className="text-xs text-gray-400">레벨 {session.level} · 단어 {(session.vocab_set as unknown[]).length}개</p>
                      </div>
                      <span className="text-xs text-blue-400">미리보기 →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 복습 (스페이스드 리피티션) */}
          {reviewSessions.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-sm font-bold text-green-600 mb-2">🔄 복습하기 (스페이스드 리피티션)</p>
              <div className="flex flex-col gap-2">
                {reviewSessions.map(session => (
                  <Link key={session.id} href={`/session/${session.id}`}>
                    <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm active:scale-95 transition-all">
                      <span className="text-2xl">{GAME_EMOJI[session.game_type] ?? '📖'}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-700">{session.title}</p>
                        <p className="text-xs text-gray-400">완료됨 · 레벨 {session.level}</p>
                      </div>
                      <span className="text-xs text-green-500">복습 ✓</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
