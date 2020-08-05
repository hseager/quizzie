import Layout from '../components/layout'
import buttonStyles from '../styles/buttons.module.css'
import formStyles from '../styles/forms.module.css'
import router from 'next/router'
import { useForm } from 'react-hook-form'

export default function CreateQuiz() {

    const { register, handleSubmit, errors } = useForm()

    const onSubmit = handleSubmit(async (formData) => {

        const res = await fetch('api/start-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        if(res.status == 200){
            router.push('quiz')
        } else {
            throw new Error(await res.text())
        }
    })

    return (
        <Layout>
            <h1>Quizzes</h1>
            <form onSubmit={ onSubmit }>
                <div className={formStyles.row}>
                    <label className={formStyles.label}>Type</label>
                    <select name="type" className={formStyles.select} ref={ register }>
                        <option>History</option>
                        <option>Sports</option>
                        <option>General</option>
                    </select>
                </div>
                <div className={formStyles.row}>
                    <label className={formStyles.label}>Your name</label>
                    <input type="text" name="name" className={formStyles.inputText} ref={ register({ required: true }) } />
                    <p>{errors.name && "Please enter your name"}</p>
                </div>
                <button type="submit" className={buttonStyles.button}>Start Quiz</button>
            </form>
        </Layout>
    )
}