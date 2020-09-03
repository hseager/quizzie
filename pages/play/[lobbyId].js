import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import Questions from '../../components/questions'
import Results from '../../components/results'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'
import layout from '../../styles/layout.module.css'
import config from '../../libs/config'

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
            <div className={layout.fullHeightPage}>
                {
                    status == 'lobby' &&
                    <Lobby data={lobby} quizData={quiz} />
                }
                {
                    status == 'started' &&
                    <Questions quiz={quiz} lobby={lobby} />
                }
                {
                    status == 'finished' &&
                    <Results lobby={lobby} quizData={quiz} setStatus={setStatus} />
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {

    /*
    const quizRes = await fetch(`${config.siteUrl}/api/quizzes/${context.params.slug}`)
                                .catch((err) => { console.log(err) })
    const quizJson = await quizRes.json()
    */

   const quizJson = null;

   /*
    const loid = context.query.l;
    if(!loid)
        context.res.redirect('/choose-a-quiz')
    */

    const lobbyRes = await fetch(`${config.siteUrl}/api/lobbies/${context.params.lobbyId}?q=${context.query.q}`)
                                .catch((err) => { console.log(err) })
    const lobbyJson = await lobbyRes.json()

    return {
        props: {
            quiz: quizJson,
            lobby: lobbyJson
        }
    }
}