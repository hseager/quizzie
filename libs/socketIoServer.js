module.exports = (server) => {
    const io = require('socket.io')(server)
    const Lobby = require('../libs/classes/lobby')
    const lobbies = []

    io.on('connection', socket => {
        socket.on('connectToLobby', async ({lobbyId, playerId}) => {
            // Get or create a new lobby
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby === 'undefined'){
                lobby = new Lobby(lobbyId, io)
                await lobby.load()
                lobbies.push(lobby)
            }
            lobby.connect(socket, playerId)
        })
    
        socket.on('joinLobby', ({lobbyId, playerId, name}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.join(playerId, name)
        })
    
        socket.on('startQuiz', lobbyId => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.startQuiz()
        })

        socket.on('startAgain', lobbyId => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined')
                lobby.startAgain()
        })

        socket.on('changeQuiz', ({lobbyId, quizId}) => {
            let lobby = lobbies.find(l => l.id === lobbyId)
            if(typeof lobby !== 'undefined'){
                lobby.changeQuiz(quizId)
            }
        })

        socket.on('disconnect', () => {
            lobbies.map(lobby => {
                let player = lobby.players.find(p => p.socketIds.some(s => s === socket.id))
                if(typeof player !== 'undefined')
                    lobby.disconnect(player, socket.id)
            })
        })
    })
}