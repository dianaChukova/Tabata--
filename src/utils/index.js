const DeleteExercises = (idToDelete, items, activeItemId) => {
    const updatedList = items.filter((item) => item.id !== idToDelete)
    const isDeletingActive = activeItemId === idToDelete

    return {
        updatedList,
        isDeletingActive,
    }
}

export default DeleteExercises

