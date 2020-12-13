import { v4 as uuid } from 'uuid'

const playerIdKey = 'playerId';

export function setPlayerId() {
    const playerId = window.localStorage.getItem(playerIdKey)
    if(!playerId){
        const newPlayerId = uuid()
        window.localStorage.setItem(playerIdKey, newPlayerId)
        return newPlayerId
    }
    return playerId
}

export function getPlayerId() {
    return setPlayerId()
}