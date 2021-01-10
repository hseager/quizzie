import quizStyles from '../styles/quiz.module.css'
import Modal from '../components/modal'
import { useState, useEffect } from 'react'
import { HttpRequestError } from '../libs/HttpRequestError'
import QuizCard from '../components/quizCard'
import LoadingAnimation from '../components/loadingAnimation'

export default function ChangeQuizModal({showModal, setShowModal, changeQuiz}) {

    const [quizzes, setQuizzes] = useState()

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes`)
            .then(res => res.json())
            .then(res => {
                if(res.data)
                    setQuizzes(res.data)
                else
                    throw new HttpRequestError(500, 'Error getting quizzes')
            })
            .catch(err => {
                console.log(err)
                setQuizzes({ error: true, title: 'There was a problem with the request', message: err.message })
            })
    }, [])

    const onChangeQuiz = (quiz) => {
        changeQuiz(quiz)
        setShowModal(false)
    }
        
    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            { !quizzes && <LoadingAnimation /> }
            {
                quizzes && quizzes.error && 
                <>
                    <h3>{quizzes.title}</h3>
                    <p>{quizzes.message}</p>
                </>
            }
            {
                quizzes && !quizzes.error && 
                <>
                    <h2>Change Quiz</h2>
                    <div className={quizStyles.list}>
                        {quizzes.map(quiz => (
                            <QuizCard 
                                key={quiz._id}
                                quiz={quiz} 
                                click={() => onChangeQuiz(quiz)} />
                        ))}
                    </div>
                </>
            }
        </Modal>
    )
}