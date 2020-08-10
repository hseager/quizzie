import { v4 as uuid } from 'uuid'

const userIdKey = 'userId';

export function setUserId() {
    const userId = window.localStorage.getItem(userIdKey);
    if(!userId){
        window.localStorage.setItem(userIdKey, uuid())
    }
    return userId;
}

export function getUserId() {
    return setUserId()
}