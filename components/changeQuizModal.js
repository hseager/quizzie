import quizStyles from '../styles/quiz.module.css'
import Modal from '../components/modal'
import { useState, useEffect } from 'react'
import { HttpRequestError } from '../libs/HttpRequestError'
import QuizImage from '../components/quizImage'

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

    const onChangeQuiz = (id) => {
        changeQuiz(id)
        setShowModal(false)
    }

    if(!quizzes) {
        return (
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <p>Loading</p>
            </Modal>
        )
    }

    if(quizzes.error) {
        return (
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <h3>{quizzes.title}</h3>
                <p>{quizzes.message}</p>
            </Modal>
        )
    }
        
    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <h2>Change Quiz</h2>
            <div className={quizStyles.list}>
                {quizzes.map(quiz => (
                    <div className={quizStyles.listItem} key={quiz._id} onClick={() => { onChangeQuiz(quiz._id) }}>
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
                ))}
            </div>
        </Modal>
    )
}