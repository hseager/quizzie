import useSocket from '../hooks/useSocket'
import { useState } from 'react'
import questionStyles from '../styles/questions.module.css'
import { getUserId } from '../libs/localStorage'

// TODO: you can refresh page and answer again
export default function Questions({ quiz, lobbyId, lobbyCurrentQuestion, players }) {

    const [currentQuestion, setCurrentQuestion] = useState(lobbyCurrentQuestion)
    const [nextQuestionTimer, setNextQuestionTimer] = useState()
    const [disableAnswers, setDisableAnswers] = useState(false)

    useSocket('changeQuestion', newQuestion => {
        setCurrentQuestion(newQuestion)
        setDisableAnswers(false)
    })

    useSocket('nextQuestionTimer', nextQuestionTime => {
        setNextQuestionTimer(nextQuestionTime)
    })

    const answerQuestion = (answer) => {
        const player = players.find(p => p.id === getUserId())
        if(typeof player !== 'undefined'){
            fetch(`${process.env.NEXT_PUBLIC_HOST}/api/results/answer`, {
                method: 'post',
                body: JSON.stringify({
                    lobbyId,
                    data: {
                        player: player,
                        question: currentQuestion,
                        answer
                    }
                }),
                headers: { 'Content-Type': 'application/json' }
            })
        }
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
                        <div className={questionStyles.timer}>{nextQuestionTimer}</div>
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