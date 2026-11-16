import { useState } from 'react'
import { statusOf } from '../../lib/lineStatus'

// The key of the map: one row per line, with a tiny sample that moves exactly like the line does.
// Props: lines — from buildMap(); statuses — { LINE: { status, info } } (same shape as ParseStatus);
//        compact — start folded (MetroMap asks for this while a route is on screen, to free the view).
export default function MapLegend({ lines, statuses, compact = false }) {
  const [choice, setChoice] = useState(null) // null until the person folds / unfolds it themselves
  const open = choice ?? !compact

  return (
    <div className="absolute bottom-6 left-3 z-[1000] w-60 max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/10 bg-slate-900/80 text-slate-100 shadow-2xl backdrop-blur-md">
      <button
        type="button"
        onClick={() => setChoice(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300"
      >
        Situação das linhas
        <span className={`transition-transform ${open ? '' : 'rotate-180'}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="space-y-2 px-4 pb-3.5">
          {lines.map((line) => {
            const { kind, text, info } = statusOf(statuses?.[line.line])
            return (
              <li key={line.line} className="flex items-center gap-3" title={info || text}>
                <svg
                  width="46"
                  height="16"
                  viewBox="0 0 46 16"
                  className="shrink-0"
                  style={{ '--w': '5px', '--c': line.color, '--f': line.flow }}
                  aria-hidden="true"
                >
                  {['dl-casing', 'dl-base', 'dl-flow'].map((layer) => (
                    <line key={layer} className={`dl dl-net ${layer}`} data-st={kind} x1="6" y1="8" x2="40" y2="8" />
                  ))}
                </svg>
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-semibold">
                    {line.number} · {line.label}
                  </span>
                  <span className={`block truncate text-xs ${kind === 'normal' ? 'text-slate-400' : 'font-semibold text-amber-300'}`}>
                    {text}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
