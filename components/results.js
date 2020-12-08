import { useState, useEffect } from 'react'
import { formatResults } from '../libs/formatResults.js'
import Link from 'next/link'
import buttonStyles from '../styles/buttons.module.css'

export default function Results({ lobbyId, quiz, players, setStatus }) {

    const [results, setResults] = useState(null)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/results/${lobbyId}`)
            .then(res => res.json())
            .then(data => setResults(data.results))
            .catch(err => {
                console.log(err)
            })
    }, [])

    const startAgain = () => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
            method: 'post',
            body: JSON.stringify({
                id: lobbyId,
                data: {
                    status: 'lobby'
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        setStatus('lobby')
    }

    const getPlayerName = (playerId) => {
        const player = players.find(p => p.id === playerId)
        console.log(players)
        if(player)
            return player.name

        return 'Name'
    }

    if(!results)
        return <p>Loading the results!</p>

    return (
        <>
            <h3>The Results for: {quiz.name}</h3>
            {
                results.map((result, i) => (
                    <div key={i}>
                        { getPlayerName(result.playerId) }
                    </div>
                ))
                /*
                results.overview.map((result, i) => (
                    <div key={i}>
                        <p>{result.name} scored <strong>{result.correctAnswers}</strong> out of <strong>{quiz.questions.length}</strong></p>
                    </div>
                ))
                */
            }

            <a className={buttonStyles.button} onClick={startAgain}>Play another Quiz</a>
            <br/><br/>
            <Link href={`/`}>
                <a className={buttonStyles.button}>Leave</a>
            </Link>
        </>
    )
}