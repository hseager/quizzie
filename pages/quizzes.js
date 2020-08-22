import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/quizzes.module.css'
import { getUserId } from '../libs/localStorage'
import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'

const Quizzes = function({ data }) {

    const [userId, setUserId] = useState()
    
    useEffect(() => {
        setUserId(getUserId())
    },[userId])

    return (
        <Layout>
            <div className={styles.section}>
                <h1>Quizzes</h1>
                <div className={styles.quizList}>
                    {data.map((quiz) => (
                        <div className={styles.quizListItem} key={quiz._id}>
                            <h6 className={styles.quizCategory}>{quiz.category}</h6>
                            <h4 className={styles.quizName}>
                                <Link href={`/quiz/[slug]?loid=${userId}`} as={`/quiz/${quiz.slug}?loid=${userId}`}>
                                    <a>{quiz.name}</a>
                                </Link>
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {

    const res = await fetch('http://localhost:3000/api/quizzes')
    const json = await res.json()

    return {
        props: {
            data: json
        }
    }
}


export default Quizzes