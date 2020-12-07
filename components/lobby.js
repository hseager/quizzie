import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useState, useEffect } from 'react'
import { getUserId } from '../libs/localStorage'
import { useRouter } from 'next/router'
import pageStyles from '../styles/page.module.css'
import styles from '../styles/lobby.module.css'
import Link from 'next/link'

export default function Lobby({ lobbyId, lobbyOwner, quiz, players }) {

    const [name, setName] = useState('')
    const [userId, setUserId] = useState()
    const [inLobby, setInLobby] = useState(true)

    const router = useRouter()
    const socket = useSocket()

    useEffect(() => {
        setUserId(getUserId())
    }, [userId])

    useEffect(() => {
        if(players){
            const isInLobby = players.some(p => p.id == userId)
            setInLobby(isInLobby)
        }
    }, [players, userId])

    const joinLobby = () => {
        if(name == '') return
        setInLobby(true)
        socket.emit('joinLobby', { 
            lobbyId,
            userId,
            name
        })
    }

    const startQuiz = () => {
        socket.emit('startQuiz', { 
            lobbyId,
            quizId: quiz._id,
            questionCount: quiz.questions.length
        })
    }

    const getLobbyPlayerClass = (playerId) => {
        let playerClass = '';
        
        if(playerId === lobbyOwner)
            playerClass = styles.playerOwner

        if(playerId === userId)
            playerClass += ' ' + styles.playerCurrent
        
        return playerClass
    }

    if(!lobbyId)
        return <p>Loading lobby...</p>

    return (
        <>
            {
                userId === lobbyOwner &&
                <h1 className={pageStyles.title}>Invite your friends</h1>
            }
            {
                userId !== lobbyOwner &&
                <h1 className={pageStyles.title}>Get ready to play a Quiz</h1>
            }
            {
                quiz && 
                <>
                    <p>You are playing the quiz: <strong>{quiz.name}</strong></p>
                    <p><strong>{quiz.questions.length}</strong> Questions</p>
                </>
            }
            {
                players &&
                players.length > 0 &&
                <div className={styles.lobbyPanel}>
                    <h2 className={styles.lobbyTitle}>Players</h2>
                    <ul>
                        {players.map(player => (
                            <li 
                                key={player.id} 
                                className={getLobbyPlayerClass(player.id)}
                            >
                                {player.name}
                            </li>
                        ))}
                    </ul>
                </div>
            }
            {
                !inLobby &&
                <>
                    <input placeholder="Enter your name" type="text" name="first-name" className={styles.nameField} onChange={e => setName(e.target.value)} />
                    <button className={buttonStyles.button} onClick={joinLobby}>Join</button>
                </>
            }
            {
                inLobby && 
                userId === lobbyOwner &&
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
                userId !== lobbyOwner &&
                <>
                    <p>Waiting for the Quiz leader to start...</p>
                </>
            }
        </>
    )
}