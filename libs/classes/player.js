module.exports = class Player {
    constructor(id){
        this.id = id
        this.socketIds = []
        this.name
        this.connected = false
        this.joined = false
    }
}