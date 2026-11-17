import { useState, useEffect } from 'react'
import { getTrips } from '../services/tripsService'

export default function useSavedTrips() {
    const [trips, setTrips] = useState([])

    useEffect(() => {
        async function load() {
            const response = await getTrips()
            setTrips(response)

        }
        load()
    }, [])
    return {trips}
}