'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Session, VocabItem } from '@/lib/supabase'

type Step = 'phonics' | 'vocab' | 'game' | 'complete'
const STEPS: Step[] = ['phonics', 'vocab', 'game', 'complete']
const STEP_LABELS = { phonics: '파닉스', vocab: '단어', game: '게임', complete: '완료' }

export default function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [step, setStep] = useState<Step>('phonics')
  const [scores, setScores] = useState({ phonics: 0, vocab: 0, game: 0 })
  const [startTime] = useState(Date.now())

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.json())
      .then(d => {
        const found = (d.sessions as Session[]).find(s => s.id === id)
        setSession(found ?? null)
      })
  }, [id])

  const nextStep = useCallback((score?: number) => {
    setScores(prev => {
      if (score === undefined) return prev
      if (step === 'phonics') return { ...prev, phonics: score }
      if (step === 'vocab') return { ...prev, vocab: score }
      if (step === 'game') return { ...prev, game: score }
      return prev
    })
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }, [step])

  const finishSession = useCallback(async (gameScore: number) => {
    const finalScores = { ...scores, game: gameScore }
    const duration = Math.round((Date.now() - startTime) / 1000)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: id,
        phonics_score: finalScores.phonics,
        vocab_score: finalScores.vocab,
        game_score: finalScores.game,
        duration_seconds: duration,
      }),
    })
    setStep('complete')
  }, [scores, startTime, id])

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">불러오는 중... 🐰</p>
      </div>
    )
  }

  const stepIdx = STEPS.indexOf(step)

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 바 */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button onClick={() => router.push('/')}
          className="text-gray-400 text-2xl leading-none p-1">←</button>
        <div className="flex-1">
          <div className="flex gap-1.5">
            {STEPS.slice(0, -1).map((s, i) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-all ${
                i < stepIdx ? 'bg-amber-400' :
                i === stepIdx ? 'bg-amber-200' : 'bg-gray-100'
              }`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {STEP_LABELS[step]} 단계 · {session.title}
          </p>
        </div>
      </div>

      {/* 단계별 화면 */}
      <div className="flex-1 px-4 pb-6">
        {step === 'phonics' && (
          <PhonicsStep
            pattern={session.phonics_pattern}
            vocab={session.vocab_set as VocabItem[]}
            onComplete={score => nextStep(score)}
          />
        )}
        {step === 'vocab' && (
          <VocabStep
            vocab={session.vocab_set as VocabItem[]}
            onComplete={score => nextStep(score)}
          />
        )}
        {step === 'game' && (
          <GameStep
            gameType={session.game_type}
            vocab={session.vocab_set as VocabItem[]}
            onComplete={finishSession}
          />
        )}
        {step === 'complete' && (
          <CompleteStep
            scores={scores}
            sessionTitle={session.title}
            level={session.level}
            sessionId={id}
            vocab={session.vocab_set as VocabItem[]}
            onHome={() => router.push('/')}
          />
        )}
      </div>
    </div>
  )
}

/* ─── 파닉스 단계 ─── */
function PhonicsStep({ pattern, vocab, onComplete }: {
  pattern: string
  vocab: VocabItem[]
  onComplete: (score: number) => void
}) {
  const [shown, setShown] = useState(0)
  const letters = pattern.match(/\b[a-z]+\b/g)?.slice(0, 3) ?? ['a']

  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">오늘의 소리</p>
        <div className="text-7xl font-bold text-amber-500">{letters[0]}</div>
        <p className="text-base text-gray-600 mt-2">패턴: <span className="font-medium">{pattern}</span></p>
      </div>

      <div className="bg-white rounded-3xl p-5 w-full shadow-md">
        <p className="text-sm text-center text-gray-500 mb-4">🐶 뭉치와 함께 읽어봐요!</p>
        <div className="flex flex-col gap-3">
          {vocab.slice(0, 3).map((v, i) => (
            <button key={v.word}
              onClick={() => setShown(Math.max(shown, i + 1))}
              className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                shown > i ? 'bg-amber-50 border-2 border-amber-200' : 'bg-gray-50'
              }`}>
              <span className="text-3xl w-10 text-center">
                {v.character === 'moongchi' ? '🐶' :
                 v.character === 'nyangi' ? '🐱' :
                 v.character === 'kongi' ? '🐰' : '📖'}
              </span>
              <div className="text-left">
                <div className="font-bold text-lg text-gray-800">{v.word}</div>
                <div className="text-sm text-gray-500">{v.pronunciation} · {v.meaning_kr}</div>
                {shown > i && (
                  <div className="text-sm text-amber-600 mt-1">{v.example_en}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => onComplete(100)}
        className="w-full h-14 bg-amber-400 text-white text-lg font-bold rounded-2xl shadow-md active:scale-95 transition-transform">
        다 읽었어요! →
      </button>
    </div>
  )
}

/* ─── 어휘 단계 ─── */
function VocabStep({ vocab, onComplete }: {
  vocab: VocabItem[]
  onComplete: (score: number) => void
}) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const current = vocab[idx]

  const next = () => {
    setFlipped(false)
    setTimeout(() => {
      if (idx + 1 >= vocab.length) onComplete(100)
      else setIdx(i => i + 1)
    }, 150)
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      <p className="text-sm text-gray-500">
        {idx + 1} / {vocab.length} 단어
      </p>

      <button onClick={() => setFlipped(f => !f)}
        className="w-full min-h-52 bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
        <span className="text-5xl">
          {current.character === 'moongchi' ? '🐶' :
           current.character === 'nyangi' ? '🐱' :
           current.character === 'kongi' ? '🐰' : '⭐'}
        </span>
        <div className="text-4xl font-bold text-gray-800">{current.word}</div>
        <div className="text-lg text-amber-500">{current.pronunciation}</div>
        {flipped ? (
          <div className="text-center bounce-in">
            <div className="text-2xl font-bold text-gray-700">{current.meaning_kr}</div>
            <div className="text-sm text-gray-500 mt-2">{current.example_kr}</div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">탭하면 뜻이 나와요 👆</p>
        )}
      </button>

      {flipped && (
        <button onClick={next}
          className="w-full h-14 bg-amber-400 text-white text-lg font-bold rounded-2xl shadow-md active:scale-95 transition-transform bounce-in">
          {idx + 1 >= vocab.length ? '게임 시작! 🎮' : '다음 단어 →'}
        </button>
      )}
    </div>
  )
}

/* ─── 게임 단계 (Memory Match 기본) ─── */
function GameStep({ gameType, vocab, onComplete }: {
  gameType: string
  vocab: VocabItem[]
  onComplete: (score: number) => void
}) {
  // 모든 game_type에 Memory Match 사용 (확장 가능)
  return <MemoryMatch vocab={vocab} onComplete={onComplete} />
}

function MemoryMatch({ vocab, onComplete }: {
  vocab: VocabItem[]
  onComplete: (score: number) => void
}) {
  const pairs = vocab.slice(0, 4)
  type Card = { id: string; content: string; type: 'en' | 'kr'; matched: boolean; flipped: boolean }
  const [cards, setCards] = useState<Card[]>(() =>
    [...pairs.map(v => ({ id: `en-${v.word}`, content: v.word, type: 'en' as const, matched: false, flipped: false })),
     ...pairs.map(v => ({ id: `kr-${v.word}`, content: v.meaning_kr, type: 'kr' as const, matched: false, flipped: false }))]
      .sort(() => Math.random() - 0.5)
  )
  const [selected, setSelected] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [shakeId, setShakeId] = useState<string | null>(null)

  const tap = (id: string) => {
    const card = cards.find(c => c.id === id)
    if (!card || card.matched || card.flipped || selected.length === 2) return

    const newSelected = [...selected, id]
    setCards(cs => cs.map(c => c.id === id ? { ...c, flipped: true } : c))

    if (newSelected.length === 2) {
      setSelected([])
      const [a, b] = newSelected.map(sid => cards.find(c => c.id === sid)!)
      const wordA = a.id.replace(/^(en|kr)-/, '')
      const wordB = b.id.replace(/^(en|kr)-/, '')

      setTimeout(() => {
        if (wordA === wordB && a.type !== b.type) {
          setCards(cs => cs.map(c =>
            newSelected.includes(c.id) ? { ...c, matched: true } : c
          ))
        } else {
          setMistakes(m => m + 1)
          setShakeId(newSelected[1])
          setTimeout(() => {
            setCards(cs => cs.map(c =>
              newSelected.includes(c.id) ? { ...c, flipped: false } : c
            ))
            setShakeId(null)
          }, 500)
        }
      }, 600)
    } else {
      setSelected(newSelected)
    }
  }

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      const score = Math.max(60, 100 - mistakes * 10)
      setTimeout(() => onComplete(score), 500)
    }
  }, [cards, mistakes, onComplete])

  return (
    <div className="flex flex-col items-center gap-5 pt-4">
      <div className="text-center">
        <p className="text-lg font-bold text-gray-700">🎴 짝 맞추기!</p>
        <p className="text-sm text-gray-500">영어 단어와 한국어 뜻을 짝지어봐요</p>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {cards.map(card => (
          <button key={card.id} onClick={() => tap(card.id)}
            className={`h-16 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
              card.matched
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : card.flipped
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                : 'bg-white text-gray-800 border-2 border-gray-200 shadow-sm'
            } ${card.id === shakeId ? 'shake' : ''}`}>
            {card.flipped || card.matched ? card.content : '?'}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400">
        {cards.filter(c => c.matched).length / 2} / {pairs.length} 짝 완성 ⭐
      </p>
    </div>
  )
}

/* ─── 완료 단계 ─── */
function CompleteStep({ scores, sessionTitle, level, sessionId, vocab, onHome }: {
  scores: { phonics: number; vocab: number; game: number }
  sessionTitle: string
  level: number
  sessionId: string
  vocab: VocabItem[]
  onHome: () => void
}) {
  const [story, setStory] = useState<string | null>(null)
  const [loadingStory, setLoadingStory] = useState(false)

  const readStory = async () => {
    setLoadingStory(true)
    const res = await fetch('/api/story/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        learnedVocab: vocab.map(v => v.word),
        sessionCount: 0,
        storyId: `session-${sessionId}`,
      }),
    })
    const data = await res.json()
    setStory(data.story)
    setLoadingStory(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-4 bounce-in">
      <div className="text-6xl">🎉</div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">잘했어요!</h2>
        <p className="text-gray-500 mt-1">뭉치가 자랑스러워해요 🐶</p>
      </div>

      <div className="bg-white rounded-3xl p-5 w-full shadow-md flex justify-around">
        {[
          { label: '파닉스', icon: '🔤', value: scores.phonics },
          { label: '단어', icon: '📚', value: scores.vocab },
          { label: '게임', icon: '🎮', value: scores.game },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-3xl">{s.icon}</div>
            <div className="text-xl font-bold text-amber-500 mt-1">
              {'⭐'.repeat(s.value === 100 ? 3 : s.value >= 70 ? 2 : 1)}
            </div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {!story ? (
        <button onClick={readStory} disabled={loadingStory}
          className="w-full h-14 bg-purple-400 text-white text-lg font-bold rounded-2xl shadow-md active:scale-95 transition-transform disabled:opacity-60">
          {loadingStory ? '동화 만드는 중... ✨' : '📖 오늘의 동화 읽기!'}
        </button>
      ) : (
        <div className="bg-purple-50 rounded-3xl p-5 w-full border-2 border-purple-100">
          <p className="text-sm font-bold text-purple-600 mb-3">📖 오늘의 동화</p>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{story}</div>
        </div>
      )}

      <button onClick={onHome}
        className="w-full h-14 bg-amber-400 text-white text-lg font-bold rounded-2xl shadow-md active:scale-95 transition-transform">
        홈으로 🏠
      </button>
    </div>
  )
}
