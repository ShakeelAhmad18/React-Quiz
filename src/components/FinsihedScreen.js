
function FinsihedScreen({maxQuestionPoints,points,highscore,dispatch}) {
    const percentage = (points/maxQuestionPoints) * 100;

    let emoji;
    if(percentage === 100) emoji="🥇"
    else if(percentage >=80 && percentage < 100) emoji="🎉"
    else if(percentage >=50 && percentage < 80) emoji="🙂"
    else if(percentage >=0 && percentage <=50) emoji="🙃"
    else if(percentage === 0) emoji='🧒🏾'

  

    return (
        <>
        <p className="result">
            <span>{emoji}</span> You score <strong>{points}</strong> out of <strong>{maxQuestionPoints}</strong>({Math.ceil(percentage)}%)
        </p>
        <p className="highscore">
          (Highscore: {highscore} Points)
        </p>
        <button className="btn" onClick={()=>dispatch({type:'restart'})} style={{marginLeft:'175px'}}>Restart Quiz</button>
        </>
    )
}

export default FinsihedScreen
