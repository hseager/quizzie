import styles from '../styles/emptyPage.module.css'
import Layout from '../components/layout'
import utilityStyles from '../styles/utilities.module.css'

function Error({ statusCode, errorMessage }) {
    return (
        <Layout>
            <div className={`${styles.main} ${utilityStyles.alignCenter}`}>
                {statusCode 
                ? <><h1>{statusCode} - Internal Server Error</h1><p>Sorry, there was an error with the request: {errorMessage}</p></>
                : <h1>Sorry, there was an error</h1>}
            </div>
        </Layout>
    )
  }
  
  Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }
  
  export default Error
  