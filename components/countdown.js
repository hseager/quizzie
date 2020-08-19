import { useState, useEffect } from 'react'

export default function Countdown() {

    const [seconds, setSeconds] = useState(30)

    useEffect(() => {
        setTimeout(() => {
            setSeconds(seconds - 1)
        }, 1000)
    }, [seconds])

    return (
        <p>Starting quiz in { seconds } seconds</p>
    )
}