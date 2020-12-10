module.exports = (server) => {
    const io = require('socket.io')(server)
    const Lobby = require('../libs/classes/lobby')
    const lobbies = []
    const disconnectionTimer = 30 * 1000

    io.on('connection', socket => {
        socket.on('connectToLobby', ({lobbyId, playerId}) => {
            // Get or create a new lobby
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby === 'undefined'){
                lobby = new Lobby(lobbyId, io)
                lobbies.push(lobby)
            }
            lobby.connect(socket, playerId)
        })
    
        socket.on('joinLobby', ({lobbyId, playerId, name}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.join(playerId, name)
        })
    
        socket.on('startQuiz', ({lobbyId, questionCount}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.startQuiz(questionCount)
        })

        socket.on('disconnect', () => {
            lobbies.map(lobby => {
                const player = lobby.players.find(p => p.socketId === socket.id)
                if(typeof player !== 'undefined'){
                    player.connected = false
                    setTimeout(() => {
                        // If player hasn't reconnected
                        if(!player.connected)
                            lobby.disconnect(socket.id)
                    }, disconnectionTimer)
                }
            })
        })
    })
}