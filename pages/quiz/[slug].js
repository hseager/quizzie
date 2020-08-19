import Layout from '../../components/layout'
import Lobby from '../../components/lobby'
import fetch from 'isomorphic-unfetch'
import useSocket from '../../hooks/useSocket'

export default function Quiz({ quizData, lobbyData }) {

    useSocket('startQuiz', () => {
        console.log('START NOW')
    })

    return (
        <Layout>
            <h1>Lobby</h1>
            <p>Quiz: <strong>{quizData.name}</strong></p>
            <Lobby data={lobbyData} />
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const quizRes = await fetch(`http://localhost:3000/api/quizzes/${context.params.slug}`)
    const quizJson = await quizRes.json()

    const loid = context.query.loid;
    if(!loid)
        context.res.redirect('/quizzes')

    const lobbyRes = await fetch(`http://localhost:3000/api/lobbies/${loid}`)
    const lobbyJson = await lobbyRes.json()

    return {
        props: {
            quizData: quizJson,
            lobbyData: lobbyJson
        }
    }
}
