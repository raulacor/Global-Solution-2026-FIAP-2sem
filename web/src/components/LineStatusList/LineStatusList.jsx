import { LINE_COLORS } from '../../lib/mapGeometry'
import LineStatusBadge from '../LineStatusBadge/LineStatusBadge'

// The 6 lines drawn as one continuous metro line (3 nodes each = 18 nodes).
// Wide screens: one row. Smaller screens: 2 rows of 3 (phones: 3 rows of 2).
export default function LineStatusList({ statuses }) {
    return (
        <section aria-labelledby="line-status-title">
            <h2 id="line-status-title" className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Situação das linhas {statuses === null ? <span className="normal-case tracking-normal">· carregando…</span> : null}
            </h2>
            <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {Object.keys(LINE_COLORS).map((line) => (
                    <LineStatusBadge key={line} line={line} status={statuses?.[line]} />
                ))}
            </ul>
        </section>
    )
}
