function Progress({index,numQuestions,points,maxQuestionPoints,answer}) {
    return (
        <header className="progress">
            <progress max={numQuestions} value={index + Number(answer !== null) }/>
            <p>Questions <strong>{index +1}</strong>/<strong>{numQuestions}</strong></p>

            <p>Points <strong>{points}</strong>/<strong>{maxQuestionPoints}</strong></p>
        </header>
    )
}

export default Progress
