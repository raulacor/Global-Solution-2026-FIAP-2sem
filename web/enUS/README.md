🌐 [Português](../ptBR/README.md) · **English**

# Detour — Web Application

**Front-end Design** and **Web Development** deliverable (GS 2026.2).

**Live:** [detour-rust.vercel.app](https://detour-rust.vercel.app)

## Description

Detour finds the fastest way between two São Paulo metro stations **taking each line's real, current operating status into account**. If a line is stopped, the route goes around it; if a line is running at reduced speed, its stretches get slower and the route may change.

The routing is not a JavaScript copy: the same Python package the CLI uses (`../python/metro/`) runs **inside the browser** through [Pyodide](https://pyodide.org). The line status comes live from Metrô's official "Direto do Metrô" page.

## Features

- **Route search** — type an origin and a destination (accents and case don't matter). The result shows the estimated time, the number of transfers and the stations grouped by line.
- **Live line status** — the 6 metro lines drawn as one continuous metro line (18 nodes, 3 per line), each stretch styled by its situation: solid (normal), dashed (reduced speed / partial operation), faded with red nodes (stopped / closed).
- **Status-aware routing** — the current status is sent to the routing on every search (stopped line → its tracks are removed; reduced speed → cruise speed × 0.5).
- **Interactive map** — the network over a dark map of São Paulo (Leaflet), lines animated by status, the selected route highlighted with its stations named.
- **Unknown station / still loading** — clear messages instead of errors.
- **Saved trips (CRUD)** — _in progress: MockAPI + `useSavedTrips`._

## How it works

```
Browser
 ├─ usePyodide ─ loads Pyodide + python/metro + network.json, builds the graph,
 │               exposes search(origin, destination, statuses) and parseStatus(html)
 ├─ useLineStatus(parseStatus) ─ GET /api/status → parseStatus(html) → { LINE: {status, info} }
 └─ App ─ StationPicker → search(...) → RouteResult + MetroMap
                         statuses ─────→ LineStatusList + MetroMap + search

/api/status ─ Vercel serverless function (api/status.js): fetches the Direto do Metrô page
              server-side (the browser can't, CORS) and returns its HTML, cached 60 s.
              In `npm run dev` the same URL is served by the Vite proxy (vite.config.js).
```

## Project structure

```
web/
├── api/status.js            Vercel function: Metrô status proxy (CORS)
├── scripts/sync-python.mjs  copies ../python/metro, network.json and the Pyodide runtime into public/
├── src/
│   ├── App.jsx              page layout and state (route, message)
│   ├── components/          presentation only
│   ├── hooks/               state + side effects (usePyodide, useLineStatus)
│   ├── lib/                 pure logic, no React (groupRoute, lineStatus, mapGeometry)
│   └── services/            data access (networkService)
└── vite.config.js           React + Tailwind plugins, dev proxy for /api/status
```

### Components

| Component | Role |
|---|---|
| `Logo` | "Detour" wordmark button (clears the search) |
| `StationPicker` | origin / destination fields with the round search button |
| `StationIcon`, `BookmarkIcon` | custom SVG icons (inherit the text color) |
| `RouteResult` | route timeline: time, transfers, stations per line |
| `MetroMap` | Leaflet map of the network, status animations, route highlight |
| `LineStatusList` | the 18-node status line |
| `LineStatusBadge` | one line's stretch (3 nodes) and its situation |
| `SavedTripsMenu` | saved trips menu button (list coming with the CRUD) |

### Custom hooks

| Hook | Role |
|---|---|
| `usePyodide` | loads Python in the browser once; returns `{ search, parseStatus }` (both `null` while loading) |
| `useLineStatus` | fetches `/api/status` and parses it with the Python parser; re-runs when `parseStatus` becomes available |

## Prerequisites

- Node.js 20.19+ (or 22.12+)
- npm

## Installation and running

```bash
npm install
npm run dev
```

`npm run dev` and `npm run build` first run `scripts/sync-python.mjs`, which copies into `public/` (generated, git-ignored):
- `../python/metro/` → `public/py/metro/` and `../python/data/network.json` → `public/py/network.json`
- the Pyodide runtime (`pyodide.asm.wasm`, `python_stdlib.zip`, …) → `public/pyodide/`

After changing anything in `../python/`, restart `npm run dev` so the copy is refreshed.

## Stack

React 19 · Vite 8 · Tailwind CSS v4 · Pyodide · Leaflet · Vercel (hosting + serverless function) · oxlint

## Deployment

Vercel, **Root Directory = `web`**, production branch `main` (every merge redeploys).
Live: [detour-rust.vercel.app](https://detour-rust.vercel.app)

## Data sources

- Network, stations, speeds and headways: see the [repository README](../../README.md#citizentech-sheet).
- Live status: [Direto do Metrô](https://www.metro.sp.gov.br/wp-content/themes/metrosp/direto-metro.php?embed=1) (official).
- Map background: Esri World Dark Gray Base (attribution shown on the map).

## AI usage

See [AI.md](../../enUS/AI.md).

## Author

Raul Azzi Corsi — RM569022
