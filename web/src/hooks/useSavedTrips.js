import { useState, useEffect } from 'react'
import { getTrips, createTrip, updateTrip, removeTrip } from '../services/tripsService'


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
    
    async function renameTrip(id, newName) { 
        const updated = await updateTrip(id, { name: newName })
        setTrips(trips.map((trip) => (trip.id === id ? updated: trip)))

    }
    
    async function deleteTrip(id) {
        await removeTrip(id)
        setTrips(trips.filter((trip) => trip.id !== id))
        
    }
    
    return {trips, addTrip, renameTrip, deleteTrip}

}

