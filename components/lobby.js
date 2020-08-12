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
    const lobbyOwnerId = router.query.loid

    const { lobby, setLobby, isLoading, isError } = useLobby(lobbyOwnerId)

    const [name, setName] = useState('')
    const [userId, setUserId] = useState()
    const hasJoinedLobby = false

    /*
    const socket = useSocket('joinedLobby', user => {
        setLobby([...lobby.players, user])
    })
    */

    const joinLobby = async () => {
        if(name == '') return

        const player = { id: userId, name }

        const joinResult = await fetch('http://127.0.0.1:3000/api/lobbies/join',
            {
                method: 'post',
                body: JSON.stringify({ lobbyOwnerId, player }),
                headers: { 'Content-Type': 'application/json' }
            }
        )

        console.log(joinResult)

        //socket.emit('joinLobby', newUser)
        setLobby([...lobby.players, player])
    }

    useEffect(() => {
        setUserId(getUserId())
    },[userId])

    useEffect(() => {
        const players = lobby.players
        console.log(players)
    },[])

    if(isLoading){
        return <p>Loading lobby...</p>
    }

    if(isError){
        return <p>Error loading lobby</p>
    }

    return (
        <div className={styles.lobby}>


            {
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
                <>
                <input placeholder="Your name" type="text" name="first-name" onChange={e => setName(e.target.value)} />
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