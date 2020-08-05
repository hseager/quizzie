import Layout from '../../components/layout'
import { getQuizData } from '../../libs/quizzes.js'
import buttonStyles from '../../styles/buttons.module.css'
import useSocket from '../../hooks/useSocket'
import { useState, useEffect } from 'react'

export default function Quiz({ quizData, lobbyData }) {

    const [lobby, setLobby] = useState(lobbyData || [])

    const socket = useSocket('joinedLobby', user => {
        setLobby(lobby => [...lobby, user])
    })

    useEffect(() => {
        const username = 'Harvey'
        let id = 2;
        socket.emit('joinLobby', { id: id++, name: username})
    }, [])

    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{quizData.name}</strong></p>

            <h2>Players</h2>
            <ul>
                {lobby.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
            <button className={buttonStyles.button}>Start Quiz</button>
            <h2>Invite players</h2>
            <p>Share this link: <br/><strong>http://localhost:3000/quiz/3</strong></p>
            <p>Or</p>
            <p>Type in this code at: <br/><strong>http://localhost:3000/join</strong></p>
            <p>Code: <strong>3</strong></p>
        </Layout>
    )
}

export async function getServerSideProps({ params }) {
    const response = await fetch('http://localhost:3000/lobbies/lobby1')
    const lobbyData = await response.json()

    const quizData = await getQuizData(params.id)
    return {
        props: {
            quizData,
            lobbyData
        }
    }
}
