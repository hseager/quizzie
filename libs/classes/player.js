module.exports = class Player {
    constructor(id, socketId){
        this.id = id
        this.socketId = socketId
        this.name
        this.connected = false
        this.lobbyId
    }
}