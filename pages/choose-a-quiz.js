import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/page.module.css'
import { getUserId } from '../libs/localStorage'
import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'

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
                            <h6 className={styles.quizCategory}>
                                {quiz.tags.map((tag, i) => (
                                    <span>{tag}{(i + 1 < quiz.tags.length ? ', ' : '')}</span>
                                ))}
                            </h6>
                            <h4 className={styles.quizName}>
                                <Link href={`/quiz/[slug]`} as={`/quiz/${quiz.slug}`}>
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes`)
    const json = await res.json()

    return {
        props: {
            data: json
        }
    }
}


export default ChooseAQuiz