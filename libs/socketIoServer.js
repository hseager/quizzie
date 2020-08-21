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
    
            const questionTimer = 10 * 1000
            let currentQuestion = 0
    
            // Tell everyone to start the quiz
            io.to(data.lobbyId).emit('startQuiz')
    
            // Start counting down until the next question
            let questionInterval = setInterval(() => {
                currentQuestion++
                if(currentQuestion < data.questionCount){
                    io.to(data.lobbyId).emit('changeQuestion', currentQuestion)
                } else {
                    io.to(data.lobbyId).emit('finishedQuiz')
                    clearInterval(questionInterval)
                }
            }, questionTimer)
    
        })
    })
}