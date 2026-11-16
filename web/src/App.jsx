import useSearch from "./hooks/usePyodide"
import StationPicker from "./components/StationPicker/StationPicker"
import { useState } from "react"

function App() {
  const search = useSearch()
  const [seconds, setSeconds] = useState(null)
  return (
    <>
    <div className="input-fields">
      <StationPicker onSearch={(origin, destination) => setSeconds(search === null ? "loading" : search(origin, destination).toJs()[0])} />
        <p>{seconds}</p>
    </div>
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-2xl font-semibold">GS 2026.2 — CitizenTech</h1>
    </main>
    </>
  )
}

export default App
