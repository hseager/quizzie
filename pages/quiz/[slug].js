import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import fetch from 'isomorphic-unfetch'

export default function Quiz({ data }) {
    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{data.name}</strong></p>
            <Lobby />
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const res = await fetch(`http://localhost:3000/api/quizzes/${context.params.slug}`)
    const json = await res.json()

    return {
        props: {
            data: json
        }
    }
}
