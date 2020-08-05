const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const WebSocket = require('ws')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

// fake DB
const quizzes = {
    quiz1: [],
}

try{
    const webSocketPort = 2022;
    const wss = new WebSocket.Server({ port: webSocketPort })
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('message received: %s', message)
        })
        ws.send('Client connected to websocket')
    })
    console.log(`> WebSocket Server Ready on ws://localhost:${webSocketPort}`);
} catch(err) {
    console.log(`Error with Websocket Server: ${err}`);
}

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res)
    })

    server.listen(port, err => {
        if(err) throw err
        console.log(`> Next.js Server Ready on http://localhost:${port}`)
    })
})