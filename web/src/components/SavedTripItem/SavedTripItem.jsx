import { useState } from 'react'
import { prettyName } from '../../lib/mapGeometry'
import { PencilIcon, TrashIcon, CheckIcon, CloseIcon } from '../icons/ActionIcons'

// One saved trip in the menu. Three actions:
//   click the trip  → onOpen(trip): search it again with today's line status
//   pencil → inline field, Enter / check saves (onRename), Esc / ✕ cancels
//   trash  → deletes right away (onDelete)
export default function SavedTripItem({ trip, onOpen, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(trip.name)

  function saveName(event) {
    event.preventDefault()
    const name = draft.trim()
    if (name && name !== trip.name) onRename(trip.id, name)
    setEditing(false)
  }

  function cancelEdit() {
    setDraft(trip.name)
    setEditing(false)
  }

  const iconButton =
    'grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition ' +
    'hover:bg-white/5 hover:text-[#00f0ff] focus-visible:outline-none focus-visible:text-[#00f0ff]'

  if (editing) {
    return (
      <li className="rounded-xl bg-slate-800/70 p-2">
        <form onSubmit={saveName} className="flex items-center gap-1">
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && cancelEdit()}
            aria-label="Novo nome da viagem"
            className="min-w-0 flex-1 rounded-lg border border-[#00f0ff] bg-slate-900 px-3 py-1.5 text-sm text-white outline-none"
          />
          <button type="submit" aria-label="Salvar nome" className={iconButton}><CheckIcon /></button>
          <button type="button" onClick={cancelEdit} aria-label="Cancelar" className={iconButton}><CloseIcon /></button>
        </form>
      </li>
    )
  }

  return (
    <li className="group flex items-center gap-1 rounded-xl transition hover:bg-white/5">
      <button
        type="button"
        onClick={() => onOpen(trip)}
        className="min-w-0 flex-1 cursor-pointer px-3 py-2 text-left focus-visible:outline-none"
        title="Buscar esta viagem com a situação de agora"
      >
        <span className="block truncate text-sm font-semibold text-slate-100 group-hover:text-white">{trip.name}</span>
        <span className="block truncate text-xs text-slate-400">
          {prettyName(trip.origin)} → {prettyName(trip.destination)}
        </span>
      </button>
      <button type="button" onClick={() => setEditing(true)} aria-label={`Renomear ${trip.name}`} className={iconButton}>
        <PencilIcon />
      </button>
      <button type="button" onClick={() => onDelete(trip.id)} aria-label={`Excluir ${trip.name}`} className={iconButton + ' hover:text-red-400'}>
        <TrashIcon />
      </button>
    </li>
  )
}
