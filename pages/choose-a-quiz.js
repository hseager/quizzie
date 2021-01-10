import Layout from '../components/layout'
import { getPlayerId } from '../libs/localStorage'
import Link from 'next/link'
import styles from '../styles/page.module.css'
import quizStyles from '../styles/quiz.module.css'
import buttonStyles from '../styles/buttons.module.css'
import fetch from 'isomorphic-unfetch'
import ErrorPage from 'next/error'
import { HttpRequestError } from '../libs/HttpRequestError'
import QuizCard from '../components/quizCard'
import Router from 'next/router'

const ChooseAQuiz = function({ data, statusCode }) {

    if(statusCode !== 200)
        return (<ErrorPage statusCode={statusCode} />)

    const createLobby = (quizId, callback) => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies`, {
            method: 'post',
            body: JSON.stringify({ 
                playerId: getPlayerId(),
                quizId
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(res => Router.push(`/lobby/${res.lobbyId}`))
        .catch(err => { 
            callback()
            console.log(`Error creating lobby: ${err}`)
        })
    }        

    return (
        <Layout>
            <div className={styles.main}>
                <h1 className={styles.title}>Choose a Quiz</h1>
                <h4>Recently Added</h4>
                <div className={quizStyles.list}>
                    {data.map((quiz) => (
                        <QuizCard 
                            key={quiz._id}
                            quiz={quiz} 
                            showLoader={true} 
                            click={(callback) => createLobby(quiz._id, callback)} />
                    ))}
                </div>
                <Link href="/">
                    <a className={buttonStyles.button2}>Back</a>
                </Link>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    try{
        const quizRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes`)
        .then(res => res.json())
        .catch(err => { throw new HttpRequestError(500, err) })

        if(!quizRequest)
            throw new HttpRequestError(500, 'Error retrieving quizzes')

        return {
            props: {
                data: quizRequest.data ? quizRequest.data : null,
                statusCode: 200
            }
        }
    } catch(err){
        console.log(`HttpRequestError: ${err.status} - ${err.message}`)
        return { props: { statusCode: err.status } }
    }
}


export default ChooseAQuiz