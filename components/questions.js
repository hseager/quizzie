import useSocket from '../hooks/useSocket'
import { useState } from 'react'
import questionStyles from '../styles/questions.module.css'
import { getPlayerId } from '../libs/localStorage'
import Image from 'next/image'

export default function Questions({ quiz, lobbyId, lobbyCurrentQuestion, quizCount }) {

    const [currentQuestion, setCurrentQuestion] = useState(lobbyCurrentQuestion)
    const [nextQuestionTimer, setNextQuestionTimer] = useState()
    const [disableAnswers, setDisableAnswers] = useState(false)
    const answerLetters = ['A','B','C','D']

    useSocket('changeQuestion', newQuestion => {
        setCurrentQuestion(newQuestion)
        setDisableAnswers(false)
    })

    useSocket('nextQuestionTimer', nextQuestionTime => {
        setNextQuestionTimer(nextQuestionTime)
    })

    const answerQuestion = (answer) => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/results/answer`, {
            method: 'post',
            body: JSON.stringify({
                lobbyId,
                quizId: quiz._id,
                quizCount,
                playerId: getPlayerId(),
                question: currentQuestion,
                answer
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        setDisableAnswers(true)
    }

    return (
        <div className={questionStyles.main}>
            {
                typeof quiz.questions[currentQuestion] !== 'undefined' &&
                <div className={questionStyles.questionPanel}>
                    <div className={questionStyles.questionHeader}>
                        <p>
                            Question <strong>{currentQuestion + 1}</strong> of <strong>{quiz.questions.length}</strong>
                        </p>
                        {
                            nextQuestionTimer &&
                            <div className={questionStyles.timer}>{nextQuestionTimer}</div>
                        }
                        <h2>{ quiz.questions[currentQuestion].question }</h2>
                    </div>
                    {
                        quiz.questions[currentQuestion].image &&
                        <div className={questionStyles.image}>
                            <Image src={quiz.questions[currentQuestion].image} layout="fill" objectFit="contain" />
                        </div>
                    }
                    {/*
                    <ul className={questionStyles.answers}>
                        {
                            quiz.questions[currentQuestion].answers.map((answer, i) => (
                                <li 
                                    key={i}
                                    className={questionStyles.answer}
                                >
                                    <span className={questionStyles.answerLetter}>{answerLetters[i]}</span>
                                    <span className={questionStyles.answerText}>{answer}</span>
                                </li>
                            ))
                        }
                    </ul>
                    */}
                    <div className={questionStyles.answerButtons}>
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
        </div>
    )
}