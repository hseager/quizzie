const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const io = require('socket.io')(server)

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()


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
            io.to(data.lobbyId).emit('changeQuestion', ++currentQuestion)
            console.log('changing question. current question: ' + currentQuestion + ' of ' + data.questionCount)
        }, questionTimer)

        if(currentQuestion >= data.questionCount)
            clearInterval(questionInterval)
        // Trouble clearing interval

    })
})

nextApp.prepare().then(() => {

    app.get('*', (req, res) => {
        return nextHandler(req, res)
    })

    app.post('*', (req, res) => {
        return nextHandler(req, res)
    })    

    server.listen(port, err => {
        if(err) throw err
        console.log(`> Next.js Server Ready on http://localhost:${port}`)
    })
})