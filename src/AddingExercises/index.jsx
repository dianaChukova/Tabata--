import { useState, useEffect} from "react";
import "./index.css"

const AddingExercises = ({onAdd, visible, onClose}) => {
    const [name, setName] = useState("")
    const [rounds, setRounds] = useState(8)
    const [workTime, setWorkTime] = useState(20)
    const [restTime, setRestTime] = useState(10)

    useEffect(() => {
        if (!visible) {
            setName("")
            setRounds(8)
            setWorkTime(20)
            setRestTime(10)
        }
    }, [visible])
    
    const handleSubmit = (e) => {
        e.preventDefault()

        const newExercise = {
            name: name.trim() || "Новое упражнение",
            rounds: Number(rounds),
            workTime: Number(workTime),
            restTime: Number(restTime),
        }

        if (!rounds || !workTime || !restTime || isNaN(rounds) || isNaN(workTime) || isNaN(restTime) || rounds <= 0 || workTime <= 0 || restTime <= 0) {
            alert("Пожалуйста, заполните все числовые поля значениями больше 0")
            return
        }

        if (typeof onAdd === "function") onAdd(newExercise)
        if (typeof onClose === "function") onClose()
    }

    return !visible ? null : (
        <form className="containerAddingExercises" onSubmit={handleSubmit}>
            <div>Название:</div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
            <div>Раунды:</div>
                <input type="number" min="1" max="50" value={rounds} onChange={(e) => setRounds(e.target.value)}></input>
            <div>Время работы <span className="unitOfMeasurement">(сек)</span>:</div>
                <input type="number" min="1" max="3600" value={workTime} onChange={(e) => setWorkTime(e.target.value)}></input>
            <div>Время отдыха <span className="unitOfMeasurement">(сек)</span>:</div>
            <input type="number" min="1" max="3600" value={restTime} onChange={(e) => setRestTime(e.target.value)}></input>

            <div className="controlsButton">
                <button type="submit" className="button">Сохранить</button>
                <button type="button" className="button" onClick={onClose}>Отмена</button>
            </div>
        </form>
    )
}

export default AddingExercises

