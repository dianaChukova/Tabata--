import React, { useState, useEffect} from 'react';
import Timer from "../Timer"
import TimerTrigger from "../Timer/TimerTrigger"
import "./index.css"
import "../App.css"
import AddingExercises  from "../AddingExercises"
import DeleteExercises from '../DeleteExercises';

const LOCAL_STORAGE_KEY = "fitness_exercises"

const EXERCISES = [
    { id: 1, name: "Приседания", rounds: 8, workTime: 20, restTime: 10},
    { id: 2, name: "Отжимания", rounds: 8, workTime: 20, restTime: 10 },
    { id: 3, name: "Планка", rounds: 8, workTime: 20, restTime: 10 },
    { id: 4, name: "Выпады", rounds: 8, workTime: 20, restTime: 10 },
]

const ListExercises = () => {
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [currentExercise, setCurrentExercise] = useState(null)
    const [isAddingVisible, setIsAddingVisible] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [exercises, setExercises] = useState(() => {
        try {
            const storedExercises = localStorage.getItem(LOCAL_STORAGE_KEY)
            return storedExercises ? JSON.parse(storedExercises) : EXERCISES
        } catch (error) {
            console.error("Не удалось сохранить упражнение", error)
            return EXERCISES
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exercises))
        } catch (error) {
            console.error("Не удалось сохранить упражнение", error)
        }
    }, [exercises])


    const handleStartTimer = (exercise) => {
        if (!isTimerActive) {
            setIsTimerActive(true)
            setCurrentExercise(exercise.name)
            setSelectedExercise(exercise)
        } else {
            alert(`Таймер уже запущен для: ${currentExercise}`)
        }
    }

    const handleTimerFinish = (wasSuccessful) => {
        if (!wasSuccessful){
            setIsTimerActive(false)
            setCurrentExercise(null)
            setSelectedExercise(null)
        }
    }

    const handleTimerRepeat = () => {
        if (!selectedExercise) {
            setIsTimerActive(false)
            setCurrentExercise(null)
        }
    }

    const handleAddExercise = (exercise) => {
        const newEx = { ...exercise, id: Date.now() }
        setExercises(prev => [...prev, newEx])
    }

    const handleDeleteExerciseWrapper = (idToDelete) => {
        if (selectedExercise && selectedExercise.id === idToDelete) {
            setIsTimerActive(false)
            setCurrentExercise(null)
            setSelectedExercise(null)
        }

        DeleteExercises(
            idToDelete,
            exercises, 
            setExercises, 
            selectedExercise, 
            setIsTimerActive, 
            setCurrentExercise, 
            setSelectedExercise 
        )
    }

    return (
        <div className='containerTimer'>
            {isTimerActive ? (
                <>
                    <div className='title'>Выполняется: {currentExercise}</div>
                    <Timer isActive={isTimerActive} onFinish={handleTimerFinish} onRepeat={handleTimerRepeat} rounds={selectedExercise.rounds} workTime={selectedExercise.workTime} restTime={selectedExercise.restTime} />
                    {selectedExercise && (
                        <button className='buttons' onClick={() => handleDeleteExerciseWrapper(selectedExercise.id)}>Удалить упражнение</button>
                    )}
                </>
            ) : (
                <div className='containerListExercises'>
                    <div className='title'>Список упражнений:</div>
                    <div className='exercises'>
                        {exercises.map((exercise) => (
                            <TimerTrigger key={exercise.id} exerciseName={exercise.name} onStart={() => handleStartTimer(exercise)}/>
                        ))}
                    </div>
                    <button className='buttons' onClick={() => setIsAddingVisible(true)}>Добавить упражнение</button>
                    <AddingExercises onAdd={handleAddExercise} visible={isAddingVisible} onClose={() => setIsAddingVisible(false)}/>
                </div>
            )}
        </div>
    )
}

export default ListExercises





