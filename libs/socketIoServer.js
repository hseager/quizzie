module.exports = (server) => {
    const io = require('socket.io')(server)

    io.on('connection', socket => {
        socket.on('connectToLobby', lobbyOwnerId => {
            socket.join(lobbyOwnerId)
        })
    
        socket.on('joinLobby', lobbyData => {
            io.to(lobbyData.owner).emit('playerJoinedLobby', lobbyData.player)
        })
    
        socket.on('startQuiz', data => {

            const oneSecond = 1000
            const questionTimer = 10 * oneSecond
            let currentQuestion = 0
    
            // Tell everyone to start the quiz
            io.to(data.lobbyId).emit('startQuiz')

            // Start counting down until the next question
            let questionInterval = setInterval(function changeQuestion() {

                // Start the client side countdown and emit 
                let currentClientCountdown = questionTimer / oneSecond
                let clientCountdown = setInterval(() => {
                    currentClientCountdown--
                    if(currentClientCountdown > 0)
                        io.to(data.lobbyId).emit('nextQuestionTimer', currentClientCountdown)
                    else 
                        clearInterval(clientCountdown)
                }, oneSecond)

                if(currentQuestion < data.questionCount){
                    // Change the question
                    fetch(`http://localhost:3000/api/lobbies`, {
                        method: 'post',
                        body: JSON.stringify({
                            id: data.lobbyId,
                            data: {
                                currentQuestion: currentQuestion,
                            }
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }).catch((err) => {
                        console.log(`Error with changing question. lobbyId: ${data.lobbyId}. Error: ${err}`)
                    })

                    io.to(data.lobbyId).emit('changeQuestion', currentQuestion)

                } else {
                    // Finish the quiz and show results
                    fetch(`http://localhost:3000/api/lobbies`, {
                        method: 'post',
                        body: JSON.stringify({
                            id: data.lobbyId,
                            data: {
                                status: 'lobby',
                                currentQuestion: 0
                            }
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }).catch((err) => {
                        console.log(`Error with finishing quiz. lobbyId: ${data.lobbyId}. Error: ${err}`)
                    })
                    
                    io.to(data.lobbyId).emit('finishedQuiz')
                    clearInterval(questionInterval)
                    clearInterval(clientCountdown)
                }

                currentQuestion++

                return changeQuestion
            }(), questionTimer)
    
        })
    })
}