import { useState, useEffect } from 'react'
import { formatResults } from '../libs/results.js'
import Link from 'next/link'
import buttonStyles from '../styles/buttons.module.css'

export default function Results({ lobbyId, quizData }) {

    const [results, setResults] = useState(null)

    useEffect(() => {
        fetch(`/api/results/${lobbyId}`)
            .then(res => res.json())
            .then(data => setResults(formatResults(data, quizData)))
            .catch((err) => {
                console.log(err)
            })
    }, [])

    if(!results)
        return <p>Loading the results!</p>

    return (
        <>
            <h3>The Results for your {quizData.name} quiz!</h3>
            {
                results.overview.map((result, i) => (
                    <div key={i}>
                        <p>{result.name} scored <strong>{result.correctAnswers}</strong> out of <strong>{quizData.questions.length}</strong></p>
                    </div>
                ))
            }
            <Link href={`/choose-a-quiz`}>
                <a className={buttonStyles.button}>Play another Quiz</a>
            </Link>
        </>
    )
}