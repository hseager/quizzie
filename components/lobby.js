import styles from '../styles/lobby.module.css'
import useLobby from '../hooks/useLobby'
import useSocket from '../hooks/useSocket'
import buttonStyles from '../styles/buttons.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { getUserId } from '../libs/localStorage'

export default function Lobby() {

    const router = useRouter()
    const lobbyId = router.query.lid

    const { lobby, setLobby, isLoading: isLobbyLoading, isError: isErrorLobby } = useLobby(lobbyId)

    const [nameField, setNameField] = useState('')
    const [userId, setUserId] = useState()
    const hasJoinedLobby = false

    const socket = useSocket('joinedLobby', user => {
        setLobby([...lobby.players, user])
    })

    const joinLobby = () => {
        if(nameField == '') return
        const newUser = { id: userId, name: nameField, lobbyId: userId }

        console.log(newUser)

        socket.emit('joinLobby', newUser)
        setLobby([...lobby.players, newUser])
        // setHasJoinedLobby(true)
    }

    useEffect(() => {
        socket.emit('createLobby', { id: uuid(), owner: getUserId(), players: []})
        setUserId(getUserId())
    },[userId])

    return (
        <div className={styles.lobby}>

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
                typeof lobby !== 'undefined' &&
                !hasJoinedLobby &&
                !isLobbyLoading &&
                !isErrorLobby &&
                <>
                <input placeholder="Your name" type="text" name="first-name" onChange={e => setNameField(e.target.value)} />
                <button className={buttonStyles.button} onClick={joinLobby}>Join</button>
                </>
            }
            {
                typeof lobby !== 'undefined' &&
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

        </div>
    )
}