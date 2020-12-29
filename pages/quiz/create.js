import Layout from '../../components/layout'
import styles from '../../styles/page.module.css'
import formStyles from '../../styles/forms.module.css'
import buttonStyles from '../../styles/buttons.module.css'
import ErrorPage from 'next/error'
import { HttpRequestError } from '../../libs/HttpRequestError'
import { useState } from 'react'

const CreateQuiz = function({ tags, statusCode }) {

	if(statusCode !== 200)
		return (<ErrorPage statusCode={statusCode} />)

	const [questionCount, setQuestionCount] = useState(5)
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
							<input type="text" name={`question-${questionNumber}`} placeholder="Question" className={formStyles.longField} />
							<br/>
							<input type="text" name={`question-${questionNumber}-answer-1`} placeholder="Correct Answer" className={formStyles.shortField} />
							<input type="text" name={`question-${questionNumber}-answer-2`} placeholder="Other Answer 1" className={formStyles.shortField} />
							<input type="text" name={`question-${questionNumber}-answer-3`} placeholder="Other Answer 2" className={formStyles.shortField} />
							<input type="text" name={`question-${questionNumber}-answer-4`} placeholder="Other Answer 3" className={formStyles.shortField} />
						</div>
					</div>
				}
			}
		)
	}

    function formatQuizData(formData){
        let quizData = {}
        formData.forEach((value, key) => {
            // If key already exists
            if(Object.prototype.hasOwnProperty.call(quizData, key)) {
                let multiField = quizData[key]
                if(!Array.isArray(multiField)){
                    multiField = quizData[key] = [multiField]
                }
                multiField.push(value)
            } else {
                quizData[key] = value
            }
        })
        return JSON.stringify(quizData)
    }

	const createQuiz = () => {
		const form = document.getElementById("createQuizForm")
        const formData = new FormData(form)
        
		fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quizzes`, {
			method: 'post',
			body: formatQuizData(formData),
			headers: { 'Content-Type': 'application/json' }
		})
        .catch(err => console.log(`Error creating quiz: ${err}`))
	}

	return (
		<Layout>
			<div className={styles.section}>
				<h1>Create a Quiz</h1>
                <form id="createQuizForm">
                    <div className={formStyles.formRow}>
                        <input type="text" name="title" placeholder="Title" />
                    </div>
                    <div className={formStyles.formRow}>
                        <input type="text" name="author" placeholder="Author" />
                    </div>
                    <div className={formStyles.formRow}>
                        <label>Type</label>
                        <select name="type">
                            <option default>Multi-choice (4 answers)</option>
                        </select>
                    </div>
                    <div className={formStyles.formRow}>
                        <label>Difficulty</label>
                        <input type="number" name="difficulty" min="1" max="5" />
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
                    <button className={buttonStyles.button} onClick={createQuiz} type="button">Create Quiz</button>                    
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