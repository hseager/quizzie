import useSocket from '../hooks/useSocket'
import { useState } from 'react'
import questionStyles from '../styles/questions.module.css'
import { getUserId } from '../libs/localStorage'

export default function Questions({ quiz, lobby }) {

    const [currentQuestion, setCurrentQuestion] = useState(lobby.currentQuestion)
    const [nextQuestionTimer, setNextQuestionTimer] = useState()
    const [disableAnswers, setDisableAnswers] = useState(false)

    useSocket('changeQuestion', newQuestion => {
        setCurrentQuestion(newQuestion)
        setNextQuestionTimer(null)
        setDisableAnswers(false)
    })

    useSocket('nextQuestionTimer', nextQuestionTime => {
        setNextQuestionTimer(nextQuestionTime)
    })

    const answerQuestion = (answer) => {
        
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/results/answer`, {
            method: 'post',
            body: JSON.stringify({
                lobbyId: lobby._id,
                data: {
                    player: lobby.players.find(p => p.id === getUserId()),
                    question: currentQuestion,
                    answer
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        setDisableAnswers(true)
    }

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
                        quiz.questions[currentQuestion].answers.map((answer, i) => (
                            <button 
                                key={i} 
                                className={questionStyles.answerButton}
                                onClick={() => answerQuestion(i)}
                                disabled={disableAnswers}
                            >
                                {answer}
                            </button>
                        ))
                    }
                </div>
            </div>
        }
        </>
    )
}