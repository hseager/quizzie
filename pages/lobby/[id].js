import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import Questions from '../../components/questions'
import Results from '../../components/results'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'
import layout from '../../styles/layout.module.css'
import { getUserId } from '../../libs/localStorage'
import ErrorPage from 'next/error'

export default function LobbyPage({ quiz, lobby, statusCode }) {

    if(statusCode === 404)
        return (<ErrorPage statusCode={statusCode} />)

    const [status, setStatus] = useState(lobby.status)
    const socket = useSocket()

    useSocket('startQuiz', () => {
        setStatus('started')
    })

    useSocket('finishedQuiz', () => {
        setStatus('finished')
    })

    useEffect(() => {
        socket.emit('connectToLobby', {lobbyId: lobby._id, userId: getUserId()})
    }, [])

    return (
        <Layout>
            <div className={layout.fullHeightPage}>
                {
                    status == 'lobby' &&
                    <Lobby lobbyData={lobby} quiz={quiz} />
                }
                {
                    status == 'started' &&
                    <Questions lobby={lobby} quiz={quiz} />
                }
                {
                    status == 'finished' &&
                    <Results lobby={lobby} quiz={quiz} setStatus={setStatus} />
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
