import styles from '../styles/loader.module.css'

export default function LoadingAnimation() {

    return (
        <div className={styles.loading}>
            <div className={styles.loadingAnimation}><div></div><div></div><div></div></div>
            <div className={styles.loadingText}>Loading</div>
        </div>
    )
}