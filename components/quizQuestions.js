import buttonStyles from '../styles/buttons.module.css'
import useSocket from '../hooks/useSocket'
import { useState, useEffect } from 'react'

export default function QuizQuestions({ data }) {

    const questionTimeLimit = 10;
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [questionTimer, setQuestionTimer] = useState(questionTimeLimit)

    let questionTimeout = null

    useSocket('changeQuestion', newQuestion => {
        console.log(newQuestion)
        setCurrentQuestion(newQuestion)
        setQuestionTimer(questionTimeLimit)
        clearTimeout(questionTimeout)
    })

    useEffect(() => {

        if(questionTimer <= 0){
            clearTimeout(questionTimeout) 
            return
        }

        questionTimeout = setTimeout(() => {
            setQuestionTimer(questionTimer - 1)
        }, 1000)
    }, [questionTimer])

    return (
        <>
        {
            typeof data.questions[currentQuestion] !== 'undefined' &&
            <div>
                <h2>{ data.questions[currentQuestion].question }</h2>
                <p>Question {currentQuestion + 1} of {data.questions.length}</p>
                <p>You have {questionTimer} seconds to answer!</p>
                <div>
                    {
                        data.questions[currentQuestion].answers.map((a, i) => (
                            <button key={i} className={buttonStyles.button}>{a}</button>
                        ))
                    }
                </div>
            </div>
        }
        </>
    )
}