import { useState, useEffect } from 'react'

export default function useLineStatus(parseStatus) {
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (parseStatus === null) return
        async function load() {
            const response = await fetch('/api/status')
            const data = await response.text()
            setStatus(parseStatus(data).toJs({ dict_converter: Object.fromEntries }))

        }
        load()
    }, [parseStatus])
    return status

}