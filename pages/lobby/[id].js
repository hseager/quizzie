import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import Questions from '../../components/questions'
import Results from '../../components/results'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'
import layout from '../../styles/layout.module.css'

export default function LobbyPage({ quiz, lobby }) {

    const [status, setStatus] = useState(lobby.status)
    const socket = useSocket()

    useSocket('startQuiz', () => {
        setStatus('started')
    })

    useSocket('finishedQuiz', () => {
        setStatus('finished')
    })

    useEffect(() => {
        socket.emit('connectToLobby', lobby._id)
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

    const getLobby = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${context.params.id}`)
                        .catch(err => console.log(err))
    const lobby = await getLobby.json()

    // TODO: handle when lobby doesn't exist

    const getQuiz = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes/id/${lobby.quizId}`)
    .catch(err => console.log(err))
    const quiz = await getQuiz.json()

    return {
        props: {
            quiz,
            lobby
        }
    }
}
