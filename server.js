const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const io = require('socket.io')(server)

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

io.on('connection', socket => {
    socket.on('joinLobby', (lobbyData) => {
        socket.join(lobbyData.owner)
        socket.to(lobbyData.owner).emit('playerJoinedLobby', lobbyData.player)
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