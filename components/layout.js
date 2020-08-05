import Head from 'next/head'
import styles from '../styles/layout.module.css'

export default function Layout({children}) {
    return (
        <div className={styles.container}>
            <Head>
                <meta
                    name="description"
                    content="Quizzie - Live Quiz with your friends"
                />
                <title>Quizzie - Live Quiz with your friends</title>
            </Head>
            <main>
                {children}
            </main>
        </div>
    )
}