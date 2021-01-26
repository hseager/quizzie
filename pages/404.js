import styles from '../styles/emptyPage.module.css'
import Layout from '../components/layout'
import utilityStyles from '../styles/utilities.module.css'
import Link from 'next/link'

export default function Custom404() {
    return (
        <Layout>
            <div className={`${styles.main} ${utilityStyles.alignCenter}`}>
                <h1>404 - Page Not Found</h1>
                <p>The page you were looking for could not be found. Please <Link href="/"><a>click here</a></Link> to get back on track.</p>
            </div>
        </Layout>
    )
}