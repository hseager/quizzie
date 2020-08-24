import '../styles/globals.css'
import { useEffect } from 'react'
import { setUserId } from '../libs/localStorage'

function MyApp({ Component, pageProps }) {

    useEffect(() => {
        setUserId()
    },[])

    return <Component {...pageProps} />
}

export default MyApp
