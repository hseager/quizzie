const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const io = require('socket.io')(server)

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

// fake DB
const lobbies = {
    lobby1: [{ id: 1, name: 'John'}],
    lobby2: [],
}

io.on('connection', socket => {
    socket.on('joinLobby', data => {
        lobbies['lobby1'].push(data)
        socket.broadcast.emit('joinedLobby', data)
    })
})

nextApp.prepare().then(() => {

    app.get('/lobbies/:lobby', (req, res) => {
        res.json(lobbies[req.params.lobby])
    })

    app.get('*', (req, res) => {
        return nextHandler(req, res)
    })

    server.listen(port, err => {
        if(err) throw err
        console.log(`> Next.js Server Ready on http://localhost:${port}`)
    })
})