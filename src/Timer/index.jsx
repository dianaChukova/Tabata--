import React, { useState, useEffect, useCallback } from 'react';
import "./index.css"
import "../App.css"

const WORK_TIME = 3 //20
const REST_TIME = 3 //10
const TOTAL_ROUNDS = 2 //8

function Timer({ isActive, onFinish, onRepeat }) {
    const [isPaused, setIsPaused] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(WORK_TIME)
    const [currentPhase, setCurrentPhase] = useState('Выполнение')
    const [currentRound, setCurrentRound] = useState(1)

    const isRunning = isActive && !isPaused && currentPhase !== 'Закончили'

    const resetTimer = useCallback(() => {
        setIsPaused(false)
        setTimeRemaining(WORK_TIME)
        setCurrentPhase('Выполнение')
        setCurrentRound(1)
        if (onFinish) onFinish(false)
    }, [onFinish])
    
    const handlePhaseTransition = useCallback(() => {
        if (currentPhase === 'Выполнение') {
            const nextRound = currentRound + 1

            if (nextRound > TOTAL_ROUNDS) {
                setCurrentPhase('Закончили')
                setTimeRemaining(0)
                setIsPaused(true)
                if (onFinish) onFinish(true)
                return
            }

            setCurrentPhase('Отдых')
            setTimeRemaining(REST_TIME)

        } else if (currentPhase === 'Отдых') { 
            setCurrentRound(currentRound + 1)
            setCurrentPhase('Выполнение')
            setTimeRemaining(WORK_TIME)
        }
    }, [currentPhase, currentRound, onFinish])


    useEffect(() => {
        let intervalId

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
        return () => clearInterval(intervalId)
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
                <div className='timerItem'>Раунд: {currentRound} / {TOTAL_ROUNDS}</div>
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





            

// 










//     return (
//         <div className='timer'>
//             {/* Заголовок фазы */}
//             <div className='title'>{currentPhase}</div>

//             {/* Информация о раунде отображается только если таймер не закончен */}
//             {currentPhase !== 'Закончили' && (
//                 <div className='timerItem'>Раунд: {currentRound} / {TOTAL_ROUNDS}</div>
//             )}

//             {/* Отображение времени, если таймер не закончен (теперь div полностью скрывается) */}
//             {currentPhase !== 'Закончили' && (
//                 <div className='timerItem'>
//                     {formatTime(timeRemaining)}
//                 </div>
//             )}

//             <div className='timerButton'>
//                 {/* Кнопка "Пауза"/"Продолжить" отображается, если таймер не закончен и активен */}
//                 {currentPhase !== 'Закончили' && isActive && (
//                     <button className='button' onClick={() => setIsPaused(!isPaused)}>
//                         {isPaused ? 'Продолжить' : 'Пауза'}
//                     </button>
//                 )}

//                 {/* Кнопки "Повторить" и "Выйти" отображаются, когда таймер закончен */}
//                 {currentPhase === 'Закончили' && (
//                     <>
//                         {/* Можно добавить дополнительное сообщение, если нужно */}
//                         {/* <div className="finished-message">Вы закончили упражнение!</div> */}
//                         <button className='button' onClick={handleRepeat}>Повторить</button>
//                         <button className='button' onClick={handleExit}>Выйти</button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Timer;