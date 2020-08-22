import styles from '../styles/home.module.css'
import buttonStyles from '../styles/buttons.module.css'
import Layout from '../components/layout'
import Link from 'next/link'

export default function Home() {
    return (
        <Layout>
            <div className={styles.section}>
                <Link href="/quizzes">
                    <a className={buttonStyles.button}>Start a new Quiz</a>
                </Link>
            </div>
            <div className={styles.section}>
                <Link href="/join-a-quiz">
                    <a className={buttonStyles.button}>Join a Quiz</a>
                </Link>
            </div>
            <div className={styles.features}>
                <div className={styles.feature}>
                    <h3>Step 1. Choose a quiz</h3>
                </div>
                <div className={styles.feature}>
                    <h3>Step 2. Invite your friends</h3>
                </div>
                <div className={styles.feature}>
                    <h3>Step 3. Play the realtime quiz</h3>
                </div>
            </div>
            <div className={styles.section}>
                <p>Create an account to save your progress and create your own quizzes</p>
            </div>
        </Layout>
    )
}
