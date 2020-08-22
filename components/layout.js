import Head from 'next/head'
import styles from '../styles/layout.module.css'

export default function Layout({children}) {
    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Quizzie - Live Quiz with your friends"
                />
                <title>Quizzie - Live Quiz with your friends</title>
            </Head>
            <header className={styles.header}>
                <h1 className={styles.title}>Quizzie</h1>
            </header>
            <div className={styles.container}>
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}