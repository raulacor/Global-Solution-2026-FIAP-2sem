import useSearch from "./hooks/usePyodide"
import { useState } from "react"

import StationPicker from "./components/StationPicker/StationPicker"
import RouteResult from "./components/RouteResult/RouteResult"
import MetroMap from "./components/MetroMap/MetroMap"
import useLineStatus from "./hooks/useLineStatus"
import LineStatusList from "./components/LineStatusList/LineStatusList"
import Logo from "./components/Logo/Logo"
import SavedTripsMenu from "./components/SavedTripsMenu/SavedTripsMenu"

function App() {
  const { search, parseStatus } = useSearch()
  const [route, setRoute] = useState(null)
  const [message, setMessage] = useState(null)
  const statuses = useLineStatus(parseStatus)

  return (
    <>
    <header className="sticky top-0 z-[1100] flex items-start justify-between gap-5 border-b border-white/10 bg-slate-900/90 px-6 py-3 text-white backdrop-blur-md">
      <Logo onReset={() => { setRoute(null); setMessage(null) }} />
      <div className="relative flex flex-1 flex-col items-center">
        <StationPicker onSearch={(origin, destination) => {
          if (search === null) { setMessage('Carregando o sistema de rotas, aguarde…'); return }
          const result = search === null ? "Acessando sistema de rotas, aguarde..." : search(origin, destination, statuses)
          if (result === undefined) {
            setRoute(null)
            setMessage("Rota indísponivel")
          } else {
            setRoute(result.toJs())
            setMessage(null)
          }}} 
        />
      </div>
      <SavedTripsMenu />
    </header>
    






    <div className="relative mx-auto mt-12 w-[min(1100px,calc(100%-3rem))]">
      <MetroMap route={route} statuses={statuses} className="h-[60vh] min-h-[380px] w-full" />
      {/* Route summary: a narrow side panel on the map's left edge (wide screens),
          below the map on phones. The map frames the route to the right of it. */}
      {message === null && route === null ? null : (
        <aside className={`z-[1050] mt-4 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/90 p-4
                          shadow-2xl backdrop-blur-md sm:absolute sm:left-4 sm:top-4 sm:mt-0 sm:w-80
                          ${route === null ? "" : "sm:bottom-4"}`}>
          {message === null ? null : <p className="text-sm text-amber-300">{message}</p>}
          {route === null ? null : <RouteResult route={route} />}
        </aside>
      )}
    </div>
    <div className="mx-auto mb-12 mt-10 w-[min(1100px,calc(100%-3rem))]">
      <LineStatusList statuses={statuses} />
    </div>
    </>
  )
}

export default App
