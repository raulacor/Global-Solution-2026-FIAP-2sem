// Pure geometry for the metro map: turns network.json (UTM meters, EPSG:31983) into SVG shapes.
// No React here — MetroMap only draws what this returns.

// Official line colors (Metrô SP visual identity).
export const LINE_COLORS = {
  AZUL: '#0455A1',
  VERDE: '#007E5E',
  VERMELHA: '#EE372F',
  AMARELA: '#F4C300',
  LILAS: '#9B3894',
  PRATA: '#9E9E9E',
}

const PADDING = 900 // meters of empty border around the network

// UTM y grows to the north, SVG y grows downwards → flip it.
function project(x, y, bounds) {
  return [x - bounds.minX + PADDING, bounds.maxY - y + PADDING]
}

export function buildMap(network) {
  const all = Object.values(network.stations).flat()
  const bounds = {
    minX: Math.min(...all.map((s) => s.x)),
    maxX: Math.max(...all.map((s) => s.x)),
    minY: Math.min(...all.map((s) => s.y)),
    maxY: Math.max(...all.map((s) => s.y)),
  }

  // (station, line) → [cx, cy], the same node key the Python graph uses.
  const points = new Map()
  const stations = all.map((s) => {
    const [cx, cy] = project(s.x, s.y, bounds)
    points.set(`${s.name}|${s.line}`, [cx, cy])
    return { name: s.name, line: s.line, cx, cy }
  })

  const lines = Object.entries(network.neighbors).map(([line, pairs]) => ({
    line,
    color: LINE_COLORS[line] ?? '#333',
    segments: pairs.map((p) => {
      const [x1, y1] = points.get(`${p.station}|${line}`)
      const [x2, y2] = points.get(`${p.next_station}|${line}`)
      return { x1, y1, x2, y2 }
    }),
  }))

  return {
    viewBox: `0 0 ${bounds.maxX - bounds.minX + 2 * PADDING} ${bounds.maxY - bounds.minY + 2 * PADDING}`,
    lines,
    stations,
    // path = [[station, line], ...] from search(...).toJs()[1] → "x,y x,y ..." for a <polyline>
    routePoints(path) {
      return path
        .map(([name, line]) => points.get(`${name}|${line}`))
        .filter(Boolean)
        .map(([x, y]) => `${x},${y}`)
        .join(' ')
    },
    pointOf(name, line) {
      return points.get(`${name}|${line}`)
    },
  }
}
