import { LINES } from '../../lib/mapGeometry'
import { statusOf } from '../../lib/lineStatus'

// One stretch of the status "metro line": a bar in the line's color with 3 station nodes,
// and the line's situation written under it. LineStatusList puts the 6 stretches side by side,
// so together they read as one continuous line with 18 nodes.
// Nodes sit at 1/6, 1/2 and 5/6 of the stretch, so the gap between nodes is the same
// inside a stretch and across two stretches.
const NODES = ['left-[16.667%]', 'left-1/2', 'left-[83.333%]']

// How the bar and the text change with the situation.
const LOOK = {
  normal: { bar: '', text: 'text-emerald-300' },
  reduced: { bar: 'dashed', text: 'text-amber-300' },
  partial: { bar: 'dashed', text: 'text-amber-300' },
  stopped: { bar: 'faded', text: 'text-red-300' },
  closed: { bar: 'faded', text: 'text-slate-400' },
  unknown: { bar: '', text: 'text-slate-400' },
}

function barStyle(color, kind) {
  if (kind === 'dashed') {
    // Line color with gaps: trains running, but slower / not everywhere.
    return { backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 14px, transparent 14px 22px)` }
  }
  if (kind === 'faded') return { backgroundColor: color, opacity: 0.25 }
  return { backgroundColor: color }
}

export default function LineStatusBadge({ line, status }) {
  const info = LINES[line]
  const { kind, text, info: details } = statusOf(status)
  const look = LOOK[kind] ?? LOOK.unknown
  const stopped = look.bar === 'faded'

  return (
    <li className="group relative px-2 pt-9 text-center" title={details || text}>
      <span
        className="absolute left-0 right-0 top-3 h-1.5 group-first:rounded-l-full group-last:rounded-r-full"
        style={barStyle(info?.color, look.bar)}
        aria-hidden="true"
      />
      {NODES.map((position) => (
        <span
          key={position}
          className={`absolute top-3 h-4 w-4 -translate-x-1/2 -translate-y-[5px] rounded-full border-[3px] bg-slate-950 ${position}`}
          style={{ borderColor: stopped ? '#f87171' : info?.color }}
          aria-hidden="true"
        />
      ))}

      <p className="text-sm font-semibold text-slate-100">
        <span className="mr-1 text-xs font-bold" style={{ color: info?.color }}>{info?.number}</span>
        {info?.label ?? line}
      </p>
      <p className={`text-xs font-semibold ${look.text}`}>{text}</p>
      {details && details !== text ? (
        <p className="mx-auto mt-1 line-clamp-2 max-w-[22ch] text-[11px] leading-snug text-slate-500">{details}</p>
      ) : null}
    </li>
  )
}
