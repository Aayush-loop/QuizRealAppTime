
import { useEffect, useState } from "react"

export default function TimerDisplay() {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (totalSeconds) => {
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
        const secs = String(totalSeconds % 60).padStart(2, "0")
        return `${mins}:${secs}`
    }

    return <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">{formatTime(seconds)}</div>
}