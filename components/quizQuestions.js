import styles from '../styles/questions.module.css'
import buttonStyles from '../styles/buttons.module.css'
import useSocket from '../hooks/useSocket'
import { useState } from 'react'

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
            <div className={styles.questionPanel}>
                <h2>{ quiz.questions[currentQuestion].question }</h2>
                <p>Question <strong>{currentQuestion + 1}</strong> of <strong>{quiz.questions.length}</strong></p>
                {
                    nextQuestionTimer &&
                    <p>You have <strong>{nextQuestionTimer}</strong> seconds to answer!</p>
                }
                <div>
                    {
                        quiz.questions[currentQuestion].answers.map((a, i) => (
                            <button key={i} className={buttonStyles.button}>{a}</button>
                        ))
                    }
                </div>
            </div>
        }
        </>
    )
}