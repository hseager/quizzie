import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/quizzes.module.css'
import { getUserId } from '../libs/localStorage'
import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import config from '../libs/config'

const ChooseAQuiz = function({ data }) {

    const [userId, setUserId] = useState()
    
    useEffect(() => {
        setUserId(getUserId())
    },[userId])

    return (
        <Layout>
            <div className={styles.section}>
                <Link href={'/'}>
                    <a>Back</a>
                </Link>
                <h1 className={styles.title}>Choose a Quiz</h1>
                <div className={styles.quizList}>
                    {data.map((quiz) => (
                        <div className={styles.quizListItem} key={quiz._id}>
                            <h6 className={styles.quizCategory}>{quiz.category}</h6>
                            <h4 className={styles.quizName}>
                                { /* TODO: Should I be using an onClick here and posting instead? */ }
                                <Link href={`/play/[lobbyId]?q=${quiz._id}`} as={`/play/${userId}?q=${quiz._id}`}>
                                    <a>{quiz.name}</a>
                                </Link>
                            </h4>
                            <p>{quiz.questions.length} Questions</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {

    const res = await fetch(`${config.siteUrl}/api/quizzes`)
    const json = await res.json()

    return {
        props: {
            data: json
        }
    }
}


export default ChooseAQuiz