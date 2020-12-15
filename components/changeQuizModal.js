import styles from '../styles/page.module.css'
import Modal from '../components/modal'
import { useState, useEffect } from 'react'
import { HttpRequestError } from '../libs/HttpRequestError'

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
            <div className={styles.quizList}>
                {quizzes.map(quiz => (
                    <div className={styles.quizListItem} key={quiz._id} onClick={() => { onChangeQuiz(quiz._id) }}>
                        <h6 className={styles.quizCategory}>
                            {quiz.tags.map((tag, i) => (
                                <span key={i}>{tag}{(i + 1 < quiz.tags.length ? ', ' : '')}</span>
                            ))}
                        </h6>
                        <h4 className={styles.quizName}>
                            {quiz.name}
                        </h4>
                        <p>{quiz.questions.length} Questions</p>
                    </div>
                ))}
            </div>
        </Modal>
    )
}