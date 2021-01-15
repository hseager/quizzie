import Head from 'next/head'
import styles from '../styles/page.module.css'

export default function Layout({children}) {
    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Quizzie - Play a real-time quiz with your friends"
                />
                <title>Quizzie - Play a real-time real-time quiz with your friends</title>
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet" /> 
            </Head>
            <div className={styles.container}>
                {children}
            </div>
        </>
    )
}