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

    const getRowStyle = (place) => {
        if(place === 1)
            return resultStyles.resultRow1
        else if(place === 2)
            return resultStyles.resultRow2
        else
            return resultStyles.resultRow
    }

    return (
        <div className={pageStyles.main}>
            {
                <>
                    <h2>The Results</h2>
                    {
                        <div className={resultStyles.layout}>
                            {
                                quiz && 
                                <div className={resultStyles.card}>
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
                            <div className={resultStyles.resultsTable}>
                                {
                                    !results &&
                                    <div className={pageStyles.loading}>
                                        <div className={pageStyles.loadingAnimation}><div></div><div></div><div></div></div>
                                        <div className={pageStyles.loadingText}>Loading</div>
                                    </div>
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
                                    results.map((result, i) => (
                                        <div key={i} className={getRowStyle(result.place)}>
                                            <div>
                                                {result.place}<sup>{result.suffix}</sup> <strong>{getPlayerName(result.playerId)}</strong>
                                            </div>
                                            <div>
                                                <strong>{result.correctAnswers}</strong> / <strong>{quiz.questions.length}</strong>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
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