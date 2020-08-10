import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/quizzes.module.css'
import { getUserId } from '../libs/localStorage'
import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'

const Quizzes = function({ quizzes }) {

    const [userId, setUserId] = useState()
    
    useEffect(() => {
        setUserId(getUserId())
    },[userId])

    return (
        <Layout>
            <h1>Quizzes</h1>
            <div className={styles.quizList}>
                {quizzes.map((quiz) => (
                    <div className={styles.quizListItem} key={quiz._id}>
                        <h6 className={styles.quizCategory}>{quiz.category}</h6>
                        <h4 className={styles.quizName}>
                            <Link href='/quiz/[slug]' as={`/quiz/${quiz.slug}?lid=${userId}`}>
                                <a>{quiz.name}</a>
                            </Link>
                        </h4>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export async function getStaticProps() {

    const res = await fetch("http://localhost:3000/api/quizzes")
    const json = await res.json()

    return {
        props: {
            quizzes: json
        }
    }
}


export default Quizzes