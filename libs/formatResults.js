
export function formatResults (results, quiz) {
    
    let formattedResults = {
        overview: [],
        detailed: {}
    }

    results.map(result => {

        if(!formattedResults.overview.some(p => p.playerId === result.playerId))
            formattedResults.overview.push({ playerId: result.playerId, correctAnswers: 0 })

        result.answers.map(a => {
            const correctAnswer = quiz.questions[a.question].answer === a.answer
            if(correctAnswer) formattedResults.overview.find(p => p.playerId === result.playerId).correctAnswers++
        })

    })

    return formattedResults
}