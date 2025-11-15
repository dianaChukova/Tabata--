import React, { useState } from 'react';
import Timer from "../Timer"
import TimerTrigger from "../Timer/TimerTrigger"
import "./index.css"
import "../App.css"

const EXERCISES = [
    { id: 1, name: "Приседания"},
    { id: 2, name: "Отжимания" },
    { id: 3, name: "Планка" },
    { id: 4, name: "Выпады" },
]

const ListExercises = () => {
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [currentExercise, setCurrentExercise] = useState(null)

    const handleStartTimer = (exerciseName) => {
        if (!isTimerActive) {
            setIsTimerActive(true)
            setCurrentExercise(exerciseName)
        } else {
            alert(`Таймер уже запущен для: ${currentExercise}`)
        }
    }

    const handleTimerFinish = (wasSuccessful) => {
        if (!wasSuccessful){
            setIsTimerActive(false)
            setCurrentExercise(null)
        }
    }

    const handleTimerRepeat = () => {
        setIsTimerActive(true)
        setCurrentExercise(currentExercise)
    }

    return (
        <div className='containerTimer'>
            {isTimerActive ? (
                <>
                    <div className='title'>Выполняется: {currentExercise}</div>
                    <Timer isActive={isTimerActive} onFinish={handleTimerFinish} onRepeat={handleTimerRepeat} />
                </>
                ) : (
                    <div className='containerListExercises'>
                        <div className='title'>Список упражнений:</div>
                        <div className='exercises'>
                            {EXERCISES.map((exercise) => (
                                <TimerTrigger key={exercise.id} exerciseName={exercise.name} onStart={() => handleStartTimer(exercise.name)}/>
                            ))}
                        </div>
                    </div>
                )}
        </div>
    )
}

export default ListExercises





