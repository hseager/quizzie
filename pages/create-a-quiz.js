import Layout from '../components/layout'
import buttonStyles from '../styles/buttons.module.css'
import formStyles from '../styles/forms.module.css'

export default function CreateQuiz() {
    return (
        <Layout>
            <h1>Create a Quiz</h1>
            <form action="/api/create-quiz" method="POST">
                <div className={formStyles.row}>
                    <label className={formStyles.label}>Type</label>
                    <select name="type" className={formStyles.select}>
                        <option>History</option>
                        <option>Sports</option>
                        <option>General</option>
                    </select>
                </div>
                <div className={formStyles.row}>
                    <label className={formStyles.label}>Your name</label>
                    <input type="text" name="name" className={formStyles.inputText} />
                </div>
                <button type="submit" className={buttonStyles.button}>Create Quiz</button>
            </form>
        </Layout>
    )
}