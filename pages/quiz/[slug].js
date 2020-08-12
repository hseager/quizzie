import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import fetch from 'isomorphic-unfetch'

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

    const quizRes = await fetch(`http://localhost:3000/api/quizzes/${context.params.slug}`)
    const quizJson = await quizRes.json()

    return {
        props: {
            quizData: quizJson
        }
    }
}
