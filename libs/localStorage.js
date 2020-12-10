import { v4 as uuid } from 'uuid'

const playerIdKey = 'playerId';

export function setPlayerId() {
    const playerId = window.localStorage.getItem(playerIdKey);
    if(!playerId){
        window.localStorage.setItem(playerIdKey, uuid())
    }
    return playerId;
}

export function getPlayerId() {
    return setPlayerId()
}