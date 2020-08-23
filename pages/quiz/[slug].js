import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import QuizQuestions from '../../components/quizQuestions'
import Results from '../../components/results'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'
import styles from '../../styles/quiz.module.css'

export default function Quiz({ quiz, lobby }) {

    const [status, setStatus] = useState(lobby.status)
    const socket = useSocket()

    useSocket('startQuiz', () => {
        setStatus('started')
    })

    useSocket('finishedQuiz', () => {
        setStatus('finished')
    })

    useEffect(() => {
        socket.emit('connectToLobby', lobby.owner)
    }, [])

    return (
        <Layout>
            <div class={styles.section}>
                <p>Play the Quiz: <strong>{quiz.name}</strong></p>
                {
                    status == 'lobby' &&
                    <Lobby data={lobby} quizData={quiz} />
                }
                {
                    status == 'started' &&
                    <QuizQuestions quiz={quiz} lobby={lobby} />
                }
                {
                    status == 'finished' &&
                    <Results />
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const quizRes = await fetch(`http://localhost:3000/api/quizzes/${context.params.slug}`)
    const quizJson = await quizRes.json()

    const loid = context.query.loid;
    if(!loid)
        context.res.redirect('/quizzes')

    const lobbyRes = await fetch(`http://localhost:3000/api/lobbies/${loid}`)
    const lobbyJson = await lobbyRes.json()

    return {
        props: {
            quiz: quizJson,
            lobby: lobbyJson
        }
    }
}
