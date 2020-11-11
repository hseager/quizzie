module.exports = class Lobby {
    constructor(id, io){
        this.id = id
        this.io = io
        this.connections = []
        this.players = []
    }
    connect(socket, userId, socketId){
        let connection = this.connections.find(c => c.userId === userId)
        if(typeof connection === 'undefined')
            this.connections.push({userId, socketId})
        else 
            connection.socketId = socketId

        socket.join(this.id)
    }
    disconnect(socketId){
        let connectionIndex = this.connections.findIndex(c => c.socketId === socketId)
        if(connectionIndex !== -1){
            const disconnectingUserId = this.connections[connectionIndex].userId
            this.connections.splice(connectionIndex, 1)
            this.kick(disconnectingUserId)
            // Broadcast disconnection to connected clients
            this.io.to(this.id).emit('playerLeftLobby', disconnectingUserId)
        }
    }
    isConnected(socketId){
        return this.connections.some(c => c.socketId === socketId)
    }
    join(player){
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/join`, {
            method: 'post',
            body: JSON.stringify({ 
                lobbyId: this.id,
                player
            }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => {
            console.log(`Error joining lobby. Error: ${err}`)
        })

        this.players.push(player)
        this.io.to(this.id).emit('playerJoinedLobby', player)
    }
    kick(userId){
        if(this.players.some(p => p.id === userId)){
            const updatedPlayers = this.players.filter(p => p.id !== userId)
            fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
                method: 'post',
                body: JSON.stringify({
                    id: this.id,
                    data: {
                        updatedPlayers
                    }
                }),
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }
}