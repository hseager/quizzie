import useSocket from '../hooks/useSocket'
import { useState, useEffect } from 'react'
import { formatResults } from '../libs/formatResults.js'
import pageStyles from '../styles/page.module.css'
import LoadingAnimation from '../components/loadingAnimation'
import buttonStyles from '../styles/buttons.module.css'
import resultStyles from '../styles/results.module.css'
import QuizCard from '../components/quizCard'
import Link from 'next/link'

export default function Results({ lobbyId, quiz, players, setStatus }) {

    const [results, setResults] = useState(null)
    const socket = useSocket()

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/results/${lobbyId}`)
            .then(res => res.json())
            .then(data => {
                if(data.results)
                    setResults(formatResults(data.results, quiz, players))
                else 
                    throw data
            })
            .catch(err => {
                setResults({ error: true, title: 'There was a problem retrieving the results', message: err.message })
            })
    }, [])

    const startAgain = () => {
        setStatus('lobby')
        socket.emit('startAgain', lobbyId)
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
                                    <QuizCard quiz={quiz} />
                                </div>
                            }
                            <div className={resultStyles.resultsTable}>
                                {
                                    !results &&
                                    <LoadingAnimation />
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
                                                {result.place}<sup>{result.suffix}</sup> <strong>{result.playerName}</strong>
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