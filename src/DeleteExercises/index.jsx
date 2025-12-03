const DeleteExercises = ( 
    idToDelete,
    exercises,
    setExercises,
    selectedExercise,
    setIsTimerActive,
    setCurrentExercise,
    setSelectedExercise
) => {

    if (selectedExercise && selectedExercise.id === idToDelete) {
        setIsTimerActive(false)
        setCurrentExercise(null)
        setSelectedExercise(null)
    }

     const updatedExercises = exercises.filter(
        (exercise) => exercise.id !== idToDelete
    )
    setExercises(updatedExercises)
}

export default DeleteExercises

