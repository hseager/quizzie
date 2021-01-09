function getSuffix(place){
    return (place === 1 ? 'st' : (place === 2 ? 'nd' : 'th'))
}

export function formatResults (results, quiz) {
    
    let formattedResults = []

    let place = 0
    let savedAnswers
    
    function getPlace(correctAnswers){
        if(correctAnswers !== savedAnswers)
            place++
    
        savedAnswers = correctAnswers
    
        return place
    }

    results.map(result => {
        if(!formattedResults.some(p => p.playerId === result.playerId))
            formattedResults.push({ playerId: result.playerId, correctAnswers: 0 })

        result.answers.map(a => {
            const correctAnswer = quiz.questions[a.question].answer === a.answer
            if(correctAnswer) formattedResults.find(p => p.playerId === result.playerId).correctAnswers++
        })
    })

    formattedResults.map(result => {
        result.place = getPlace(result.correctAnswers)
        result.suffix = getSuffix(result.place)
        return result
    })

    return formattedResults
}