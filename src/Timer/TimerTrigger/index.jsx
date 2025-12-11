import "./index.css"

function TimerTrigger({ exerciseName, onStart }) {
    
    return (
        <div className="exercis"onClick={onStart} >
            {exerciseName}
        </div>
    )
}

export default TimerTrigger;