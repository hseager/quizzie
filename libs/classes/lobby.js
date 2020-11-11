module.exports = class Lobby {
    constructor(id, io){
        this.id = id
        this.io = io
        this.connections = []
        this.players = []
        this.currentQuestion = 0
        this.questionTimer = 10 * 1000
        this.questionInterval
    }
    connect(socket, userId, socketId){
        let connection = this.connections.find(c => c.userId === userId)
        if(typeof connection === 'undefined')
            this.connections.push({userId, socketId})
        else 
            connection.socketId = socketId

        socket.join(this.id)
    }
    disconnect(socketId){
        let connectionIndex = this.connections.findIndex(c => c.socketId === socketId)
        if(connectionIndex !== -1){
            const disconnectingUserId = this.connections[connectionIndex].userId
            this.connections.splice(connectionIndex, 1)
            this.kick(disconnectingUserId)
            // Broadcast disconnection to connected clients
            this.io.to(this.id).emit('playerLeftLobby', disconnectingUserId)
        }
    }
    isConnected(socketId){
        return this.connections.some(c => c.socketId === socketId)
    }
    join(player){
        this.players.push(player)
        this.io.to(this.id).emit('playerJoinedLobby', player)
        // Update the DB
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/join`, {
            method: 'post',
            body: JSON.stringify({ 
                lobbyId: this.id,
                player
            }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => {
            console.log(`Error joining lobby. Error: ${err}`)
        })
    }
    kick(userId){
        if(this.players.some(p => p.id === userId)){
            // Remove player from players list
            this.players = this.players.filter(p => p.id !== userId)
            // Update the DB
            fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
                method: 'post',
                body: JSON.stringify({
                    id: this.id,
                    data: {
                        players: this.players
                    }
                }),
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }
    // TODO: Somehow get the questionCount from DB rather than passed through from client
    startQuiz(questionCount){
        // Tell everyone to start the quiz and show the questions
        this.io.to(this.id).emit('startQuiz')
        // Update the DB
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
            method: 'post',
            body: JSON.stringify({
                id: this.id,
                data: {
                    status: 'started'
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        // Start counting down until the next question
        this.changeQuestion(questionCount)
        this.questionInterval = setInterval(() => this.changeQuestion(questionCount), this.questionTimer)
    }
    changeQuestion(questionCount){
        // Start the client side countdown and emit 
        let currentClientCountdown = this.questionTimer / 1000
        this.io.to(this.id).emit('nextQuestionTimer', currentClientCountdown)
        let clientCountdown = setInterval(() => {
            currentClientCountdown--
            if(currentClientCountdown > 0)
                this.io.to(this.id).emit('nextQuestionTimer', currentClientCountdown)
            else 
                clearInterval(clientCountdown)
        }, 1000)

        if(this.currentQuestion < questionCount){
            // Change the question
            fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
                method: 'post',
                body: JSON.stringify({
                    id: this.id,
                    data: {
                        currentQuestion: this.currentQuestion
                    }
                }),
                headers: { 'Content-Type': 'application/json' }
            }).catch(err => {
                console.log(`Error with changing question. lobbyId: ${this.id}. Error: ${err}`)
            })

            this.io.to(this.id).emit('changeQuestion', this.currentQuestion)
        } else {
            // Finish the quiz and show results
            fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
                method: 'post',
                body: JSON.stringify({
                    id: this.id,
                    data: {
                        status: 'finished',
                        currentQuestion: 0
                    }
                }),
                headers: { 'Content-Type': 'application/json' }
            }).catch(err => {
                console.log(`Error with finishing quiz. lobbyId: ${this.id}. Error: ${err}`)
            })
            this.currentQuestion = 0
            this.io.to(this.id).emit('finishedQuiz')
            clearInterval(this.questionInterval)
            clearInterval(clientCountdown)
        }
        this.currentQuestion++
    }
}