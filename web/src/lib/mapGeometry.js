// Pure geometry for the metro map: turns network.json (UTM meters, EPSG:31983) into
// latitude/longitude shapes that can sit on top of a real map of São Paulo.
// No React and no Leaflet here — MetroMap only draws what this returns.

// Official line identity (Metrô SP). `flow` is the color of the moving "train" dashes.
export const LINES = {
  AZUL: { number: 1, label: 'Azul', color: '#0455A1', flow: '#ffffff' },
  VERDE: { number: 2, label: 'Verde', color: '#007E5E', flow: '#ffffff' },
  VERMELHA: { number: 3, label: 'Vermelha', color: '#EE372F', flow: '#ffffff' },
  AMARELA: { number: 4, label: 'Amarela', color: '#F4C300', flow: '#5c4a00' },
  LILAS: { number: 5, label: 'Lilás', color: '#9B3894', flow: '#ffffff' },
  PRATA: { number: 15, label: 'Prata', color: '#8E9AA6', flow: '#ffffff' },
}

export const LINE_COLORS = Object.fromEntries(
  Object.entries(LINES).map(([line, info]) => [line, info.color]),
)

// Background of the map: one dark grey street map without labels (Esri, no API key).
// A single plain image layer, no filters on top — cheap for any browser to draw.
export const BASEMAP = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  maxNativeZoom: 16,
  opacity: 0.68, // lets the blue behind it (MetroMap.css) tint the grey map navy
  attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors',
}

// --- UTM zone 23S (SIRGAS 2000 / GRS80) → latitude, longitude in degrees -----------------
const A = 6378137 // [m] ellipsoid semi-major axis
const F = 1 / 298.257222101 // flattening
const K0 = 0.9996 // UTM scale factor
const LON0 = (-45 * Math.PI) / 180 // central meridian of zone 23
const E2 = F * (2 - F)
const EP2 = E2 / (1 - E2)
const E1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2))

export function utmToLatLng(easting, northing) {
  const x = easting - 500000 // false easting
  const y = northing - 10000000 // false northing (southern hemisphere)

  const mu = y / K0 / (A * (1 - E2 / 4 - (3 * E2 ** 2) / 64 - (5 * E2 ** 3) / 256))
  const phi1 =
    mu +
    ((3 * E1) / 2 - (27 * E1 ** 3) / 32) * Math.sin(2 * mu) +
    ((21 * E1 ** 2) / 16 - (55 * E1 ** 4) / 32) * Math.sin(4 * mu) +
    ((151 * E1 ** 3) / 96) * Math.sin(6 * mu) +
    ((1097 * E1 ** 4) / 512) * Math.sin(8 * mu)

  const sin = Math.sin(phi1)
  const cos = Math.cos(phi1)
  const tan = Math.tan(phi1)
  const n1 = A / Math.sqrt(1 - E2 * sin ** 2)
  const t1 = tan ** 2
  const c1 = EP2 * cos ** 2
  const r1 = (A * (1 - E2)) / (1 - E2 * sin ** 2) ** 1.5
  const d = x / (n1 * K0)

  const lat =
    phi1 -
    ((n1 * tan) / r1) *
      (d ** 2 / 2 -
        ((5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * EP2) * d ** 4) / 24 +
        ((61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * EP2 - 3 * c1 ** 2) * d ** 6) / 720)
  const lng =
    LON0 +
    (d -
      ((1 + 2 * t1 + c1) * d ** 3) / 6 +
      ((5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * EP2 + 24 * t1 ** 2) * d ** 5) / 120) /
      cos

  return [(lat * 180) / Math.PI, (lng * 180) / Math.PI]
}

// --- Names -------------------------------------------------------------------------------
const SMALL_WORDS = new Set(['da', 'de', 'do', 'das', 'dos', 'e'])

// 'PALMEIRAS-BARRA FUNDA' → 'Palmeiras-Barra Funda', 'ALTO DO IPIRANGA' → 'Alto do Ipiranga'
export function prettyName(name) {
  return name
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s-])(\p{L}+)/gu, (match, separator, word) =>
      separator === ' ' && SMALL_WORDS.has(word)
        ? separator + word
        : separator + word[0].toLocaleUpperCase('pt-BR') + word.slice(1),
    )
}

// --- Curves ------------------------------------------------------------------------------
const SAMPLES = 8 // points drawn between two neighboring stations

// Catmull-Rom spline through the stations: the line bends smoothly instead of zig-zagging.
// Returns one piece per pair of neighbors; piece[i] goes from station i to station i + 1.
function smoothPieces(points) {
  const pieces = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(i + 2, points.length - 1)]
    const piece = []
    for (let s = 0; s <= SAMPLES; s++) {
      const t = s / SAMPLES
      piece.push(
        [0, 1].map(
          (k) =>
            0.5 *
            (2 * p1[k] +
              (p2[k] - p0[k]) * t +
              (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t ** 2 +
              (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t ** 3),
        ),
      )
    }
    pieces.push(piece)
  }
  return pieces
}

// Joins pieces into one list of points, without repeating the shared station points.
function joinPieces(pieces) {
  return pieces.flatMap((piece, i) => (i === 0 ? piece : piece.slice(1)))
}

// --- The map model -----------------------------------------------------------------------
export function buildMap(network) {
  const utm = new Map() // 'NAME|LINE' → [x, y] in meters, the same node key the Python graph uses
  const byName = new Map() // 'NAME' → { name, label, lines }

  for (const [line, list] of Object.entries(network.stations)) {
    for (const s of list) {
      utm.set(`${s.name}|${line}`, [s.x, s.y])
      if (!byName.has(s.name)) byName.set(s.name, { name: s.name, label: prettyName(s.name), lines: [] })
      byName.get(s.name).lines.push(line)
    }
  }

  // Shared track: two lines that run between the same two neighboring stations (Azul and Verde,
  // Paraíso ↔ Ana Rosa). There, both lines are moved onto one common center line and then pushed
  // apart sideways, so they are drawn side by side as one merged band instead of one hiding the other.
  // side.get('NAME|LINE') = { center: [x, y], push: [x, y] } — push is "sideways" × the line's slot.
  const linesOfPair = new Map() // 'A|B' (names sorted) → lines that have A and B as neighbors
  for (const [line, pairs] of Object.entries(network.neighbors)) {
    for (const p of pairs) {
      const key = [p.station, p.next_station].sort().join('|')
      linesOfPair.set(key, [...(linesOfPair.get(key) ?? []), line])
    }
  }
  const side = new Map()
  for (const [key, shared] of linesOfPair) {
    if (shared.length < 2) continue
    const [a, b] = key.split('|')
    const middle = (name) =>
      [0, 1].map((k) => shared.reduce((sum, line) => sum + utm.get(`${name}|${line}`)[k], 0) / shared.length)
    const [pa, pb] = [middle(a), middle(b)]
    const length = Math.hypot(pb[0] - pa[0], pb[1] - pa[1])
    const sideways = [-(pb[1] - pa[1]) / length, (pb[0] - pa[0]) / length]
    shared
      .sort((l1, l2) => (LINES[l1]?.number ?? 0) - (LINES[l2]?.number ?? 0))
      .forEach((line, i) => {
        const slot = i - (shared.length - 1) / 2 // two lines → -0.5 and +0.5
        side.set(`${a}|${line}`, { center: pa, push: sideways.map((v) => v * slot) })
        side.set(`${b}|${line}`, { center: pb, push: sideways.map((v) => v * slot) })
      })
  }

  // Where a station of a line is drawn. spread = meters between the centers of two merged lines
  // (0 → exactly on top of each other, which is what the route and the station names use).
  function place(key, spread = 0) {
    const s = side.get(key)
    const [x, y] = s ? [s.center[0] + s.push[0] * spread, s.center[1] + s.push[1] * spread] : utm.get(key)
    return utmToLatLng(x, y)
  }

  const nodes = new Map([...utm.keys()].map((key) => [key, place(key)]))
  for (const station of byName.values()) {
    station.points = station.lines.map((line) => nodes.get(`${station.name}|${line}`))
  }

  // Each line is one chain of stations: first station, then every next_station.
  const chains = {}
  const lines = Object.entries(network.neighbors).map(([line, pairs]) => {
    const order = [pairs[0].station, ...pairs.map((p) => p.next_station)]
    const pieces = smoothPieces(order.map((name) => nodes.get(`${name}|${line}`)))
    chains[line] = { order, index: new Map(order.map((name, i) => [name, i])), pieces }
    const info = LINES[line] ?? { number: '?', label: line, color: '#333', flow: '#fff' }
    return {
      line,
      ...info,
      latlngs: joinPieces(pieces),
      terminals: [order[0], order.at(-1)],
      isMerged: order.some((name) => side.has(`${name}|${line}`)), // has a stretch shared with another line
    }
  })
  lines.sort((a, b) => a.number - b.number)

  const terminals = new Set(lines.flatMap((l) => l.terminals))

  // One entry per station name; where lines meet, the label sits in the middle of them.
  const stations = [...byName.values()].map((s) => ({
    name: s.name,
    label: s.label,
    lines: s.lines,
    isTransfer: s.lines.length > 1,
    isTerminal: terminals.has(s.name),
    latlng: [0, 1].map((k) => s.points.reduce((sum, p) => sum + p[k], 0) / s.points.length),
  }))

  const dots = [...nodes.entries()].map(([key, latlng]) => {
    const [name, line] = key.split('|')
    return { name, line, latlng, isTransfer: byName.get(name).lines.length > 1, isMerged: side.has(key) }
  })

  const all = [...nodes.values()]
  const bounds = [
    [Math.min(...all.map((p) => p[0])), Math.min(...all.map((p) => p[1]))],
    [Math.max(...all.map((p) => p[0])), Math.max(...all.map((p) => p[1]))],
  ]

  // Track between two stations of the same line, following the same curve the line is drawn with.
  function ride(line, from, to) {
    const { index, pieces } = chains[line]
    const a = index.get(from)
    const b = index.get(to)
    if (a < b) return joinPieces(pieces.slice(a, b))
    return joinPieces(pieces.slice(b, a)).reverse()
  }

  return {
    bounds,
    lines,
    stations,
    dots,

    // The same line / station dot, with merged lines pushed `spread` meters apart.
    // MetroMap calls these on every zoom, so the merged band keeps the same width on screen.
    lineLatLngs(line, spread) {
      const points = chains[line].order.map((name) => place(`${name}|${line}`, spread))
      return joinPieces(smoothPieces(points))
    },
    dotLatLng(dot, spread) {
      return place(`${dot.name}|${dot.line}`, spread)
    },

    // path = [[station, line], ...] from search(...).toJs()[1]
    // → legs in travel order: { kind: 'ride', line, color, flow, latlngs } or { kind: 'walk', latlngs }
    routeLegs(path) {
      const legs = []
      let start = 0
      for (let i = 1; i <= path.length; i++) {
        const sameLine = i < path.length && path[i][1] === path[start][1]
        if (sameLine) continue
        const [from, line] = path[start]
        const [to] = path[i - 1]
        if (from !== to && chains[line]?.index.has(from) && chains[line].index.has(to)) {
          legs.push({ kind: 'ride', line, ...LINES[line], latlngs: ride(line, from, to) })
        }
        if (i < path.length) {
          const a = nodes.get(path[i - 1].join('|'))
          const b = nodes.get(path[i].join('|'))
          if (a && b) legs.push({ kind: 'walk', latlngs: [a, b] })
        }
        start = i
      }
      return legs
    },

    // Every station the route touches, once each, in travel order.
    // role: 'start' | 'end' | 'transfer' (where you change lines) | 'stop'
    routeStops(path) {
      const stops = []
      path.forEach(([name, line], i) => {
        const latlng = nodes.get(`${name}|${line}`)
        if (!latlng) return
        const previous = stops.at(-1)
        if (previous && previous.name === name) {
          previous.role = previous.role === 'start' ? 'start' : 'transfer'
          previous.latlng = previous.latlng.map((v, k) => (v + latlng[k]) / 2)
          if (i === path.length - 1) previous.role = 'end'
          return
        }
        const changesLine = i > 0 && path[i - 1][1] !== line
        const role = i === 0 ? 'start' : i === path.length - 1 ? 'end' : changesLine ? 'transfer' : 'stop'
        if (changesLine && previous && previous.role === 'stop') previous.role = 'transfer'
        stops.push({ name, label: prettyName(name), line, latlng, role })
      })
      return stops
    },
  }
}
