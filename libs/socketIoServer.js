module.exports = (server) => {
    const io = require('socket.io')(server)
    const Lobby = require('../libs/classes/lobby')
    const lobbies = []

    const oneSecond = 1000
    const questionTimer = 10 * oneSecond
    const disconnectionTimer = 5 * oneSecond

    io.on('connection', socket => {
        socket.on('connectToLobby', ({lobbyId, userId}) => {
            // Get or create a new lobby
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby === 'undefined'){
                lobby = new Lobby(lobbyId, io)
                lobbies.push(lobby)
            }
            lobby.connect(socket, userId, socket.id)
        })
    
        socket.on('joinLobby', ({lobbyId, player}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.join(player)
        })
    
        socket.on('startQuiz', data => {
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
                    fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
                        method: 'post',
                        body: JSON.stringify({
                            id: data.lobbyId,
                            data: {
                                currentQuestion,
                            }
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }).catch(err => {
                        console.log(`Error with changing question. lobbyId: ${data.lobbyId}. Error: ${err}`)
                    })

                    io.to(data.lobbyId).emit('changeQuestion', currentQuestion)

                } else {
                    // Finish the quiz and show results
                    fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
                        method: 'post',
                        body: JSON.stringify({
                            id: data.lobbyId,
                            data: {
                                status: 'finished',
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

        socket.on('disconnect', () => {
            setTimeout(() => {
                lobbies.forEach(lobby => {
                    if(lobby.isConnected(socket.id))
                        lobby.disconnect(socket.id)
                })
            }, disconnectionTimer)
        })

    })

}