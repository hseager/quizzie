import useSocket from '../hooks/useSocket'
import { useState, useEffect } from 'react'
import { formatResults } from '../libs/formatResults.js'
import buttonStyles from '../styles/buttons.module.css'

export default function Results({ lobbyId, quiz, players, setStatus }) {

    const [results, setResults] = useState(null)
    const socket = useSocket()

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/results/${lobbyId}`)
            .then(res => res.json())
            .then(data => {
                if(data.results)
                    setResults(formatResults(data.results, quiz))
                else 
                    throw data
            })
            .catch(err => {
                setResults({ error: true, title: 'There was a problem with the request', message: err.message })
            })
    }, [])

    const startAgain = () => {
        setStatus('lobby')
        socket.emit('startAgain', lobbyId)
    }

    const getPlayerName = (playerId) => {
        const player = players.find(p => p.id === playerId)
        if(player)
            return player.name

        return 'Name'
    }

    if(!results)
        return <p>Loading the results!</p>

    if(results.error)
        return <>
            <h3>{results.title}</h3>
            <p>{results.message}</p>
        </>

    return (
        <>
            <h3>The Results for: {quiz.title}</h3>
            {
                results.overview.map((result, i) => (
                    <div key={i}>
                        <p>{getPlayerName(result.playerId)} scored <strong>{result.correctAnswers}</strong> out of <strong>{quiz.questions.length}</strong></p>
                    </div>
                ))
            }

            <a className={buttonStyles.button} onClick={startAgain}>Continue</a>
        </>
    )
}