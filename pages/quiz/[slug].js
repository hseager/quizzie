import Layout from '../../components/layout'
import buttonStyles from '../../styles/buttons.module.css'
import { getPlayerId } from '../../libs/localStorage'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'
import { useState } from 'react'
import pageStyles from '../../styles/page.module.css'
import ErrorPage from 'next/error'

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
            <div className={pageStyles.fullHeightPage}>
                {   loading &&
                    <h2>Creating a new lobby...</h2>
                }
                {
                    !loading &&
                    <>
                        <h2>{ quiz.name } Quiz</h2>
                        <p>
                            <span>Category: </span>
                        {
                            quiz.tags.map((tag, i) => (
                                <strong key={i}>{tag}{(i + 1 < quiz.tags.length ? ', ' : '')}</strong>
                            ))
                        }
                        </p>
                        <p><strong>{quiz.questions.length}</strong> Questions</p>
                        <button className={buttonStyles.button} onClick={createLobby}>Play Quiz</button>
                    </>
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const quizRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes/slug/${context.params.slug}`)
                            .then(res => res.json())
                            .catch(err => console.log(err))
    
    if(quizRequest.status !== 200)
        return { props: { statusCode: quizRequest.status } }

    return {
        props: {
            quiz: quizRequest.data,
            statusCode: 200
        }
    }
}
