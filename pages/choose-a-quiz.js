import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/page.module.css'
import fetch from 'isomorphic-unfetch'
import ErrorPage from 'next/error'
import { HttpRequestError } from '../libs/HttpRequestError'
import QuizImage from '../components/quizImage'

const ChooseAQuiz = function({ data, statusCode }) {

    if(statusCode !== 200)
        return (<ErrorPage statusCode={statusCode} />)

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
                            <QuizImage src={quiz.image} width={350} height={220} />
                            <h6 className={styles.quizCategory}>
                                {quiz.tags.map((tag, i) => (
                                    <span key={i}>{tag}{(i + 1 < quiz.tags.length ? ', ' : '')}</span>
                                ))}
                            </h6>
                            <h4 className={styles.quizName}>
                                <Link href={`/quiz/[slug]`} as={`/quiz/${quiz.slug}`}>
                                    <a>{quiz.title}</a>
                                </Link>
                            </h4>
                            <p>{quiz.questions.length} Questions</p>
                            <p>Difficulty: {quiz.difficulty}</p>
                            <strong><small>By {quiz.author}</small></strong>
                        </div>
                    ))}
                </div>
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