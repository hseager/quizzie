module.exports = (server) => {
    const io = require('socket.io')(server)
    const Lobby = require('../libs/classes/lobby')
    const lobbies = []

    const disconnectionTimer = 5000

    io.on('connection', socket => {
        socket.on('connectToLobby', ({lobbyId, userId}) => {
            // Get or create a new lobby
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby === 'undefined'){
                lobby = new Lobby(lobbyId, io)
                lobbies.push(lobby)
            }
            lobby.connect(socket, userId, socket.id)
        })
    
        socket.on('joinLobby', ({lobbyId, player}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.join(player)
        })
    
        socket.on('startQuiz', ({lobbyId, questionCount}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.startQuiz(questionCount)
        })

        socket.on('disconnect', () => {
            setTimeout(() => {
                lobbies.forEach(lobby => {
                    if(lobby.isConnected(socket.id))
                        lobby.disconnect(socket.id)
                })
            }, disconnectionTimer)
        })

    })

}