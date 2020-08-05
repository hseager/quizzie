import Layout from '../../components/layout'
import { getQuizData } from '../../libs/quizzes.js'
import buttonStyles from '../../styles/buttons.module.css'
import useSocket from '../../hooks/useSocket'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function Quiz({ quizData, lobbyData }) {

    const [nameField, setNameField] = useState('Guest')
    const [lobby, setLobby] = useState(lobbyData || [])
    const [hasJoinedLobby, setHasJoinedLobby] = useState(false)

    const socket = useSocket('joinedLobby', user => {
        setLobby(lobby => [...lobby, user])
    })

    const joinLobby = () => {
        const newUser = { id: uuid(), name: nameField}
        socket.emit('joinLobby', newUser)
        setLobby(lobby => [...lobby, newUser])
        setHasJoinedLobby(true)
    }

    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{quizData.name}</strong></p>
            {
                lobby.length > 0 &&
                <>
                    <h2>Players</h2>
                    <ul>
                        {lobby.map(user => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                </>
            }
            {
                !hasJoinedLobby &&
                <>
                <input placeholder="Your name" type="text" name="username" onChange={e => setNameField(e.target.value)} />
                <button className={buttonStyles.button} onClick={joinLobby}>Join</button>
                </>
            }
            { hasJoinedLobby && <button className={buttonStyles.button}>Start Quiz</button> }
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
