import useSocket from '../hooks/useSocket'
import { useState, useEffect } from 'react'
import { formatResults } from '../libs/formatResults.js'
import pageStyles from '../styles/page.module.css'
import quizStyles from '../styles/quiz.module.css'
import buttonStyles from '../styles/buttons.module.css'
import resultStyles from '../styles/results.module.css'
import QuizImage from '../components/quizImage'
import Link from 'next/link'

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

        return 'Unknown'
    }

    return (
        <div className={pageStyles.main}>
            {
                !results &&
                <p>Loading the results!</p>
            }
            {
                results && results.error &&
                <>
                    <h3>{results.title}</h3>
                    <p>{results.message}</p>
                </>
            }
            {
                results && !results.error &&
                <>
                    <h2>The Results</h2>
                    {
                        quiz && 
                        <div className={quizStyles.card}>
                            <QuizImage src={quiz.image} width={365} height={210} />
                            <div className={quizStyles.listItemContent}>
                                <h4 className={quizStyles.title}>{quiz.title}</h4>
                                <div className={quizStyles.tags}>
                                    {quiz.tags.map((tag, i) => (
                                        <span key={i} className={quizStyles.tag}>{tag}</span>
                                    ))}
                                </div>
                                <p className={quizStyles.info}><strong>{quiz.difficulty}</strong></p>
                                <p className={quizStyles.info}><strong>{quiz.questions.length}</strong> Questions</p>
                            </div>
                        </div>
                    }
                    <div className={pageStyles.panel}>
                        {
                            results.overview.map((result, i) => (
                                <div key={i} className={resultStyles.resultRow}>
                                    <strong>{getPlayerName(result.playerId)}</strong>  scored <strong>{result.correctAnswers}</strong> out of <strong>{quiz.questions.length}</strong>
                                </div>
                            ))
                        }
                        
                    </div>
                    <div className={pageStyles.buttonPanel}>
                        <a className={buttonStyles.button} onClick={startAgain}>Continue</a>
                        <Link href={`/`}>
                            <a className={buttonStyles.button2}>Leave</a>
                        </Link>
                    </div>
                </>
            }

        </div>
    )
}