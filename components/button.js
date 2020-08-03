import styles from '../styles/buttons.module.css'

export default function Button({ text }) {
    return (
        <button className={styles.button}>{text}</button>
    )
}