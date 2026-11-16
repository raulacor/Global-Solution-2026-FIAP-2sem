import { useState } from "react"

export default function StationSelector({onSearch}) {
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")

    function handleSubmit(event) {
      event.preventDefault()
      onSearch(origin , destination)
    }
    return (
      <form onSubmit={handleSubmit}>
        <input value={origin} onChange={(event) => setOrigin(event.target.value)} />
        <input value={destination} onChange={(event) => setDestination(event.target.value)} />
        <button>Send</button>
      </form>
    )
  }