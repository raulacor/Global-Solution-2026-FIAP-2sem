import useSearch from "./hooks/usePyodide"
import { useState } from "react"

import StationPicker from "./components/StationPicker/StationPicker"
import RouteResult from "./components/RouteResult/RouteResult"

function App() {
  const search = useSearch()
  const [route, setRoute] = useState(null)
  return (
    <>
    <div className="input-fields">
      <StationPicker onSearch={(origin, destination) => setRoute(search === null ? "loading" : search(origin, destination).toJs())} />
        {route === null ? null : <RouteResult route={route} />}
    </div>
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-2xl font-semibold">GS 2026.2 — CitizenTech</h1>
    </main>
    </>
  )
}

export default App
