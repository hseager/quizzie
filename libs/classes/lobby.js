const Player = require('../../libs/classes/player')

module.exports = class Lobby {
    constructor(id, io){
        this.id = id
        this.io = io
        this.questionTimer = 10 * 1000
        this.questionInterval

        this.currentQuiz = 0
        this.currentQuestion = 0
        this.status = 'lobby'
        this.players = []
    }
    connect(socket, playerId){
        let player = this.players.find(p => p.id === playerId)
        if(typeof player === 'undefined'){
            // Create a new player if not connected
            player = new Player(playerId, socket.id)
            player.connected = true
            this.players.push(player)
        } else {
            // Update player socketid on reconnection
            player.socketId = socket.id
            player.connected = true
        }
        socket.join(this.id)
    }
    join(playerId, name){
        let player = this.players.find(p => p.id == playerId)
        if(typeof player !== 'undefined'){
            player.name = name
            player.joined = true
            this.save()
            this.io.to(this.id).emit('updatePlayers', this.players)
        }
    }
    disconnect(socketId){
        let player = this.players.find(p => p.socketId === socketId)
        if(typeof player !== 'undefined'){
            player.connected = false
            this.save()
            this.io.to(this.id).emit('updatePlayers', this.players)
        }
    }
    startQuiz(questionCount){
        this.currentQuestion = 0
        this.status = "started"
        this.save()
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
            this.currentQuiz++
            this.currentQuestion = 0
            this.save()
            this.io.to(this.id).emit('finishedQuiz', this.currentQuiz)
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
                    currentQuiz: this.currentQuiz,
                    currentQuestion: this.currentQuestion,
                    players: this.players
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => {
            console.log(`Error with updating lobby. lobbyId: ${this.id}. Error: ${err}`)
        })
    }
    async load(){
        return await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${this.id}`)
            .then(res => res.json())
            .then(res => {
                this.players = res.players
                this.currentQuiz = res.currentQuiz
            })
            .catch(err => { console.log(`Error loading lobby from db: ${err}`) })
    }
}