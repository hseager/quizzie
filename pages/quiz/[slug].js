import Layout from '../../components/layout'
import config from '../../libs/config'
import buttonStyles from '../../styles/buttons.module.css'
import { getUserId } from '../../libs/localStorage'

export default function Quiz({ quiz }) {

    const createLobby = () => {
        
        // TODO: show loading gif etc
        fetch(`${config.siteUrl}/api/lobbies/create`, {
            method: 'post',
            body: JSON.stringify({ 
                userId: getUserId(),
                quizId: quiz._id
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        .catch(err => { console.log(err) })

    }

    return (
        <Layout>
            <h2>{ quiz.name } Quiz</h2>
            <p>
                Category:
            {
                quiz.category.map( (cat, i) => (
                    <strong key={i}> {cat}</strong>
                ))
            }
            </p>
            <p><strong>{ quiz.questions.length }</strong> Questions</p>
            <button className={buttonStyles.button} onClick={createLobby}>Create Lobby</button>
        </Layout>
    )

}

export async function getServerSideProps(context) {

    const quizRes = await fetch(`${config.siteUrl}/api/quizzes/${context.params.slug}`)
                                .catch((err) => { console.log(err) })
    const quizJson = await quizRes.json()

    return {
        props: {
            quiz: quizJson,
        }
    }
}
