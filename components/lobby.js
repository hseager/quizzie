import styles from '../styles/lobby.module.css'
import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getUserId } from '../libs/localStorage'
import fetch from 'isomorphic-unfetch'

export default function Lobby() {

    const router = useRouter()
    const lobbyOwnerId = router.query.loid

    const [name, setName] = useState('')
    const [userId, setUserId] = useState()
    const [lobby, setLobby] = useState()
    const [inLobby, setInLobby] = useState(false)

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
            body: JSON.stringify({ lobbyOwnerId, player }),
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

        socket.emit('joinLobby', player)
    }

    useEffect(() => {
        setUserId(getUserId())
    },[userId])

    useEffect(() => {
        fetch(`/api/lobbies/${lobbyOwnerId}`)
            .then(res => res.json())
            .then(data => setLobby(data))
    }, [])

    useEffect(() => {
        if(lobby && lobby.players){
            const isInLobby = lobby.players.some(p => p.id == userId)
            setInLobby(isInLobby)
        }
    }, [lobby, inLobby])

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
                            <li key={user.id}>{user.name}</li>
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