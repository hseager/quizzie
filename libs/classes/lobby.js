const Player = require('../../libs/classes/player')

module.exports = class Lobby {
    constructor(id, io){
        this.id = id
        this.io = io
        this.questionTimer = 10 * 1000
        this.questionInterval
        this.disconnectionTimer = 30 * 1000

        this.quizId
        this.quizCount = 0
        this.currentQuestion = 0
        this.status = 'lobby'
        this.players = []
    }
    connect(socket, playerId){
        let player = this.players.find(p => p.id === playerId)
        if(typeof player === 'undefined'){
            // Create a new player if not connected
            player = new Player(playerId)
            player.socketIds.push(socket.id)
            player.connected = true
            this.players.push(player)
        } else {
            // Update player socketid on reconnection
            player.socketIds.push(socket.id)
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
    disconnect(player, socketId){
        if(player.socketIds.length <= 1) player.connected = false
        setTimeout(() => {
            // If player hasn't reconnected
            if(!player.connected || player.socketIds.length > 0){
                let socketIndex = player.socketIds.findIndex(s => s === socketId)
                if(socketIndex > -1) player.socketIds.splice(socketIndex, 1)
                this.save()
                this.io.to(this.id).emit('updatePlayers', this.players)
            }
        }, this.disconnectionTimer)
    }
    async startQuiz(){
        const quiz = await this.getQuiz()
        const questionCount = quiz.questions.length

        this.quizCount++
        this.currentQuestion = 0
        this.status = 'started'
        this.save()
        this.io.to(this.id).emit('startQuiz', this.quizCount)
        // Start counting down until the next question
        this.changeQuestion(questionCount)
        this.questionInterval = setInterval(() => this.changeQuestion(questionCount), this.questionTimer)
    }
    startAgain(){
        this.status = 'lobby'
        this.save()
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
            this.io.to(this.id).emit('finishQuiz')
            clearInterval(this.questionInterval)
            clearInterval(clientCountdown)
        }
        this.currentQuestion++
    }
    async getQuiz(){
        return await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes/id/${this.quizId}`)
            .then(res => res.json())
            .catch(err => { console.log(`Error loading quiz from db: ${err}`) })
    }
    save(){
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
            method: 'post',
            body: JSON.stringify({
                id: this.id,
                data: {
                    status: this.status,
                    quizCount: this.quizCount,
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
                this.quizId = res.quizId
                this.quizCount = res.quizCount
            })
            .catch(err => { console.log(`Error loading lobby from db: ${err}`) })
    }
}