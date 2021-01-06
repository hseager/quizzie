import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import pageStyles from '../styles/page.module.css'
import lobbyStyles from '../styles/lobby.module.css'
import ChangeQuizModal from '../components/changeQuizModal'
import Link from 'next/link'
import quizStyles from '../styles/quiz.module.css'
import QuizImage from '../components/quizImage'

export default function Lobby({ lobbyId, lobbyOwner, quiz, players, playerId, playerJoined, setQuiz }) {

    const router = useRouter()
    const socket = useSocket()

    const [name, setName] = useState('')
    const [showChangeQuizModal, setShowChangeQuizModal] = useState(false)

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
        <>
            <h1 className={pageStyles.title}>Lobby</h1>
            <div className={lobbyStyles.main}></div>
            {
                players &&
                players.some(p => p.joined) &&
                <div className={lobbyStyles.panel}>
                    <h2 className={lobbyStyles.title}>Players</h2>
                    <ul>
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
                </div>
            }
            {
                !playerJoined &&
                <>
                    <input placeholder="Enter your name" type="text" name="first-name" className={lobbyStyles.nameField} onChange={e => setName(e.target.value)} />
                    <button className={buttonStyles.button} onClick={joinLobby}>Join</button>
                </>
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
                quiz && 
                <>
                    <h3>Selected Quiz</h3>
                    <div className={quizStyles.card}>
                        <QuizImage src={quiz.image} width={365} height={210} />
                        <div className={quizStyles.listItemContent}>
                            <h4 className={quizStyles.title}>{quiz.title}</h4>
                            <div className={quizStyles.tags}>
                                {quiz.tags.map((tag, i) => (
                                    <span key={i} className={quizStyles.tag}>{tag}</span>
                                ))}
                            </div>
                            <p className={quizStyles.info}><strong>{quiz.difficulty}</strong></p>
                            <p className={quizStyles.info}><strong>{quiz.questions.length}</strong> Questions</p>
                        </div>
                    </div>

                </>
            }  
            {
                playerJoined && 
                playerId === lobbyOwner &&
                <>
                    <button className={buttonStyles.button} onClick={startQuiz}>Start Quiz</button>
                    <button className={buttonStyles.button} onClick={() => { setShowChangeQuizModal(true)}}>Change Quiz</button>
                </>
            }
            {
                playerJoined && 
                playerId !== lobbyOwner &&
                <p>Waiting for the Quiz leader to start...</p>
            }
            {
                playerJoined &&
                <Link href={`/`}>
                    <a className={buttonStyles.button2}>Leave</a>
                </Link>
            } 
            <ChangeQuizModal 
                showModal={showChangeQuizModal} 
                setShowModal={setShowChangeQuizModal} 
                changeQuiz={changeQuiz} />
        </>
    )
}