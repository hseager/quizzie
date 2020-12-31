import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/page.module.css'
import quizStyles from '../styles/quiz.module.css'
import fetch from 'isomorphic-unfetch'
import ErrorPage from 'next/error'
import { HttpRequestError } from '../libs/HttpRequestError'
import QuizImage from '../components/quizImage'

const ChooseAQuiz = function({ data, statusCode }) {

    if(statusCode !== 200)
        return (<ErrorPage statusCode={statusCode} />)

    return (
        <Layout>
            <div className={styles.main}>
                <h1 className={styles.title}>Choose a Quiz</h1>
                <h4>Recently Added</h4>
                <div className={quizStyles.list}>
                    {data.map((quiz) => (
                    <Link href={`/quiz/[slug]`} as={`/quiz/${quiz.slug}`}>
                        <div className={quizStyles.listItem} key={quiz._id}>
                            <QuizImage src={quiz.image} width={365} height={210} />
                            <div className={quizStyles.listItemContent}>
                                <h4 className={quizStyles.title}>{quiz.title}</h4>
                                <div className={quizStyles.tags}>
                                    {quiz.tags.map((tag, i) => (
                                        <span key={i} className={quizStyles.tag}>{tag}</span>
                                    ))}
                                </div>
                                <p className={quizStyles.info}><strong>{quiz.difficulty}</strong>, {quiz.questions.length} Questions</p>
                            </div>
                        </div>
                    </Link>
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