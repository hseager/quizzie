import styles from '../styles/quiz.module.css'
import QuizImage from '../components/quizImage'

export default function QuizCard({quiz, clickable}) {

    const cardClass = function (){
        if(clickable)
            return styles.clickableCard
        else
            return styles.card
    }

    return (
        <div className={cardClass()}>
            <QuizImage src={quiz.image} width={365} height={210} />
            <div className={styles.listItemContent}>
                <h4 className={styles.title}>{quiz.title}</h4>
                <div className={styles.tags}>
                    {quiz.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                </div>
                <p className={styles.info}><strong>{quiz.difficulty}</strong></p>
                <p className={styles.info}><strong>{quiz.questions.length}</strong> Questions</p>
            </div>
        </div>
    )
}