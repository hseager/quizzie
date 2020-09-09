import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useState, useEffect } from 'react'
import { getUserId } from '../libs/localStorage'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import layout from '../styles/layout.module.css'
import styles from '../styles/lobby.module.css'
import Link from 'next/link'

export default function Lobby({ lobbyData, quiz }) {

    const [name, setName] = useState('')
    const [userId, setUserId] = useState()
    const [lobby, setLobby] = useState(lobbyData)
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

        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/join`, {
            method: 'post',
            body: JSON.stringify({ 
                lobbyId: lobby._id,
                player
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        // TODO: handle errors

        setInLobby(true)
        socket.emit('joinLobby', { lobbyId: lobby._id, player })
    }

    const startQuiz = () => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
            method: 'post',
            body: JSON.stringify({
                id: lobby._id,
                data: {
                    status: 'started'
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/results`, {
            method: 'post',
            body: JSON.stringify({
                lobbyId: lobby._id,
                quizId: quiz._id
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        socket.emit('startQuiz', { lobbyId: lobby._id, questionCount: quiz.questions.length })
    }

    const getLobbyPlayerClass = (playerId) => {

        let playerClass = '';
        
        if(playerId === lobby.owner)
            playerClass = styles.playerOwner

        if(playerId === userId)
            playerClass += ' ' + styles.playerCurrent
        
        return playerClass
    }

    if(!lobby)
        return <p>Loading lobby...</p>

    return (
        <>
            {
                userId === lobby.owner &&
                <h1 className={layout.title}>Invite your friends</h1>
            }
            {
                userId !== lobby.owner &&
                <h1 className={layout.title}>Get ready to play a Quiz</h1>
            }
            {
                quiz && 
                <>
                    <p>You are playing the quiz: <strong>{quiz.name}</strong></p>
                    <p><strong>{quiz.questions.length}</strong> Questions</p>
                </>
            }
            {
                lobby.players &&
                lobby.players.length > 0 &&
                <div className={styles.lobbyPanel}>
                    <h2 className={styles.lobbyTitle}>Players</h2>
                    <ul>
                        {lobby.players.map(user => (
                            <li 
                                key={user.id} 
                                className={getLobbyPlayerClass(user.id)}
                            >
                                {user.name}
                            </li>
                        ))}
                    </ul>
                </div>
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
                    <div className={styles.invitePanel}>
                        <h2>Invite players</h2>
                        <p>Share this link: <br/><strong><a href={ process.env.NEXT_PUBLIC_HOST + router.asPath }>{ process.env.NEXT_PUBLIC_HOST + router.asPath }</a></strong></p>
                        { /* }
                        <p>Or</p>
                        <p>Type in this code at: <br/><strong>http://localhost:3000/join</strong></p>
                        <p>Code: <strong>3</strong></p>
                        {*/}
                    </div>
                    {
                        quiz &&
                        <button className={buttonStyles.button} onClick={startQuiz}>Start Quiz</button>
                    }
                    <Link href={`/choose-a-quiz`}>
                        <a className={buttonStyles.button}>Change Quiz</a>
                    </Link>
                </>
            }
            {
                inLobby && 
                userId !== lobby.owner &&
                <>
                    <p>Waiting for the Quiz leader to start...</p>
                </>
            }
        </>
    )
}