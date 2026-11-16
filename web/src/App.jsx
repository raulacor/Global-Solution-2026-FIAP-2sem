import useSearch from "./hooks/usePyodide"
import { useState } from "react"

import StationPicker from "./components/StationPicker/StationPicker"
import RouteResult from "./components/RouteResult/RouteResult"
import MetroMap from "./components/MetroMap/MetroMap"
import useLineStatus from "./hooks/useLineStatus"

function App() {
  const { search, parseStatus } = useSearch()
  const [route, setRoute] = useState(null)
  const [message, setMessage] = useState(null)
  const statuses = useLineStatus(parseStatus)

  return (
    <>
    <div className="input-fields">
      <StationPicker onSearch={(origin, destination, statuses) => {
        const result = search === null ? "Acessando sistema de rotas, aguarde..." : search(origin, destination, statuses)
        if (result === undefined) {
          setRoute(null)
          setMessage("Rota indísponivel")
        } else {
          setRoute(result)
          setMessage(null)
        }}} 
      />
      {message === null ? null : <p>{message}</p>}
      {route === null ? null : <RouteResult route={route} />}
       
    </div>
    <div>
      <MetroMap route={route} statuses={statuses}/>
    </div>
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-2xl font-semibold">GS 2026.2 — CitizenTech</h1>
    </main>
    </>
  )
}

export default App
