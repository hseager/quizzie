import Layout from '../../components/layout'
import { getQuizData } from '../../libs/quizzes.js'
import buttonStyles from '../../styles/buttons.module.css'
import useSocket from '../../hooks/useSocket'
import useLobby from '../../hooks/useLobby'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'



export default function Quiz({ quizData }) {

    const router = useRouter()
    const lobbyId = router.query.lid

    const [hasJoinedLobby, setHasJoinedLobby] = useState(false)
    const [nameField, setNameField] = useState('')
    const [userId, setUserId] = useState(uuid())

    const { lobby, setLobby, isLoading: isLobbyLoading, isError: isErrorLobby } = useLobby(lobbyId)
    

    /*
    Trying to check if user already joined: this might help:
        https://github.com/vercel/swr#ssr-with-nextjs
        
    const hasJoined = lobby.players.some(p => p.id === userId)
    console.log(hasJoined);
    */

    const socket = useSocket('joinedLobby', user => {
        setLobby([...lobby.players, user])
    })

    const joinLobby = () => {
        if(nameField == '') return
        if(lobby.length === 0) setIsLeader(true)
        const newUser = { id: userId, name: nameField, lobbyId: userId }

        socket.emit('joinLobby', newUser)
        setLobby([...lobby.players, newUser])
        setHasJoinedLobby(true)
    }

    useEffect(() => {
        let localUserId = window.localStorage.getItem('userId');
        if(!localUserId){
            window.localStorage.setItem('userId', userId)
            localUserId = userId
        }
        
        socket.emit('createLobby', { id: uuid(), owner: localUserId, players: []})
        setUserId(localUserId)

    }, [])

    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{quizData.name}</strong></p>
            { isLobbyLoading && <p>Loading lobby...</p>}
            { isErrorLobby && <p>Error loading lobby</p>}
            {
                !isLobbyLoading &&
                !isErrorLobby &&
                typeof lobby.players !== 'undefined' &&
                lobby.players.length > 0 &&
                <>
                    <h2>Players</h2>
                    <ul>
                        {lobby.players.map(user => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                </>
            }
            {
                !hasJoinedLobby &&
                !isLobbyLoading &&
                !isErrorLobby &&
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
