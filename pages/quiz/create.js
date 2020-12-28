import Layout from '../../components/layout'
import styles from '../../styles/page.module.css'
import formStyles from '../../styles/forms.module.css'
import buttonStyles from '../../styles/buttons.module.css'
import ErrorPage from 'next/error'
import { HttpRequestError } from '../../libs/HttpRequestError'

const CreateQuiz = function() {

    return (
        <Layout>
            <div className={styles.section}>
                <h1>Create a Quiz</h1>
                <div className={formStyles.formRow}>
                    <input type="text" name="title" placeholder="Title" />
                </div>
                <div className={formStyles.formRow}>
                    <input type="text" name="author" placeholder="Author" />
                </div>
                <div className={formStyles.formRow}>
                    <label>Type</label>
                    <select name="category">
                        <option selected default>Multi-choice (4 answers)</option>
                    </select>
                </div>
                <div className={formStyles.formRow}>
                    <label>Category</label>
                    <select name="category">
                        <option>General Knowledge</option>
                        <option>History</option>
                        <option>Entertainment</option>
                    </select>
                </div>
                <div className={formStyles.formRow}>
                    <label>Difficulty</label>
                    <input type="number" name="difficulty" min="1" max="5" />
                </div>
                <hr />
                <div className={formStyles.formRow}>
                    <label>Question 1</label>
                    <input type="text" name="question-1" placeholder="Question" className={formStyles.longField} />
                    <br/>
                    <input type="text" name="question-1-answer-1" placeholder="Answer 1" className={formStyles.shortField} />
                    <input type="text" name="question-1-answer-2" placeholder="Answer 2" className={formStyles.shortField} />
                    <input type="text" name="question-1-answer-3" placeholder="Answer 3" className={formStyles.shortField} />
                    <input type="text" name="question-1-answer-4" placeholder="Answer 4" className={formStyles.shortField} />
                    <button className={buttonStyles.button}>Add Question</button>
                </div>
                <hr />
                <button className={buttonStyles.button}>Create Quiz</button>
            </div>
        </Layout>
    )
}


export default CreateQuiz