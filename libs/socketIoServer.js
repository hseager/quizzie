module.exports = (server) => {
    const io = require('socket.io')(server)
    const Lobby = require('../libs/classes/lobby')
    const lobbies = []

    io.on('connection', socket => {
        socket.on('connectToLobby', ({lobbyId, userId}) => {
            socket.join(lobbyId)

            if(!lobbies.some(l => l.id === lobbyId))
                const lobby = new Lobby(lobbyId)

            /*
            socket.lobbyId = lobbyId
            socket.userId = userId
            */

            // Add player to rooms to keep track when they disconnect
            /*
            if(!rooms.some(r => r.id === lobbyId))
                rooms.push({id: lobbyId, players: []})
            
            const room = rooms.find(r => r.id == lobbyId)
            if(!room.players.some(p => p.id === userId))
                room.players.push({id: userId, socketId: socket.id })
            */

        })
    
        socket.on('joinLobby', data => {
            io.to(data.lobbyId).emit('playerJoinedLobby', data.player)
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

        socket.on('disconnecting', room => {

            /*
            const rooms = Object.keys(socket.rooms);
            // the rooms array contains at least the socket ID
            console.log('Disconnecting' + some)
            console.log(rooms)
            */
           /*
            console.log(socket.rooms)
            console.log(socket.id)
            */



           // TODO: Handle user leaving room
        });

        /*
        socket.on('disconnect', () => {
            if(socket.lobbyId && socket.userId){
                setTimeout(() =>{
                    io.to(socket.lobbyId).emit('playerDisconnected', socket.userId)
                }, 10000)
            }
        })
        */

    })
}