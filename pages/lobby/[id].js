import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import Questions from '../../components/questions'
import Results from '../../components/results'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'
import { getPlayerId } from '../../libs/localStorage'
import ErrorPage from '../../pages/_error.js'
import { HttpRequestError } from '../../libs/HttpRequestError'
import emptyPageStyles from '../../styles/emptyPage.module.css'

export default function LobbyPage({ quizData, lobby, statusCode, errorMessage }) {

    if(statusCode !== 200)
        return (<ErrorPage statusCode={statusCode} errorMessage={errorMessage} />)

    const [quiz, setQuiz] = useState(quizData)
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

    useSocket('updateQuiz', quiz => {
        setQuiz(quiz)
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
            {
                status == 'lobby' &&
                <Lobby 
                    lobbyId={lobby._id} 
                    lobbyOwner={lobby.owner}
                    quiz={quiz}
                    players={players}
                    playerId={playerId}
                    playerJoined={playerJoined}
                    setQuiz={setQuiz}
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
                <div className={emptyPageStyles.main}>
                    <h2>The quiz has already started</h2>
                    <p>Please try to join again once the quiz has finished.</p>
                </div>
            }
        </Layout>
    )
}

export async function getServerSideProps(context) {
    try{
        const lobbyRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${context.params.id}`)
        .then(res => res.json())
        .catch(err => { throw new HttpRequestError(500, err) })

        if(!lobbyRequest)
            throw new HttpRequestError(500, 'Error retrieving lobby')

        if(lobbyRequest.status !== 200)
            throw new HttpRequestError(lobbyRequest.status, lobbyRequest.message)

        const quizRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes/${lobbyRequest.data.quizId}`)
        .then(res => res.json())
        .catch(err => { throw new HttpRequestError(500, err) })

        if(!quizRequest)
            throw new HttpRequestError(500, 'Error retrieving quiz')

        if(quizRequest.status !== 200)
            throw new HttpRequestError(quizRequest.status, quizRequest.message)

        return {
            props: {
                quizData: quizRequest.data ? quizRequest.data : null,
                lobby: lobbyRequest.data ? lobbyRequest.data : null,
                statusCode: 200
            }
        }
    } catch(err){
        console.log(`HttpRequestError: ${err.status} - ${err.message}`)
        return {
            props: {
                statusCode: err.status,
                errorMessage: err.message
            }
        }
    }
}
