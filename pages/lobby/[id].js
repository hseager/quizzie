import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import Questions from '../../components/questions'
import Results from '../../components/results'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'
import pageStyles from '../../styles/page.module.css'
import { getUserId } from '../../libs/localStorage'
import ErrorPage from 'next/error'

export default function LobbyPage({ quiz, lobby, statusCode }) {

    if(statusCode === 404)
        return (<ErrorPage statusCode={statusCode} />)

    const [status, setStatus] = useState(lobby.status)
    const [players, setPlayers] = useState(lobby.players)
    const socket = useSocket()

    useSocket('startQuiz', () => {
        setStatus('started')
    })

    useSocket('finishedQuiz', () => {
        setStatus('finished')
    })

    useSocket('playerJoinedLobby', player => {
       setPlayers(
           [
            ...players,
            player
           ]
       )
    })

    useSocket('playerLeftLobby', userId => {
        if(players.some(p => p.id === userId)){
            setPlayers(players.filter(p => p.id !== userId))
        }
    })

    useEffect(() => {
        // Connect to lobby when user loads lobby page
        socket.emit('connectToLobby', {
            lobbyId: lobby._id, 
            userId: getUserId()
        })
    }, [])

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
                    />
                }
                {
                    status == 'started' &&
                    <Questions 
                        lobbyId={lobby._id}
                        lobbyCurrentQuestion={lobby.currentQuestion}
                        players={players}
                        quiz={quiz}
                    />
                }
                {
                    status == 'finished' &&
                    <Results 
                        lobbyId={lobby._id} 
                        quiz={quiz} 
                        setStatus={setStatus}
                    />
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    
    const lobby = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${context.params.id}`)
                        .then(res => res.json())
                        .catch(err => console.log(err))

    // Throw 404 if lobby not found
    if(typeof lobby === 'undefined'){
        return {
            props: {
                statusCode: 404
            }
        }
    }

    const quiz = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes/id/${lobby.quizId}`)
                            .then(res => res.json())
                            .catch(err => console.log(err))

    return {
        props: {
            quiz,
            lobby
        }
    }

}
