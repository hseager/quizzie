module.exports = class Lobby {
    // TODO: Instead of updating individual parts of Lobby, map class to DB and create save method
    constructor(id, io){
        this.id = id
        this.io = io
        this.connections = []
        this.questionTimer = 10 * 1000
        this.questionInterval

        this.currentQuestion = 0
        this.status = 'lobby'
        this.players = []
        
        this.load(id)
    }
    connect(socket, player){
        let connection = this.connections.find(p => p.id === player.id)
        if(typeof connection === 'undefined')
            this.connections.push(player)
        else 
            connection.socketId = player.socketId

        socket.join(this.id)
    }
    join(player){
        // TODO maybe change shortened player object to class instance: player
        player = { id: player.id, name: player.name }
        this.players.push(player)
        this.save()

        this.io.to(this.id).emit('playerJoinedLobby', player)
    }
    disconnect(player){
        if(this.connections.some(c => c.socketId === player.socketId)){
            let connectionIndex = this.connections.findIndex(c => c.socketId === player.socketId)
            if(connectionIndex !== -1){
                const disconnectingPlayer = this.connections[connectionIndex]
                this.connections.splice(connectionIndex, 1)
                this.kick(disconnectingPlayer)
                // Broadcast disconnection to connected clients
                this.io.to(this.id).emit('playerLeftLobby', disconnectingPlayer.id)
            }
        }
    }
    kick(player){
        if(this.players.some(p => p.id === player.id)){
            // Remove player from players list
            this.players = this.players.filter(p => p.id !== player.id)
            this.save()
        }
    }
    // TODO: Somehow get the questionCount from DB rather than passed through from client
    startQuiz(questionCount, quizId){
        this.status = "started"
        this.save()
        // Tell everyone to start the quiz and show the questions
        this.io.to(this.id).emit('startQuiz')
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
            this.save()
            this.io.to(this.id).emit('changeQuestion', this.currentQuestion)
        } else {
            // Finish the quiz and show results
            this.status = 'finished'
            this.currentQuestion = 0
            this.save()

            this.io.to(this.id).emit('finishedQuiz')
            clearInterval(this.questionInterval)
            clearInterval(clientCountdown)
        }
        this.currentQuestion++
    }
    save(){
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
            method: 'post',
            body: JSON.stringify({
                id: this.id,
                data: {
                    status: this.status,
                    currentQuestion: this.currentQuestion,
                    players: this.players
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => {
            console.log(`Error with updating lobby. lobbyId: ${this.id}. Error: ${err}`)
        })
    }
    load(id){
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${id}`)
            .then(res => res.json())
            .then(res => {
                this.players = res.players
            })
            .catch(err => { console.log(`Error getting lobby: ${err}`) })
    }
}