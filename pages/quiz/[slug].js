import Layout from '../../components/layout'
import { getQuizData } from '../../libs/quizzes.js'
import buttonStyles from '../../styles/buttons.module.css'
import useSocket from '../../hooks/useSocket'
import useLobby from '../../hooks/useLobby'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

export default function Quiz({ quizData }) {

    const [nameField, setNameField] = useState('')
    const [hasJoinedLobby, setHasJoinedLobby] = useState(false)
    const [isLeader, setIsLeader] = useState(false)

    const { lobby, setLobby, isLoading: isLobbyLoading, isError: isErrorLobby } = useLobby('lobby1')

    const socket = useSocket('joinedLobby', user => {
        setLobby([...lobby, user])
    })

    const joinLobby = () => {
        if(lobby.length === 0) setIsLeader(true)
        const newUser = { id: uuid(), name: nameField, isLeader: isLeader }
        socket.emit('joinLobby', newUser)
        setLobby([...lobby, newUser])
        setHasJoinedLobby(true)
    }

    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{quizData.name}</strong></p>
            { isLobbyLoading && <p>Loading lobby...</p>}
            { isErrorLobby && <p>Error loading lobby</p>}
            {
                lobby.length > 0 &&
                !isLobbyLoading &&
                <>
                    <h2>Players</h2>
                    <ul>
                        {lobby.map(user => (
                            <li key={user.id}>{user.name}{user.isLeader ? '*' : ''}</li>
                        ))}
                    </ul>
                </>
            }
            {
                !hasJoinedLobby &&
                !isLobbyLoading &&
                <>
                <input placeholder={"Your name"} type="text" name="username" onChange={e => setNameField(e.target.value)} />
                <button className={buttonStyles.button} onClick={joinLobby}>Join</button>
                </>
            }
            {
                hasJoinedLobby && 
                <>
                <button className={buttonStyles.button}>Start Quiz</button>
                <h2>Invite players</h2>
                <p>Share this link: <br/><strong>http://localhost:3000/quiz/3</strong></p>
                <p>Or</p>
                <p>Type in this code at: <br/><strong>http://localhost:3000/join</strong></p>
                <p>Code: <strong>3</strong></p>
                </>
            }
        </Layout>
    )
}

export async function getServerSideProps({ params }) {
    const quizData = await getQuizData(params.slug)
    return {
        props: {
            quizData,
        }
    }
}
