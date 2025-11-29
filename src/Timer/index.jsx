import React, { useState, useEffect, useCallback } from 'react';
import "./index.css"
import "../App.css"

// const WORK_TIME = 3 //20
// const REST_TIME = 3 //10
// const TOTAL_ROUNDS = 2 //8

function Timer({ isActive, onFinish, onRepeat, rounds, workTime, restTime }) {
    const [isPaused, setIsPaused] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(workTime)
    const [currentPhase, setCurrentPhase] = useState('Выполнение')
    const [currentRound, setCurrentRound] = useState(1)

    const isRunning = isActive && !isPaused && currentPhase !== 'Закончили'

    const resetTimer = useCallback(() => {
        setIsPaused(false)
        setTimeRemaining(workTime)
        setCurrentPhase('Выполнение')
        setCurrentRound(1)
        if (onFinish) onFinish(false)
    }, [onFinish, workTime])

    useEffect(() => {
        if (!isRunning) {
            setIsPaused(false);
            setTimeRemaining(workTime);
            setCurrentPhase('Выполнение');
            setCurrentRound(1);
            if (onFinish) onFinish(false);
        }
    }, [workTime, restTime, rounds]);
    
    const handlePhaseTransition = useCallback(() => {
        if (currentPhase === 'Выполнение') {
            const nextRound = currentRound + 1

            if (nextRound > rounds) {
                setCurrentPhase('Закончили')
                setTimeRemaining(0)
                // setIsPaused(true)
                if (onFinish) onFinish(true)
                return
            }

            setCurrentPhase('Отдых')
            setTimeRemaining(restTime)

        } else if (currentPhase === 'Отдых') { 
            // setCurrentRound(currentRound + 1)
            setCurrentRound(prev => prev + 1);
            setCurrentPhase('Выполнение')
            setTimeRemaining(workTime)
        }
    }, [currentPhase, currentRound, restTime, workTime, rounds, onFinish])

    useEffect(() => {
        // let intervalId
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
        // return () => clearInterval(intervalId)
        return () => {
            if (intervalId) clearInterval(intervalId);
        }
    }, [isRunning, handlePhaseTransition])

    const handleRepeat = () => {
        resetTimer()
        if (onRepeat) onRepeat()
    }
    
    const handleExit = () => {
        resetTimer()
        if (onFinish) onFinish(false)
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

