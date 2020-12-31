import Layout from '../../components/layout'
import styles from '../../styles/page.module.css'
import formStyles from '../../styles/forms.module.css'
import buttonStyles from '../../styles/buttons.module.css'
import ErrorPage from 'next/error'
import { HttpRequestError } from '../../libs/HttpRequestError'
import { useState } from 'react'
import Router from 'next/router'

const CreateQuiz = function({ tags, statusCode }) {

    if(statusCode !== 200)
        return (<ErrorPage statusCode={statusCode} />)

    const [questionCount, setQuestionCount] = useState(2)
    const maxQuestions = 50

    const addQuestion = () => {
        if(questionCount >= maxQuestions) return
        setQuestionCount(questionCount + 1)
    }

    const removeQuestion = () => {
        if(questionCount <= 1) return
        setQuestionCount(questionCount - 1)
    }

    const questions = () => {
        return Array.from({ length: questionCount }, (item, index) =>
            {
                const questionNumber = index + 1
                {
                    return <div key={index}>
                        <hr />
                        <div className={formStyles.formRow}>
                            <label>Question {questionNumber}</label>
                            <input type="text" name={`question-${questionNumber}`} placeholder="Question" className={formStyles.longField} required />
                            <br/>
                            <input type="text" name={`question-${questionNumber}-answer-1`} placeholder="Correct Answer" className={formStyles.shortField} required />
                            <input type="text" name={`question-${questionNumber}-answer-2`} placeholder="Other Answer 1" className={formStyles.shortField} required />
                            <input type="text" name={`question-${questionNumber}-answer-3`} placeholder="Other Answer 2" className={formStyles.shortField} required />
                            <input type="text" name={`question-${questionNumber}-answer-4`} placeholder="Other Answer 3" className={formStyles.shortField} required />
                        </div>
                    </div>
                }
            }
        )
    }

    const createQuiz = (e) => {

        const form = e.target
        const formData = new FormData(form)

        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes`, {
            method: 'post',
            body: formData,
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 200)
                Router.push('/choose-a-quiz')
            else 
                throw `${res.status}: ${res.message}`
        })
        .catch(err => console.log(`Error creating quiz: ${err}`))

        e.preventDefault()
    }

    return (
        <Layout>
            <div className={styles.main}>
                <h1>Create a Quiz</h1>
                <form id="createQuizForm" onSubmit={(e) => createQuiz(e)}>
                    <div className={formStyles.formRow}>
                        <input type="text" name="title" placeholder="Title" required />
                    </div>
                    <div className={formStyles.formRow}>
                        <input type="text" name="author" placeholder="Author" required />
                    </div>
                    <div className={formStyles.formRow}>
                        <label>Type</label>
                        <select name="type">
                            <option default>Multi-choice (4 answers)</option>
                        </select>
                    </div>
                    <div className={formStyles.formRow}>
                        <label>Difficulty</label>
                        <input type="number" name="difficulty" min="1" max="5" required />
                    </div>
                    <div className={formStyles.formRow}>
                        <label>Image</label>
                        <input type="file" name="image" />
                    </div>
                    {
                        tags &&
                        <div className={formStyles.formRow}>
                            <label>Category Tags</label>
                            <div className={formStyles.tags}>
                                {
                                    tags.map((tag, index) => (
                                        <div className={formStyles.tag} key={index}>
                                            <input type="checkbox" id={tag.name} name="tags" value={tag.name} /><label htmlFor={tag.name}>{tag.name}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                    { questions() }
                    <button className={buttonStyles.button} onClick={addQuestion} type="button">Add Question</button>
                    <button className={buttonStyles.button} onClick={removeQuestion} type="button">Remove Question</button>
                    <hr />
                    <button className={buttonStyles.button} type="submit">Create Quiz</button>                    
                </form>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    try{
        const tagRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tags`)
        .then(res => res.json())
        .catch(err => { throw new HttpRequestError(500, err) })

        if(!tagRequest)
            throw new HttpRequestError(500, 'Error retrieving tags')

        return {
            props: {
                tags: tagRequest.data ? tagRequest.data : null,
                statusCode: 200
            }
        }
    } catch(err){
        console.log(`HttpRequestError: ${err.status} - ${err.message}`)
        return { props: { statusCode: err.status } }
    }
}

export default CreateQuiz