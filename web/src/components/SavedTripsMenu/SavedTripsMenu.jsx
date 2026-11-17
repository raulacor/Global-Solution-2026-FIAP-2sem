import BookmarkIcon from '../icons/BookmarkIcon'

// Right side of the header: opens the saved trips (the list + CRUD comes with useSavedTrips).
// Props: open — whether the menu is showing; onToggle — called on click.
export default function SavedTripsMenu({ open = false, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Viagens salvas"
      aria-expanded={open}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-slate-600
                 bg-slate-900 text-white transition
                 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_14px_rgba(0,240,255,0.55)]
                 focus-visible:outline-none focus-visible:border-[#00f0ff]
                 aria-expanded:border-[#00f0ff] aria-expanded:text-[#00f0ff]"
    >
      <BookmarkIcon />
    </button>
  )
}
