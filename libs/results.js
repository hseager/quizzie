
export function formatResults (results, quiz) {
    
    let formattedResults = {
        overview: [],
        detailed: {}
    }

    results.results.map(r => {

        // Create results overview
        const correctAnswer = quiz.questions[r.question].answer === r.answer

        if(!formattedResults.overview.some(p => p.name === r.player.name))
            formattedResults.overview.push({ name: r.player.name, correctAnswers: 0 })

        if(correctAnswer) formattedResults.overview.find(p => p.name === r.player.name).correctAnswers++

        /*
        formattedResults.detailed[r.player.name] = [
            formattedResults.detailed[r.player.name],
            {
                question: r.question,
            }
        ]
        */

    })

    return formattedResults
}