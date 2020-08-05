import Layout from '../components/layout'
import Link from 'next/link'
import { getQuizzes } from '../libs/quizzes'
import styles from '../styles/quizzes.module.css'

export default function Quizzes({ quizzes }) {
    return (
        <Layout>
            <h1>Quizzes</h1>
            <div className={styles.quizList}>
                {quizzes.map((quiz) => (
                    <div className={styles.quizListItem} key={quiz.id}>
                        <h6 className={styles.quizCategory}>{quiz.category}</h6>
                        <h4 className={styles.quizName}>
                            <Link href="/quiz/[id]" as={`/quiz/${quiz.id}`}>
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
    const quizzes = getQuizzes()
    return {
        props: {
            quizzes,
        }
    }
}