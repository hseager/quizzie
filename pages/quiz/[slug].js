import Layout from '../../components/layout'
import { getPlayerId } from '../../libs/localStorage'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'
import { useState } from 'react'
import styles from '../../styles/page.module.css'
import quizStyles from '../../styles/quiz.module.css'
import buttonStyles from '../../styles/buttons.module.css'
import ErrorPage from 'next/error'
import { HttpRequestError } from '../../libs/HttpRequestError'
import QuizImage from '../../components/quizImage'
import Link from 'next/link'

export default function Quiz({ quiz, statusCode }) {

    if(statusCode !== 200)
        return (<ErrorPage statusCode={statusCode} />)

    const [loading, setLoading] = useState(false)

    const createLobby = () => {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies`, {
            method: 'post',
            body: JSON.stringify({ 
                playerId: getPlayerId(),
                quizId: quiz._id
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(res => Router.push(`/lobby/${res.lobbyId}`))
        .catch(err => console.log(`Error creating lobby: ${err}`))
    }

    return (
        <Layout>
            <div className={styles.main}>
                { loading &&
                    <h2>Creating a new lobby...</h2>
                }
                { !loading &&
                    <>
                        <div className={quizStyles.panel}>
                            <QuizImage src={quiz.image} width={600} height={345} />
                            <div className={quizStyles.content}>
                                <h2>{ quiz.title }</h2>
                                <div className={quizStyles.tags}>
                                    {quiz.tags.map((tag, i) => (
                                        <span key={i} className={quizStyles.tag}>{tag}</span>
                                    ))}
                                </div>
                                <p className={quizStyles.details}><strong>{quiz.questions.length}</strong> Questions</p>
                                <p className={quizStyles.details}>Difficulty: <strong>{quiz.difficulty}</strong></p>
                                <p className={quizStyles.details}>Created by <strong>{quiz.author}</strong></p>
                                <button className={buttonStyles.button} onClick={createLobby}>Play Quiz</button>
                            </div>
                        </div>
                        <Link href="/choose-a-quiz">
                            <a className={buttonStyles.button2}>Back</a>
                        </Link>
                    </>
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    try{
        const quizRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes/slug/${context.params.slug}`)
        .then(res => res.json())
        .catch(err => { throw new HttpRequestError(500, err) })

        if(!quizRequest)
            throw new HttpRequestError(500, 'Error retrieving quiz')

        if(quizRequest.status !== 200)
            throw new HttpRequestError(quizRequest.status, quizRequest.message)

        return {
            props: {
                quiz: quizRequest.data ? quizRequest.data : null,
                statusCode: 200
            }
        }
    } catch(err) {
        console.log(`HttpRequestError: ${err.status} - ${err.message}`)
        return { props: { statusCode: err.status } }
    }
}
