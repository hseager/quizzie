const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const io = require('socket.io')(server)

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

// fake DB
const lobbies = []

/*
io.on('connection', socket => {

    socket.on('createLobby', lobby => {
        // Check if lobby already created
        if(lobbies.find(l => l.owner === lobby.owner)) return

        lobbies.push(lobby)
    })

    socket.on('joinLobby', user => {
        const lobby = lobbies.find(l => l.owner === user.lobbyId)

        const newUser = { id: user.id, name: user.name }
        lobby.players.push(newUser)

        socket.broadcast.emit('joinedLobby', newUser)
    })
})
*/

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