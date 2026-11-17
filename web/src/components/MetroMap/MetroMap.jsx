import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MetroMap.css'
import { fetchNetwork } from '../../services/networkService'
import { buildMap, BASEMAP } from '../../lib/mapGeometry'
import { statusOf } from '../../lib/lineStatus'

// Draws the 6 metro lines over a dark map of São Paulo (streets and colors, no place names).
// Props:
//   route    — optional, the [seconds, path] result of search(...).toJs(). The map flies to it,
//              highlights it and names its stations.
//   className — size of the map box (Tailwind classes); defaults to 72vh tall, full width.
//   statuses — optional, { LINE: { status, info } } exactly as ParseStatus returns it.
//              A line with no status is drawn as running normally.

const WHOLE_NETWORK = { padding: [36, 36] }
// Framing of a route. On wide maps App shows the route summary as a 320 px panel on the
// left edge, so the route is framed to the right of it; on narrow maps the panel sits below.
function aroundRoute(container) {
  return container.clientWidth >= 640
    ? { paddingTopLeft: [370, 70], paddingBottomRight: [90, 70], maxZoom: 16 }
    : { paddingTopLeft: [40, 60], paddingBottomRight: [40, 60], maxZoom: 16 }
}

// Lines get thicker as you zoom in, so they never get lost in the background.
function lineWidth(zoom) {
  if (zoom < 11.5) return 6
  if (zoom < 13) return 7.5
  if (zoom < 14.5) return 9
  return 11
}

// route may arrive straight from Pyodide (a Python object wrapped by PyProxy) or already as a JS array.
function pathOf(route) {
  const value = typeof route?.toJs === 'function' ? route.toJs() : route
  return Array.isArray(value) && Array.isArray(value[1]) ? value[1] : []
}

// A piece of HTML pinned to a point of the map (station name, origin / destination pin).
function htmlMarker(latlng, anchorClass, className, text = '') {
  const element = document.createElement('span')
  element.className = className
  element.textContent = text
  const icon = L.divIcon({ className: anchorClass, html: element, iconSize: [0, 0] })
  return L.marker(latlng, { icon, interactive: false, keyboard: false })
}

// Which side of the station its name goes: tilted when the route runs sideways there
// (names would run into each other), otherwise to the right or left of the track.
// Origin and destination go on the outer side, pointing away from the rest of the route.
function labelSide(stops, i) {
  const a = stops[Math.max(i - 1, 0)].latlng
  const b = stops[Math.min(i + 1, stops.length - 1)].latlng
  const east = (b[1] - a[1]) * Math.cos((a[0] * Math.PI) / 180)
  const north = b[0] - a[0]
  const sideways = Math.abs(east) > Math.abs(north) * 1.2
  if (stops.length > 1 && (i === 0 || i === stops.length - 1)) {
    const outward = i === 0 ? -1 : 1
    if (sideways) return east * outward > 0 ? 'side-e' : 'side-w'
    return north * outward > 0 ? 'side-n' : 'side-s'
  }
  if (sideways) return 'side-tilt'
  return east * north >= 0 ? 'side-w' : 'side-e'
}

// Hides every name that would sit on top of a more important one.
function hideOverlappingLabels(container) {
  const zoomedIn = container.classList.contains('is-zoomed')
  const labels = [...container.querySelectorAll('.dl-label')]
    .filter((label) => zoomedIn || !label.classList.contains('when-zoomed'))
    .sort((a, b) => b.dataset.priority - a.dataset.priority)
  const kept = []
  for (const label of labels) {
    const r = label.getBoundingClientRect()
    const tilted = label.classList.contains('side-tilt')
    const overlaps = kept.some((k) =>
      tilted && k.tilted
        ? Math.hypot(r.left - k.r.left, r.bottom - k.r.bottom) < 21
        : r.left < k.r.right && r.right > k.r.left && r.top < k.r.bottom && r.bottom > k.r.top,
    )
    label.classList.toggle('is-hidden', overlaps)
    if (!overlaps) kept.push({ r, tilted })
  }
}

export default function MetroMap({ route = null, statuses = null, className = 'h-[72vh] min-h-[440px] w-full' }) {
  const [network, setNetwork] = useState(null)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)
  const leafletRef = useRef(null) // everything Leaflet owns, created once the network arrives
  const statusesRef = useRef(statuses)

  useEffect(() => {
    fetchNetwork().then(setNetwork).catch((e) => setError(e.message))
  }, [])

  const map = useMemo(() => (network ? buildMap(network) : null), [network])

  // 1) Create the map: background, the six lines, the stations.
  useEffect(() => {
    if (!map) return
    const container = containerRef.current
    const bounds = L.latLngBounds(map.bounds)

    const leafletMap = L.map(container, {
      zoomControl: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      minZoom: 10,
      maxZoom: 17,
      maxBounds: bounds.pad(0.6),
      maxBoundsViscosity: 0.8,
    })
    leafletMap.fitBounds(bounds, WHOLE_NETWORK) // a view first: layers only get drawn once there is one

    // Zooming out stops at the view that shows all the lines (recomputed if the map's box changes size).
    function lockZoomOut() {
      const [x, y] = WHOLE_NETWORK.padding
      leafletMap.setMinZoom(leafletMap.getBoundsZoom(bounds, false, L.point(2 * x, 2 * y)))
    }
    lockZoomOut()
    L.control.zoom({ position: 'topright' }).addTo(leafletMap)

    L.tileLayer(BASEMAP.url, {
      attribution: BASEMAP.attribution,
      maxNativeZoom: BASEMAP.maxNativeZoom,
      opacity: BASEMAP.opacity,
      maxZoom: 17,
    }).addTo(leafletMap)

    // Three layers, bottom to top: network lines, station dots, the selected route.
    const renderers = {}
    for (const [name, zIndex] of [['lines', 410], ['dots', 415], ['route', 420]]) {
      leafletMap.createPane(`dl-${name}`).style.zIndex = zIndex
      renderers[name] = L.svg({ pane: `dl-${name}`, padding: 1 })
    }

    // Each line = white casing + colored line + moving dashes ("trains"), stacked.
    // noClip keeps the dash pattern steady while the map moves.
    // All casings go in first, then all colors, then all dashes: where two lines run side by side
    // (merged stretch) one line's white casing must not cover the other line's color.
    const lineLayers = map.lines.map((line) => ({ line, layers: [] }))
    for (const layer of ['dl-casing', 'dl-base', 'dl-flow']) {
      for (const { line, layers } of lineLayers) {
        const polyline = L.polyline(line.latlngs, {
          renderer: renderers.lines,
          className: `dl dl-net ${layer}`,
          color: line.color,
          interactive: layer === 'dl-base',
          noClip: true,
          smoothFactor: 0.4,
        }).addTo(leafletMap)
        polyline.getElement().style.setProperty('--c', line.color)
        polyline.getElement().style.setProperty('--f', line.flow)
        layers.push(polyline)
      }
    }
    for (const { layers } of lineLayers) {
      layers[1].bindTooltip('', { sticky: true, className: 'dl-tooltip', direction: 'top', offset: [0, -8] })
    }

    const dots = map.dots.map((dot) =>
      L.circleMarker(dot.latlng, {
        dot,
        renderer: renderers.dots,
        className: `dl-dot${dot.isTransfer ? ' is-transfer' : ''}`,
        radius: 3,
      })
        .bindTooltip(`<b>${map.stations.find((s) => s.name === dot.name).label}</b>`, {
          className: 'dl-tooltip',
          direction: 'top',
          offset: [0, -6],
        })
        .addTo(leafletMap),
    )

    function onZoom() {
      const zoom = leafletMap.getZoom()
      const width = lineWidth(zoom)
      container.style.setProperty('--w', `${width}px`)
      container.classList.toggle('is-zoomed', zoom >= 13)
      for (const dot of dots) dot.setRadius(width * (dot.options.dot.isTransfer ? 0.62 : 0.42))

      // Merged stretches: keep the two lines exactly one line-width apart on screen at every zoom.
      const metersPerPixel =
        (40075016.686 * Math.cos((bounds.getCenter().lat * Math.PI) / 180)) / (256 * 2 ** zoom)
      const spread = width * metersPerPixel
      for (const { line, layers } of lineLayers) {
        if (!line.isMerged) continue
        const latlngs = map.lineLatLngs(line.line, spread)
        for (const layer of layers) layer.setLatLngs(latlngs)
      }
      for (const dot of dots) {
        if (dot.options.dot.isMerged) dot.setLatLng(map.dotLatLng(dot.options.dot, spread))
      }
    }
    leafletMap.on('zoomend', onZoom)
    leafletMap.on('moveend zoomend', () => hideOverlappingLabels(container))

    onZoom()

    // The map lives inside the page layout: when its box changes size, tell Leaflet.
    const resizeObserver = new ResizeObserver(() => {
      leafletMap.invalidateSize()
      lockZoomOut()
    })
    resizeObserver.observe(container)

    leafletRef.current = {
      leafletMap,
      bounds,
      renderers,
      lineLayers,
      routeGroup: L.layerGroup().addTo(leafletMap),
      labelGroup: L.layerGroup().addTo(leafletMap),
      routeLegs: [], // [{ line, elements }] so a status change can reach the drawn route too
      showsRoute: false,
    }

    return () => {
      resizeObserver.disconnect()
      leafletMap.remove()
      leafletRef.current = null
    }
  }, [map])

  // 2) Statuses: each line (and each leg of the route on that line) gets its status' animation.
  useEffect(() => {
    statusesRef.current = statuses
    const leaflet = leafletRef.current
    if (!leaflet) return
    for (const { line, layers } of leaflet.lineLayers) {
      const { kind, text, info } = statusOf(statuses?.[line.line])
      for (const layer of layers) layer.getElement().dataset.st = kind
      layers[1].setTooltipContent(
        `<b>Linha ${line.number}-${line.label}</b><br>${text}${info && info !== text ? `<br><small>${info}</small>` : ''}`,
      )
    }
    for (const leg of leaflet.routeLegs) {
      const { kind } = statusOf(statuses?.[leg.line])
      for (const element of leg.elements) element.dataset.st = kind
    }
  }, [map, statuses])

  // 3) Route: highlight it, name its stations and fly to it. No route: show the whole network again.
  useEffect(() => {
    const leaflet = leafletRef.current
    if (!leaflet) return
    const { leafletMap, renderers, routeGroup, labelGroup } = leaflet
    const container = containerRef.current
    const path = pathOf(route)

    routeGroup.clearLayers()
    labelGroup.clearLayers()
    leaflet.routeLegs = []
    container.classList.toggle('has-route', path.length > 0)

    function addLabel(latlng, text, classes, priority) {
      const marker = htmlMarker(latlng, 'dl-label-anchor', `dl-label ${classes}`, text)
      marker.options.icon.options.html.dataset.priority = priority
      marker.addTo(labelGroup)
    }

    if (path.length === 0) {
      // Station names of the whole network — they only show once you zoom in.
      for (const station of map.stations) {
        const strong = station.isTransfer || station.isTerminal
        addLabel(station.latlng, station.label, `side-e when-zoomed${strong ? ' is-strong' : ''}`, strong ? 2 : 1)
      }
      if (leaflet.showsRoute) leafletMap.flyToBounds(leaflet.bounds, { ...WHOLE_NETWORK, duration: 1.2 })
      leaflet.showsRoute = false
      hideOverlappingLabels(container)
      return
    }

    function routeLine(latlngs, layer) {
      return L.polyline(latlngs, {
        renderer: renderers.route,
        className: `dl dl-route ${layer}`,
        interactive: false,
        noClip: true,
        smoothFactor: 0.4,
      }).addTo(routeGroup)
    }

    const legs = map.routeLegs(path)
    // Halos and casings first, so no leg's border is drawn over another leg's color.
    for (const leg of legs) routeLine(leg.latlngs, 'dl-halo')
    for (const leg of legs) routeLine(leg.latlngs, leg.kind === 'walk' ? 'dl-walk-bed' : 'dl-casing')
    for (const leg of legs) {
      if (leg.kind === 'walk') {
        routeLine(leg.latlngs, 'dl-walk')
        continue
      }
      const elements = ['dl-base', 'dl-flow'].map((layer) => routeLine(leg.latlngs, layer).getElement())
      for (const element of elements) {
        element.style.setProperty('--c', leg.color)
        element.style.setProperty('--f', leg.flow)
        element.dataset.st = statusOf(statusesRef.current?.[leg.line]).kind
      }
      leaflet.routeLegs.push({ line: leg.line, elements })
    }

    const stops = map.routeStops(path)
    stops.forEach((stop, i) => {
      const isEnd = stop.role === 'start' || stop.role === 'end'
      if (isEnd) {
        htmlMarker(stop.latlng, 'dl-pin-anchor', `dl-pin is-${stop.role}`).addTo(routeGroup)
      } else {
        L.circleMarker(stop.latlng, {
          renderer: renderers.route,
          className: 'dl-stop',
          radius: stop.role === 'transfer' ? 6.5 : 4.5,
          interactive: false,
        }).addTo(routeGroup)
      }
      const emphasis = isEnd ? ' is-end' : stop.role === 'transfer' ? ' is-strong' : ''
      addLabel(stop.latlng, stop.label, labelSide(stops, i) + emphasis, isEnd ? 3 : stop.role === 'transfer' ? 2 : 1)
    })

    const routeBounds = L.latLngBounds(stops.map((stop) => stop.latlng))
    for (const leg of legs) routeBounds.extend(L.latLngBounds(leg.latlngs))
    leafletMap.flyToBounds(routeBounds, { ...aroundRoute(container), duration: 1.4 })
    leaflet.showsRoute = true
    hideOverlappingLabels(container)
  }, [map, route])

  if (error) return <p className="text-sm text-red-600">Map unavailable: {error}</p>

  return (
    <div className={`relative isolate overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/10 ${className}`}>
      <div ref={containerRef} className="detour-map h-full w-full" role="img" aria-label="Mapa do metrô de São Paulo" />
      {map ? null : (
        <p className="absolute inset-0 grid place-items-center text-sm text-zinc-400">Carregando mapa…</p>
      )}
    </div>
  )
}
