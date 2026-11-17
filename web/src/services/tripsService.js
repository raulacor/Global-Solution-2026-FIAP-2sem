const API = 'https://6afbccb1892984c4494a5896.mockapi.io/api/v1/trips'

export async function getTrips() {
    const response = await fetch(API)
    const data = await response.json();
    return data
}

export async function createTrip(trip) {
    const response = await fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(trip),
    })
    return response.json()
}