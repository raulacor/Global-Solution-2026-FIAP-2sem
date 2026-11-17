import { useState, useEffect } from 'react'
import { getTrips, createTrip } from '../services/tripsService'


export default function useSavedTrips() {
    const [trips, setTrips] = useState([])

    useEffect(() => {
        async function load() {
            const response = await getTrips()
            setTrips(response)

        }
        load()
    }, [])

    async function addTrip(trip) {
        const isSaved = await createTrip(trip)
        setTrips([...trips, isSaved])
    }
    return {trips, addTrip}
}

