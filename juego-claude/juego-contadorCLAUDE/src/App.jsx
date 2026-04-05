import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './App.module.css'

const GAME_DURATION = 5 // seconds
const COUNTDOWN_MESSAGES = ['Preparados...', 'Listos...', '¡Ya!']

// Game phases
const PHASE = {
  IDLE: 'idle',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  FINISHED: 'finished',
}

export default function App() {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [clicks, setClicks] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [countdownStep, setCountdownStep] = useState(0) // 0=3, 1=2, 2=1, 3=Ya
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [isNewRecord, setIsNewRecord] = useState(false)

  const rafRef = useRef(null)
  const countdownRef = useRef(null)
  const startTimeRef = useRef(null)
  const clicksRef = useRef(0) // ref to avoid stale closure in rAF

  // Sync clicks ref with state
  useEffect(() => {
    clicksRef.current = clicks
  }, [clicks])

  const endGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const finalClicks = clicksRef.current
    setPhase(PHASE.FINISHED)
    setTimeLeft(0)
    setIsNewRecord((prev) => {
      const record = finalClicks > maxScore
      if (record) setMaxScore(finalClicks)
      return record
    })
  }, [maxScore])

  const launchGame = useCallback(() => {
    setClicks(0)
    clicksRef.current = 0
    setTimeLeft(GAME_DURATION)
    startTimeRef.current = performance.now()
    setPhase(PHASE.PLAYING)

    const tick = (now) => {
      const elapsed = (now - startTimeRef.current) / 1000
      const remaining = Math.max(0, GAME_DURATION - elapsed)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        endGame()
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [endGame])

  const startCountdown = useCallback(() => {
    setPhase(PHASE.COUNTDOWN)
    setCountdownStep(0)
    setClicks(0)
    clicksRef.current = 0

    let step = 0
    const next = () => {
      step++
      setCountdownStep(step)
      if (step < 3) {
        countdownRef.current = setTimeout(next, 1000)
      } else {
        // step === 3 → "¡Ya!" shown for 600ms then game starts
        countdownRef.current = setTimeout(launchGame, 600)
      }
    }
    countdownRef.current = setTimeout(next, 1000)
  }, [launchGame])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(countdownRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleClickButton = () => {
    if (phase !== PHASE.PLAYING) return
    setClicks((c) => c + 1)
  }

  // Derived display values
  const timerPct = (timeLeft / GAME_DURATION) * 100
  const isDanger = timeLeft <= 2 && phase === PHASE.PLAYING
  const isClickEnabled = phase === PHASE.PLAYING
  const isStartEnabled = phase === PHASE.IDLE || phase === PHASE.FINISHED

  const getCountdownDisplay = () => {
    if (phase === PHASE.IDLE) return '5'
    if (phase === PHASE.FINISHED) return '0'
    if (phase === PHASE.COUNTDOWN) {
      if (countdownStep < 3) return String(3 - countdownStep)
      return '¡YA!'
    }
    if (phase === PHASE.PLAYING) return String(Math.ceil(timeLeft))
    return '5'
  }

  const getCountdownColor = () => {
    if (phase === PHASE.COUNTDOWN && countdownStep === 3) return 'green'
    if (isDanger) return 'red'
    return 'default'
  }

  const getPhaseMessage = () => {
    if (phase === PHASE.IDLE) return 'Listo para jugar'
    if (phase === PHASE.COUNTDOWN && countdownStep < 3)
      return COUNTDOWN_MESSAGES[countdownStep]
    if (phase === PHASE.COUNTDOWN && countdownStep >= 3) return ''
    if (phase === PHASE.PLAYING) return ''
    if (phase === PHASE.FINISHED) return '¡Tiempo!'
    return ''
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>JuegoContador</h1>
      <p className={styles.subtitle}>Click Battle — 5 segundos</p>

      {/* Scoreboard */}
      <div className={styles.scoreboard}>
        <div className={styles.scoreBox}>
          <div className={styles.scoreLabel}>Clicks</div>
          <div className={`${styles.scoreValue} ${styles.scoreClicks}`}>
            {clicks}
          </div>
        </div>
        <div className={styles.scoreDivider} />
        <div className={styles.scoreBox}>
          <div className={styles.scoreLabel}>Máximo</div>
          <div className={`${styles.scoreValue} ${styles.scoreMax}`}>
            {maxScore}
          </div>
        </div>
      </div>

      {/* Arena */}
      <div className={styles.arena}>
        <div
          className={`${styles.countdown} ${
            getCountdownColor() === 'red'
              ? styles.countdownRed
              : getCountdownColor() === 'green'
              ? styles.countdownGreen
              : styles.countdownYellow
          }`}
        >
          {getCountdownDisplay()}
        </div>

        <div className={styles.phaseMsg}>{getPhaseMessage()}</div>

        {(phase === PHASE.PLAYING || phase === PHASE.FINISHED) && (
          <>
            <div className={styles.timerBarWrap}>
              <div
                className={`${styles.timerBar} ${
                  isDanger ? styles.timerBarDanger : ''
                }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <div className={styles.timerLabel}>
              {phase === PHASE.PLAYING
                ? `${timeLeft.toFixed(1)}s restantes`
                : '¡Tiempo!'}
            </div>
          </>
        )}

        <button
          className={styles.btnClick}
          onClick={handleClickButton}
          disabled={!isClickEnabled}
          aria-label="Click para sumar puntos"
        >
          ¡CLICK!
        </button>
      </div>

      {/* Start button */}
      <div className={styles.controls}>
        <button
          className={styles.btnStart}
          onClick={startCountdown}
          disabled={!isStartEnabled}
        >
          {phase === PHASE.FINISHED ? 'Jugar de nuevo' : 'Iniciar juego'}
        </button>
      </div>

      {/* Result panel */}
      {phase === PHASE.FINISHED && (
        <div className={styles.resultPanel}>
          <div className={styles.resultTitle}>Resultado</div>
          <div className={styles.resultScore}>{clicks} clicks</div>
          <div className={styles.resultSub}>en {GAME_DURATION} segundos</div>
          {isNewRecord && clicks > 0 && (
            <div className={styles.newRecord}>★ Nuevo récord ★</div>
          )}
        </div>
      )}
    </div>
  )
}
