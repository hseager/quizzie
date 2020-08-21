const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const socketIoServer = require('./libs/socketIoServer')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

socketIoServer(server)

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