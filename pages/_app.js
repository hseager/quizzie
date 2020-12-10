import '../styles/globals.css'
import { useEffect } from 'react'
import { setPlayerId } from '../libs/localStorage'

function MyApp({ Component, pageProps }) {

    useEffect(() => {
        setPlayerId()
    },[])

    return <Component {...pageProps} />
}

export default MyApp
