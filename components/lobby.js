import styles from '../styles/lobby.module.css'
import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useState, useEffect } from 'react'
import { getUserId } from '../libs/localStorage'
import fetch from 'isomorphic-unfetch'

export default function Lobby({ data }) {

    const [name, setName] = useState('')
    const [userId, setUserId] = useState()
    const [lobby, setLobby] = useState(data)
    const [inLobby, setInLobby] = useState(true)

    const socket = useSocket('playerJoinedLobby', player => {
        setLobby({
            ...lobby,
            players: [
                ...lobby.players,
                player
            ]
        })
    })

    const joinLobby = async () => {
        if(name == '') return

        const player = { id: userId, name }

        fetch('http://localhost:3000/api/lobbies/join', {
            method: 'post',
            body: JSON.stringify({ owner: lobby.owner, player }),
            headers: { 'Content-Type': 'application/json' }
        })

        setInLobby(true)
        setLobby({
            ...lobby,
            players: [
                ...lobby.players,
                player
            ]
        })

        socket.emit('joinLobby', { owner: lobby.owner, player })
    }

    useEffect(() => {
        setUserId(getUserId())
    }, [userId])

    useEffect(() => {
        if(lobby && lobby.players){
            const isInLobby = lobby.players.some(p => p.id == userId)
            setInLobby(isInLobby)
        }
    }, [lobby, userId])

    if(!lobby)
        return <p>Loading lobby...</p>

    return (
        <div className={styles.lobby}>
            {
                lobby.players &&
                lobby.players.length > 0 &&
                <>
                    <h2>Players</h2>
                    <ul>
                        {lobby.players.map(user => (
                            <li key={user.id} className={(user.id === userId ? styles.playerInLobby : '')}>{user.name}</li>
                        ))}
                    </ul>
                </>
            }
            {
                !inLobby &&
                <>
                <input placeholder="Your name" type="text" name="first-name" onChange={e => setName(e.target.value)} />
                <button className={buttonStyles.button} onClick={joinLobby}>Join</button>
                </>
            }
            {
                inLobby && 
                userId === lobby.owner &&
                <>
                <button className={buttonStyles.button}>Start Quiz</button>
                <h2>Invite players</h2>
                <p>Share this link: <br/><strong>http://localhost:3000/quiz/3</strong></p>
                <p>Or</p>
                <p>Type in this code at: <br/><strong>http://localhost:3000/join</strong></p>
                <p>Code: <strong>3</strong></p>
                </>
            }
        </div>
    )
}