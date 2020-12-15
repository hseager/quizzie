import styles from '../styles/modal.module.css'
import { useState, useEffect } from 'react'

export default function Modal({showModal, setShowModal, children}) {

    const [show, setShow] = useState(showModal)

    const close = () => {
        setShow(false)
        setShowModal(false)
    }

    useEffect(() => {
        setShow(showModal)
    }, [showModal])

    return (
        <>
            {
                show && 
                <>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <div className={styles.close} onClick={close}>X</div>
                            { children }
                        </div>
                    </div>
                </>
            }
        </>
    )
}