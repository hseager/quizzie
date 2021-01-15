import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import pageStyles from '../styles/page.module.css'
import lobbyStyles from '../styles/lobby.module.css'
import ChangeQuizModal from '../components/changeQuizModal'
import Link from 'next/link'
import QuizCard from '../components/quizCard'

export default function Lobby({ lobbyId, lobbyOwner, quiz, players, playerId, playerJoined, setQuiz }) {

    const router = useRouter()
    const socket = useSocket()

    const [name, setName] = useState('')
    const [showChangeQuizModal, setShowChangeQuizModal] = useState(false)

    const joinedPlayers = players.filter(p => p.connected && p.joined).length

    const joinLobby = () => {
        if(name == '') return
        socket.emit('joinLobby', { 
            lobbyId,
            playerId,
            name
        })
    }

    const startQuiz = () => {
        socket.emit('startQuiz', lobbyId)
    }

    const changeQuiz = (quiz) => {
        setQuiz(quiz)
        socket.emit('changeQuiz', { lobbyId, quizId: quiz._id })
    }

    const getLobbyPlayerClass = (pId) => {
        let playerClass = '';
        
        if(pId === lobbyOwner)
            playerClass = lobbyStyles.playerOwner

        if(pId === playerId)
            playerClass += ' ' + lobbyStyles.playerCurrent
        
        return playerClass
    }

    if(!lobbyId)
        return <p>Loading lobby...</p>

    return (
        <div className={pageStyles.main}>
            <h1 className={pageStyles.title}>Quiz Lobby</h1>
            <div className={lobbyStyles.layout}>
                {
                    quiz && 
                    <div className={lobbyStyles.currentQuizPanel}>
                        <h3>Current Quiz</h3>
                        <QuizCard quiz={quiz} />
                    </div>
                }
                <div>
                    {
                        <div className={lobbyStyles.playersPanel}>
                            <h2 className={lobbyStyles.title}>{players && joinedPlayers} Player{(joinedPlayers === 1 ? '' : 's')}</h2>
                            {
                                players &&
                                players.some(p => p.joined) &&
                                <ul className={lobbyStyles.playersPanelList}>
                                    {
                                        players.map(player => {
                                            if(player.connected && player.joined){
                                                return <li 
                                                    key={player.id} 
                                                    className={getLobbyPlayerClass(player.id)}
                                                >
                                                    {player.name}
                                                </li>
                                            }
                                        })
                                    }
                                </ul>
                            }
                            {
                                playerJoined && 
                                playerId !== lobbyOwner &&
                                <p className={lobbyStyles.lobbyMessage}>Waiting for the quiz master to start...</p>
                            }
                        </div>
                    }
                    {
                        playerJoined && 
                        playerId === lobbyOwner &&
                        <div className={lobbyStyles.invitePanel}>
                            <h2>Invite players</h2>
                            <p>Share this link: <br/><strong><a href={ process.env.NEXT_PUBLIC_HOST + router.asPath }>{ process.env.NEXT_PUBLIC_HOST + router.asPath }</a></strong></p>
                        </div>
                    }
                    {
                        !playerJoined &&
                        <div className={lobbyStyles.joinPanel}>
                            <input placeholder="Enter your name to join" type="text" name="first-name" className={lobbyStyles.nameField} onChange={e => setName(e.target.value)} />
                            <button className={buttonStyles.button} onClick={joinLobby}>Join</button>
                        </div>
                    }
                    <div className={pageStyles.buttonPanel}>
                        {
                            playerJoined && 
                            playerId === lobbyOwner &&
                            <>
                                <button className={buttonStyles.button} onClick={startQuiz}>Start Quiz</button>
                                <button className={buttonStyles.button} onClick={() => { setShowChangeQuizModal(true)}}>Change Quiz</button>
                            </>
                        }
                        <Link href={`/`}>
                            <a className={buttonStyles.button2}>Leave</a>
                        </Link>
                    </div>
                </div>
            </div>
            <ChangeQuizModal 
                showModal={showChangeQuizModal} 
                setShowModal={setShowChangeQuizModal} 
                changeQuiz={changeQuiz} />
        </div>
    )
}