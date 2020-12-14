import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import Questions from '../../components/questions'
import Results from '../../components/results'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'
import pageStyles from '../../styles/page.module.css'
import { getPlayerId } from '../../libs/localStorage'
import ErrorPage from 'next/error'

export default function LobbyPage({ quiz, lobby, statusCode }) {

    if(statusCode !== 200)
        return (<ErrorPage statusCode={statusCode} />)

    const [status, setStatus] = useState(lobby.status)
    const [players, setPlayers] = useState(lobby.players)
    const [quizCount, setQuizCount] = useState(lobby.quizCount)
    const [playerId, setPlayerId] = useState()
    const [playerJoined, setPlayerJoined] = useState(false)
    const socket = useSocket()

    useEffect(() => {
        setPlayerId(getPlayerId())
    }, [playerId])

    useSocket('startQuiz', quizCount => {
        setQuizCount(quizCount)
        setStatus('started')
    })

    useSocket('finishQuiz', () => {
        setStatus('finished')
    })

    useSocket('updatePlayers', players => {
        setPlayers(players)
    })

    useEffect(() => {
        socket.emit('connectToLobby', {
            lobbyId: lobby._id,
            playerId: getPlayerId()
        })
    }, [])

    useEffect(() => {
        setPlayerJoined(players.some(p => p.id == playerId && p.joined))
    }, [players, playerId])

    return (
        <Layout>
            <div className={pageStyles.fullHeightPage}>
                {
                    status == 'lobby' &&
                    <Lobby 
                        lobbyId={lobby._id} 
                        lobbyOwner={lobby.owner}
                        quiz={quiz}
                        players={players}
                        playerId={playerId}
                        playerJoined={playerJoined}
                    />
                }
                {
                    status == 'started' &&
                    playerJoined &&
                    <Questions 
                        lobbyId={lobby._id}
                        lobbyCurrentQuestion={lobby.currentQuestion}
                        quizCount={quizCount}
                        quiz={quiz}
                    />
                }
                {
                    status == 'finished' &&
                    playerJoined &&
                    <Results 
                        lobbyId={lobby._id}
                        quiz={quiz}
                        players={players}
                        setStatus={setStatus}
                    />
                }
                {
                    status !== 'lobby' &&
                    !playerJoined &&
                    <>
                        <h3>Sorry, the quiz has already started</h3>
                        <p>Please try to join again once the quiz has finished.</p>
                    </>
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const lobbyRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${context.params.id}`)
                                .then(res => res.json())
                                .catch(err => console.log(err))

    if(lobbyRequest.status !== 200){
        return {
            props: {
                statusCode: lobbyRequest.status
            }
        }
    }

    const lobby = lobbyRequest.data;

    const quizRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes/id/${lobby.quizId}`)
                            .then(res => res.json())
                            .catch(err => console.log(err))
    
    if(quizRequest.status !== 200){
        return {
            props: {
                statusCode: quizRequest.status
            }
        }
    }
    
    const quiz = quizRequest.data

    return {
        props: {
            quiz,
            lobby,
            statusCode: 200
        }
    }
}
