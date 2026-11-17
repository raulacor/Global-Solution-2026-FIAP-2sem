import { useState } from "react"
import StationIcon from '../icons/StationIcon'

const FIELD =
  "w-full min-w-0 bg-slate-800/70 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 " +
  "border border-slate-700 outline-none transition " +
  "focus:border-[#00f0ff] focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.15)]"

export default function StationPicker({ onSearch }) {
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")

    function handleSubmit(event) {
      event.preventDefault()
      onSearch(origin, destination)
    }

    return (
      <form onSubmit={handleSubmit} className="relative flex w-full max-w-xl items-center">
        <label className="flex-1">
          <span className="sr-only">Origem</span>
          <input
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder="Origem"
            className={`${FIELD} rounded-l-full pl-5 pr-10`}
          />
        </label>

        
        <button
          aria-label="Buscar rota"
          className="relative z-10 -mx-5 grid h-12 w-12 shrink-0 place-items-center rounded-full
                     border-2 border-slate-600 bg-slate-900 text-white shadow-lg shadow-black/40
                     transition hover:border-[#00f0ff] hover:text-[#00f0ff]
                     hover:shadow-[0_0_14px_rgba(0,240,255,0.55)]
                     focus-visible:outline-none focus-visible:border-[#00f0ff]"
        >
          <StationIcon className="h-4 w-auto transition hover:drop-shadow-[0_0_3px_#00f0ff]" />
        </button>

        <label className="flex-1">
          <span className="sr-only">Destino</span>
          <input
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Destino"
            className={`${FIELD} rounded-r-full pl-10 pr-5`}
          />
        </label>
      </form>
    )
}
