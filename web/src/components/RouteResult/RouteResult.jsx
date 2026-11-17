import groupRoute from "../../lib/groupRoute"
import { LINES, prettyName } from "../../lib/mapGeometry"

// The route as a vertical timeline: total time on top, then one block per line ridden,
// with a bar in the line's color and a dot per station. Between blocks: the transfer.
export default function RouteResult({ route }) {
    const totalSeconds = route[0]
    const mins = Math.floor(totalSeconds / 60)
    const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0")
    const groups = groupRoute(route[1])
    const transfers = groups.length - 1

    return (
        <section className="text-left">
            <header className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Tempo estimado</p>
                    <p className="text-3xl font-bold leading-tight text-white">
                        {mins} <span className="text-lg font-semibold text-slate-300">min</span>
                        <span className="ml-2 text-sm font-normal text-slate-500">({mins}:{seconds})</span>
                    </p>
                </div>
                <p className="text-sm text-slate-400">
                    {transfers === 0 ? "Sem baldeação" : `${transfers} baldeaç${transfers === 1 ? "ão" : "ões"}`}
                </p>
            </header>

            <ol>
                {groups.map((group, l) => {
                    const info = LINES[group.line]
                    return (
                        <li key={l}>
                            {l > 0 && (
                                <p className="my-2 ml-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                                    <span aria-hidden="true">⇄</span> Baldeação em {prettyName(group.lines[0])}
                                </p>
                            )}
                            <div className="mb-2 flex items-center gap-2">
                                <span
                                    className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white shadow"
                                    style={{ backgroundColor: info?.color }}
                                >
                                    {info?.number}
                                </span>
                                <span className="font-semibold text-slate-100">Linha {info?.number} · {info?.label ?? group.line}</span>
                            </div>
                            <ul className="ml-[11px] border-l-4 pl-4" style={{ borderColor: info?.color }}>
                                {group.lines.map((station, j) => {
                                    const isEdge = j === 0 || j === group.lines.length - 1
                                    return (
                                        <li key={j} className="relative py-1 text-sm">
                                            <span
                                                className={`absolute top-1/2 -translate-y-1/2 rounded-full border-2 bg-slate-900 ${isEdge ? "-left-[25px] h-3.5 w-3.5" : "-left-[23px] h-2.5 w-2.5"}`}
                                                style={{ borderColor: info?.color }}
                                                aria-hidden="true"
                                            />
                                            <span className={isEdge ? "font-semibold text-white" : "text-slate-300"}>
                                                {prettyName(station)}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}
