import useSocket from '../hooks/useSocket'
import { useState } from 'react'
import questionStyles from '../styles/questions.module.css'

export default function QuizQuestions({ quiz, lobby }) {

    const [currentQuestion, setCurrentQuestion] = useState(lobby.currentQuestion)
    const [nextQuestionTimer, setNextQuestionTimer] = useState()

    useSocket('changeQuestion', newQuestion => {
        setCurrentQuestion(newQuestion)
        setNextQuestionTimer(null)
    })

    useSocket('nextQuestionTimer', nextQuestionTime => {
        setNextQuestionTimer(nextQuestionTime)
    })

    return (
        <>
        {
            typeof quiz.questions[currentQuestion] !== 'undefined' &&
            <div className={questionStyles.questionPanel}>
                <div className={questionStyles.questionHeader}>
                    <p>Question <strong>{currentQuestion + 1}</strong> of <strong>{quiz.questions.length}</strong></p>
                    <h2>{ quiz.questions[currentQuestion].question }</h2>
                    {
                        nextQuestionTimer &&
                        <p>You have <strong>{nextQuestionTimer}</strong> seconds to answer!</p>
                    }
                </div>
                <div className={questionStyles.answers}>
                    {
                        quiz.questions[currentQuestion].answers.map((a, i) => (
                            <button key={i} className={questionStyles.answerButton}>{a}</button>
                        ))
                    }
                </div>
            </div>
        }
        </>
    )
}