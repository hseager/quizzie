import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import { getQuizData } from '../../libs/quizzes.js'

export default function Quiz({ quizData }) {
    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{quizData.name}</strong></p>
            <Lobby />
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const quizData = await getQuizData(context.params.slug)

    return {
        props: {
            quizData,
        }
    }
}
