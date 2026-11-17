import { useEffect, useRef, useState } from 'react'
import BookmarkIcon from '../icons/BookmarkIcon'
import SavedTripItem from '../SavedTripItem/SavedTripItem'

// Right side of the header: the bookmark button and, when open, the saved trips (CRUD).
// Props: trips — list from useSavedTrips
//        onOpen(trip) — search a saved trip again; onRename(id, name); onDelete(id)
export default function SavedTripsMenu({ trips = [], onOpen, onRename, onDelete }) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  // Close on a click outside the menu or on Escape.
  useEffect(() => {
    if (!open) return
    function onPointer(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function openTrip(trip) {
    onOpen(trip)
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Viagens salvas"
        aria-expanded={open}
        className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 border-slate-600
                   bg-slate-900 text-white transition
                   hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_14px_rgba(0,240,255,0.55)]
                   focus-visible:outline-none focus-visible:border-[#00f0ff]
                   aria-expanded:border-[#00f0ff] aria-expanded:text-[#00f0ff]"
      >
        <BookmarkIcon />
        {trips.length > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#00f0ff] px-1 text-[11px] font-bold text-slate-950">
            {trips.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-[1200] mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10
                        bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Viagens salvas</p>
          {trips.length === 0 ? (
            <p className="px-1 pb-1 text-sm text-slate-400">
              Nenhuma viagem salva ainda. Busque uma rota e toque em <span className="text-[#00f0ff]">Salvar viagem</span>.
            </p>
          ) : (
            <ul className="max-h-[50vh] space-y-1 overflow-y-auto">
              {trips.map((trip) => (
                <SavedTripItem key={trip.id} trip={trip} onOpen={openTrip} onRename={onRename} onDelete={onDelete} />
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
