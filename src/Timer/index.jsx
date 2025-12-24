import React, { useState, useEffect, useCallback, useRef } from 'react';
import "./index.css"
import "../App.css"

function Timer({ isActive, onFinish, onRepeat, rounds, workTime, restTime }) {
    const [isPaused, setIsPaused] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(workTime)
    const [currentPhase, setCurrentPhase] = useState('Выполнение')
    const [currentRound, setCurrentRound] = useState(1)
    const [isSoundPlaying, setIsSoundPlaying] = useState(false)
    const [isInitialStart, setIsInitialStart] = useState(true)

    const beepSoundRef = useRef(null)

    useEffect(() => {
        beepSoundRef.current = new Audio('/sound.mp3')
        beepSoundRef.current.volume = 0.3
        beepSoundRef.current.load()
    }, [])

    const playSound = useCallback(() => {
        if (beepSoundRef.current) {
            try {
                beepSoundRef.current.currentTime = 0
                return beepSoundRef.current.play()
            } catch (error) {
                console.log("Ошибка воспроизведения звука:", error.message)
                setIsSoundPlaying(false)
                return Promise.reject(error)
            }
        }
    }, [])

    useEffect(() => {
        if (isActive && !isPaused && !isSoundPlaying) {
            const startTimerWithSound = async () => {
                try {
                    setIsSoundPlaying(true)
                    await playSound()    

                    const checkSoundEnd = () => {
                        return new Promise((resolve) => {
                            const onEnded = () => {
                                beepSoundRef.current.removeEventListener('ended', onEnded)
                                resolve()
                            }
                            
                            beepSoundRef.current.addEventListener('ended', onEnded)
                        })
                    }
                    await checkSoundEnd()
                    
                    if (isInitialStart) {
                        setIsInitialStart(false)
                    }
                    
                } catch (error) {
                    console.log("Не удалось воспроизвести звук, запускаем таймер сразу")
                    setIsSoundPlaying(false)
                }
            }
            
            startTimerWithSound()
        }
    }, [isActive, isPaused, isSoundPlaying, playSound, isInitialStart])

    const isRunning = isActive && !isPaused && currentPhase !== 'Закончили'

    const resetTimer = useCallback(() => {
        setIsPaused(false)
        setTimeRemaining(workTime)
        setCurrentPhase('Выполнение')
        setCurrentRound(1)
        setIsInitialStart(true)
        setIsSoundPlaying(false)
    }, [workTime])

    useEffect(() => {
        if (!isRunning) {
            setIsPaused(false)
            setTimeRemaining(workTime)
            setCurrentPhase('Выполнение')
            setCurrentRound(1)
            if (onFinish) onFinish(false)
        } 
    }, [])

    const handlePhaseTransition = useCallback(() => {
        if (currentPhase === 'Выполнение') {
            const nextRound = currentRound + 1

            if (nextRound > rounds) {
                setCurrentPhase('Закончили')
                setTimeRemaining(0)
                playSound()
                if (onFinish) onFinish(true)
                return
            }

            setCurrentPhase('Отдых')
            setTimeRemaining(restTime)

        } else if (currentPhase === 'Отдых') { 
            setCurrentRound(rounds)
            setCurrentPhase('Выполнение')
            setTimeRemaining(workTime)
        }
    }, [currentPhase, currentRound, restTime, workTime, rounds, onFinish, playSound])

    useEffect(() => {
        let intervalId = null

        if (isRunning) {
            intervalId = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime > 1) {
                        return prevTime - 1
                    } else {
                        handlePhaseTransition()
                        return 0
                    }
                })
            }, 1000)
        }
        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [isRunning, handlePhaseTransition])

    const handleRepeat = () => {
        resetTimer()
        playSound()
        if (onRepeat) onRepeat()
    }
    
    const handleExit = () => {
        resetTimer()
        if (onFinish) onFinish(false)
    }


    if (isActive && isSoundPlaying && isInitialStart) {
        return (
            <div className='timer'>
                <div className='title'>Приготовьтесь</div>
                <div className='timerItem'>Таймер начнется после сигнала</div>
            </div>
        );
    }

    return (
        <div className='timer'>
            <div className='title'>{currentPhase === 'Закончили' ? 'Закончили' : currentPhase}</div>
            {currentPhase !== 'Закончили' && (
                <div className='timerItem'> Раунд: {currentRound} / {rounds}</div>
            )}

            {currentPhase !== 'Закончили' && (
                <div className='timerItem'> {(timeRemaining)} </div>
            )}

            {currentPhase !== 'Закончили' && (
                <div className='timerButton'>
                    <button className='button'onClick={() => setIsPaused(!isPaused)}>
                        {isPaused ? 'Продолжить' : 'Пауза'}
                    </button>
                    <button className='button'onClick={handleExit} disabled={isRunning}>Сброс</button>
                </div>
            )}
            
             {currentPhase === 'Закончили' && (
                <>
                    <h2>Отличная работа!</h2>
                    <div className='timerButton'>
                        <button className='button' onClick={handleRepeat}>Повторить</button>
                        <button  className='button' onClick={handleExit}>Выйти</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Timer
