import Head from 'next/head'
import layout from '../styles/layout.module.css'

export default function Layout({children}) {
    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Quizzie - Live Quiz with your friends"
                />
                <title>Quizzie - Live Quiz with your friends</title>
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet" /> 
            </Head>
            <div className={layout.container}>
                {children}
            </div>
        </>
    )
}