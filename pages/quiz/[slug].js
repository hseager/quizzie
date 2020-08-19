import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import Countdown from '../../components/countdown'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'

export default function Quiz({ quizData, lobbyData }) {

    // const [isCountingDown, setIsCountingDown] = useState(false) 

    useSocket('startQuiz', () => {
        // setIsCountingDown(true)
    })

    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{quizData.name}</strong></p>
            {
                // !isCountingDown &&
                <Lobby data={lobbyData} />
            }
            {
                /*
                isCountingDown &&
                <Countdown />
                */
            }
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
            quizData: quizJson,
            lobbyData: lobbyJson
        }
    }
}
