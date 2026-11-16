import { useEffect, useMemo, useState } from 'react'
import { fetchNetwork } from '../../services/networkService'
import { buildMap } from '../../lib/mapGeometry'

// Draws the 6 metro lines from real station coordinates.
// Props: route — optional, the [seconds, path] result of search(...).toJs(); its path is drawn dotted on top.
export default function MetroMap({ route = null }) {
  const [network, setNetwork] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNetwork().then(setNetwork).catch((e) => setError(e.message))
  }, [])

  const map = useMemo(() => (network ? buildMap(network) : null), [network])

  if (error) return <p className="text-sm text-red-600">Map unavailable: {error}</p>
  if (!map) return <p className="text-sm text-gray-500">Loading map…</p>

  const path = route ? route[1] : []
  const start = path.length ? map.pointOf(...path[0]) : null
  const end = path.length ? map.pointOf(...path[path.length - 1]) : null

  return (
    <svg
      viewBox={map.viewBox}
      className="w-full h-auto max-h-[70vh] rounded-xl bg-white shadow"
      role="img"
      aria-label="São Paulo metro map"
    >
      {map.lines.map(({ line, color, segments }) =>
        segments.map((s, i) => (
          <line
            key={`${line}-${i}`}
            {...s}
            stroke={color}
            strokeWidth={route ? 4 : 6}
            strokeOpacity={route ? 0.35 : 1}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )),
      )}

      {map.stations.map((s) => (
        <circle
          key={`${s.name}-${s.line}`}
          cx={s.cx}
          cy={s.cy}
          r={160}
          fill="white"
          stroke="#222"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        >
          <title>{`${s.name} (${s.line})`}</title>
        </circle>
      ))}

      {path.length > 1 && (
        <polyline
          points={map.routePoints(path)}
          fill="none"
          stroke="#111"
          strokeWidth={5}
          strokeDasharray="2 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {start && <circle cx={start[0]} cy={start[1]} r={320} fill="#111" />}
      {end && <circle cx={end[0]} cy={end[1]} r={320} fill="white" stroke="#111" strokeWidth={4} vectorEffect="non-scaling-stroke" />}
    </svg>
  )
}
