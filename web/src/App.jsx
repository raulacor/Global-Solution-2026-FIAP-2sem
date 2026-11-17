import useSearch from "./hooks/usePyodide"
import { useState } from "react"

import StationPicker from "./components/StationPicker/StationPicker"
import RouteResult from "./components/RouteResult/RouteResult"
import MetroMap from "./components/MetroMap/MetroMap"
import useLineStatus from "./hooks/useLineStatus"
import LineStatusList from "./components/LineStatusList/LineStatusList"
import Logo from "./components/Logo/Logo"
import SavedTripsMenu from "./components/SavedTripsMenu/SavedTripsMenu"
import useSavedTrips from "./hooks/useSavedTrips"

function App() {
  const { search, parseStatus } = useSearch()
  const [route, setRoute] = useState(null)
  const [message, setMessage] = useState(null)
  const statuses = useLineStatus(parseStatus)
  const { trips, addTrip, renameTrip, deleteTrip } = useSavedTrips()

  // Is the route on screen already saved? (same origin and destination → don't save it twice)
  const path = route === null ? [] : route[1]
  const routeIsSaved = path.length > 0 && trips.some((trip) =>
    trip.origin === path[0][0] && trip.destination === path[path.length - 1][0])

  // One search, used by the fields and by the saved trips menu.
  function runSearch(origin, destination) {
    if (search === null) { setMessage('Carregando o sistema de rotas, aguarde…'); return }
    const result = search(origin, destination, statuses)
    if (result === undefined) {
      setRoute(null)
      setMessage("Rota indisponível")
    } else {
      setRoute(result.toJs())
      setMessage(null)
    }
  }

  return (
    <>
    <header className="sticky top-0 z-[1100] flex items-start justify-between gap-5 border-b border-white/10 bg-slate-900/90 px-6 py-3 text-white backdrop-blur-md">
      <Logo onReset={() => { setRoute(null); setMessage(null) }} />
      <div className="relative flex flex-1 flex-col items-center">
        <StationPicker onSearch={runSearch} />
      </div>
      <SavedTripsMenu
        trips={trips}
        onOpen={(trip) => runSearch(trip.origin, trip.destination)}
        onRename={renameTrip}
        onDelete={deleteTrip}
      />
    </header>
    






    <div className="relative mx-auto mt-12 w-[min(1100px,calc(100%-3rem))]">
      <MetroMap route={route} statuses={statuses} className="h-[60vh] min-h-[380px] w-full" />
      {/* Route summary: a narrow side panel on the map's left edge (wide screens),
          below the map on phones. The map frames the route to the right of it. */}
      {message === null && route === null ? null : (
        <aside className={`z-[1050] mt-4 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/90 p-4
                          shadow-2xl backdrop-blur-md sm:absolute sm:left-4 sm:top-4 sm:mt-0 sm:max-h-[calc(100%-2rem)] sm:w-80`}>
          {message === null ? null : <p className="text-sm text-amber-300">{message}</p>}
          {route === null ? null : <RouteResult route={route} onSave={addTrip} saved={routeIsSaved} />}
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
