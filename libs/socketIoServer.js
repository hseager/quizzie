module.exports = (server) => {
    const io = require('socket.io')(server)
    const Lobby = require('../libs/classes/lobby')
    const lobbies = []

    const oneSecond = 1000
    const questionTimer = 10 * oneSecond
    const disconnectionTimer = 5 * oneSecond

    io.on('connection', socket => {

        socket.on('connectToLobby', ({lobbyId, userId}) => {
            socket.join(lobbyId)

            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby === 'undefined'){
                lobby = new Lobby(lobbyId)
                lobbies.push(lobby)
            }

            let connection = lobby.connections.find(c => c.userId === userId)
            if(typeof connection === 'undefined')
                lobby.connections.push({userId, socketId: socket.id})
            else 
                connection.socketId = socket.id

        })
    
        socket.on('joinLobby', data => {
            io.to(data.lobbyId).emit('playerJoinedLobby', data.player)
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
                    }).catch((err) => {
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
                // Remove user from lobby on disconnect
                lobbies.forEach(lobby => {
                    let connectionIndex = lobby.connections.findIndex(c => c.socketId === socket.id)

                    if(connectionIndex !== -1){
                        const disconnectingUserId = lobby.connections[connectionIndex].userId
                        lobby.connections.splice(connectionIndex, 1)
                        
                        io.to(lobby.id).emit('playerLeftLobby', disconnectingUserId)
                    }
                })

                
            }, disconnectionTimer)
        })

    })
}