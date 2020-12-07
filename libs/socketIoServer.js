module.exports = (server) => {
    const io = require('socket.io')(server)
    const Lobby = require('../libs/classes/lobby')
    const Player = require('../libs/classes/player')
    const lobbies = []
    const players = []
    const disconnectionTimer = 30 * 1000

    io.on('connection', socket => {
        socket.on('connectToLobby', ({lobbyId, userId}) => {
            // TODO: is there a better way or better time to create lobby?
            // Get or create a new lobby
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby === 'undefined'){
                lobby = new Lobby(lobbyId, io)
                lobbies.push(lobby)
            }

            // Keep track of connected players
            let player = players.find(p => p.id === userId)
            if(typeof player === 'undefined'){
                player = new Player(userId, socket.id)
                player.connected = true
                player.lobbyId = lobbyId
                players.push(player)
            } else {
                player.socketId = socket.id
                player.connected = true
                player.lobbyId = lobbyId
            }

            lobby.connect(socket, player)
        })
    
        socket.on('joinLobby', ({lobbyId, userId, name}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            let player = players.find(p => p.id === userId)
            if(typeof lobby !== 'undefined' || typeof player !== 'undefined'){
                player.name = name
                lobby.join(player)
            }
        })
    
        socket.on('startQuiz', ({lobbyId, questionCount, quizId}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.startQuiz(questionCount, quizId)
        })

        socket.on('disconnect', () => {
            const player = players.find(p => p.socketId === socket.id)
            if(typeof player !== 'undefined'){
                player.connected = false
                setTimeout(() => {
                    if(player.connected === false){
                        const lobby = lobbies.find(l => l.id == player.lobbyId)
                        lobby.disconnect(player)
                    }
                }, disconnectionTimer)
            }
        })

    })

}