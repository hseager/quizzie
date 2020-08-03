import Head from 'next/head'
import styles from '../styles/layout.module.css'

export default function Layout({children}) {
    return (
        <div className={styles.container}>
            <Head>
                <meta
                    name="description"
                    content="Quizzie - Live Quizz with your friends"
                />
                <title>Quizzie - Live Quizz with your friends</title>
            </Head>
            <header>
                <h2 className={styles.title}>Quizzie</h2>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}