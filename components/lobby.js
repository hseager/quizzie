import styles from '../styles/lobby.module.css'
import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useState, useEffect } from 'react'
import { getUserId } from '../libs/localStorage'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import config from '../libs/config'

export default function Lobby({ data, quizData }) {

    const [name, setName] = useState('')
    const [userId, setUserId] = useState()
    const [lobby, setLobby] = useState(data)
    const [inLobby, setInLobby] = useState(true)

    const router = useRouter()

    const socket = useSocket('playerJoinedLobby', player => {
        setLobby({
            ...lobby,
            players: [
                ...lobby.players,
                player
            ]
        })
    })

    useEffect(() => {
        setUserId(getUserId())
    }, [userId])

    useEffect(() => {
        if(lobby && lobby.players){
            const isInLobby = lobby.players.some(p => p.id == userId)
            setInLobby(isInLobby)
        }
    }, [lobby, userId])

    const joinLobby = async () => {
        if(name == '') return

        const player = { id: userId, name }

        fetch(`${config.siteUrl}/api/lobbies`, {
            method: 'post',
            body: JSON.stringify({ 
                id: lobby.owner,
                data: { players: player },
                push: true
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        setInLobby(true)
        socket.emit('joinLobby', { owner: lobby.owner, player })
    }

    const startQuiz = () => {
        fetch(`${config.siteUrl}/api/lobbies`, {
            method: 'post',
            body: JSON.stringify({
                id: lobby.owner,
                data: {
                    status: 'started'
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        socket.emit('startQuiz', { lobbyId: lobby.owner, questionCount: quizData.questions.length })
    }

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
                            <li 
                                key={user.id} 
                                className={(user.id === userId ? styles.playerInLobby : '')}
                            >
                                {user.name}
                            </li>
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
                    <button className={buttonStyles.button} onClick={startQuiz}>Start Quiz</button>
                    <h2>Invite players</h2>
                    <p>Share this link: <br/><strong><a href={ config.siteUrl + router.asPath }>{ config.siteUrl + router.asPath }</a></strong></p>
                    { /* }
                    <p>Or</p>
                    <p>Type in this code at: <br/><strong>http://localhost:3000/join</strong></p>
                    <p>Code: <strong>3</strong></p>
                    {*/}
                </>
            }
            {
                inLobby && 
                userId !== lobby.owner &&
                <>
                    <p>Waiting for the Quiz leader to start...</p>
                </>
            }
        </div>
    )
}