import styles from '../styles/quiz.module.css'
import QuizImage from '../components/quizImage'
import LoadingAnimation from '../components/loadingAnimation'
import { useState } from 'react'

export default function QuizCard({quiz, click, showLoader}) {

    const [loading, setLoading] = useState(false)

    const cardClass = function (){
        if(typeof click !== 'undefined')
            return styles.clickableCard
        else
            return styles.card
    }

    const clickEvent = () => {
        let callBack = () => setLoading(false)
        if(showLoader) setLoading(true)
        click(callBack)
    }

    return (
        <div className={cardClass()} onClick={clickEvent}>
            { loading && <LoadingAnimation /> }
            {
                !loading &&
                <>
                    <QuizImage src={quiz.image} width={365} height={210} />
                    <div className={styles.cardContent}>
                        <h4 className={styles.title}>{quiz.title}</h4>
                        <div className={styles.tags}>
                            {quiz.tags.map((tag, i) => (
                                <span key={i} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                        <p className={styles.info}><strong>{quiz.difficulty}</strong></p>
                        <p className={styles.info}><strong>{quiz.questions.length}</strong> Questions</p>
                    </div>
                </>
            }
        </div>
    )
}