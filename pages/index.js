import styles from '../styles/home.module.css'
import buttonStyles from '../styles/buttons.module.css'
import Layout from '../components/layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <h1>Quizzie</h1>
      <div className={styles.content}>
        <Link href="/create-a-quiz">
          <a className={buttonStyles.button}>Create a new Quiz</a>
        </Link>
      </div>
      <div className={styles.content}>
        <Link href="/join-a-quiz">
          <a className={buttonStyles.button}>Join a Quiz</a>
        </Link>
      </div>
    </Layout>
  )
}
