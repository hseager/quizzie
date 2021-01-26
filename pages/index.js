import buttonStyles from '../styles/buttons.module.css'
import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/page.module.css'
import utilityStyles from '../styles/utilities.module.css'

export default function Home() {
    return (
        <Layout>
            <div className={`${styles.section} ${utilityStyles.alignCenter}`}>
                <h1>Quizzie</h1>
                <p>Play a quiz in real-time with your friends and family!</p>
            </div>
            <div className={`${styles.section} ${utilityStyles.alignCenter}`}>
                <Link href="/choose-a-quiz">
                    <a className={buttonStyles.button}>Start a new Quiz</a>
                </Link>
            </div>
            <div className={styles.features}>
                <div className={styles.feature}>
                    <h3 className={styles.featureTitle}>Step 1. Choose a quiz</h3>
                </div>
                <div className={styles.feature}>
                    <h3 className={styles.featureTitle}>Step 2. Invite your friends</h3>
                </div>
                <div className={styles.feature}>
                    <h3 className={styles.featureTitle}>Step 3. Play the quiz in real-time</h3>
                </div>
            </div>
            <div className={`${styles.section} ${utilityStyles.alignCenter}`}>
                <h2>Quizzie is still under development</h2>
                <p>We are still adding features and fixing bugs so please come back soon to see our progress.</p>
                <p>Some of our planned features include <strong>User Accounts</strong>, <strong>Private Quizzes</strong> and <strong>New Quiz Modes</strong> so stay tuned!</p>
            </div>
        </Layout>
    )
}
