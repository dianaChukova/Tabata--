import "./index.css"

function TimerTrigger({ exerciseName, onStart, image }) {

  const imageStyle = {
        width: '80px', // Размер изображения
        height: '80px',
        objectFit: 'contain', // Чтобы изображение не искажалось
        marginBottom: '10px',
    };
    
    return (
        <div 
            className="exercis"
            onClick={onStart} 
        >
            {image && <img src={image} alt={exerciseName} style={imageStyle} />}
            {exerciseName}
        </div>
    );
}

export default TimerTrigger;