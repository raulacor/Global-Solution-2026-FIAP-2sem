# Pickup — Detour (FIAP GS 2026.2 CitizenTech) — updated Mon 16/11/2026 00:37

> Attach this file to a new chat and say "read the pickup and let's continue".

## Who / how we work
- Raul Azzi Corsi, FIAP Software Engineering, 1st year, RM569022. Solo project.
- **Teaching mode ON:** Raul writes the code. Claude guides with one pointed question at a time (about a concrete line in his code), and gives direct code only when he explicitly asks.
- **What works best for Raul (confirmed today):** for a new concept, a short complete worked example in an unrelated domain (e.g. `useJoke` while building `usePyodide`), then a plain-words walkthrough in order, no unexplained terms; he maps it onto his code. Mechanical fixes (missing import) → just give the line.
- **Claude owns:** READMEs, scaffolding, `.gitignore`, `prompts.md` / `AI.md`, translations (English source → `ptBR/` + `enUS/`), the **map component**, the **component skeleton**, the **Vercel status proxy function** (agreed Sun), test benches, ZIPs, slide/script/email drafts. Raul commits himself.
- Repo: `/Users/raulcorsi/Coding/repos/GS-2026-2` (device_bash: `$HOME/mnt/GS-2026-2`). Remote: github.com/raulacor/Global-Solution-2026-FIAP-2sem (private). **Branch `feat/web`** (off feat/python-core).

## Deadline
**Submit everything by Wed 18/11 evening.** Edge Computing skipped.

## The app: Detour — "the app that helps you find the best way around the subway"
- 6 metro lines (AZUL, VERDE, VERMELHA, AMARELA, LILAS, PRATA). CPTM and Line 17 excluded. Real data only.
- Live status: `https://www.metro.sp.gov.br/wp-content/themes/metrosp/direto-metro.php?embed=1`
- Fastest route = Dijkstra over graph weighted by the travel-time model.
- Reduced speed / partial → cruise × 0.5 (assumption); stopped / closed → edges removed; unknown → unchanged.

## Status by deliverable
| Deliverable | State |
|---|---|
| **Math (DPS)** | Code done. PDF written. **Pending PDF fixes:** Fonte column, commas in tables, PT figure labels, "(2024)" on Sé numbers, appendix of .py files, Line 4/5 sources, limitations section. |
| **Python** | ✅ DONE (CLI, READMEs, prompts.md, ZIP `gs_Python_Raul Azzi Corsi.zip`). |
| **Web** | **Started.** Web commits: 1) sync-python.mjs now also copies `network.json`; 2) `usePyodide` running `1 + 1` (Raul committing). |
| STXD slides | Not started (Tue). |
| Pitch video + brand email | Not started (Wed). Needs archetype, mission, vision, values. |
| Still open | Problem sentence, impact indicator, SDGs, archetype, mission/vision/values. |

## Web — where we stopped (Sun 23:50)
- **Pyodide works — no JS fallback.**
- `hooks/usePyodide.js` (`export default function usePython()`, imported as `useSearch`): loadPyodide → mkdir metro + empty `__init__.py` → Promise.all fetch `./py/metro/<file>` + writeFile → fetch `./py/network.json` → writeFile → `runPython` builds `networkGraph` once and defines `Search(startStation, targetStation)` = FindNodes + BestRoute → `pyodide.globals.get("Search")` → `setSearch(() => search)`. Returns `search` (null while loading). Small cleanups pending: `./py` → `/py`.
- `components/StationPicker/StationPicker.jsx` (default export still named `StationSelector` inside — rename to StationPicker): two controlled inputs (origin, destination), `<form onSubmit={handleSubmit}>` → `onSearch(origin, destination)`.
- `App.jsx`: `const [seconds, setSeconds] = useState(null)`; `<StationPicker onSearch={(o, d) => setSeconds(search === null ? "loading" : search(o, d).toJs()[0])} />`; `<p>{seconds}</p>`. ✅ **Typing stations + Send shows the route time.**
- **Python refactor (Claude, Sun):** `Normalize`, `FindNodes`, `BestRoute` moved into `metro/routing.py`; CLI checks pass. **Python ZIP stale → Claude rebuilds at the end.**
- Lessons learned Sun: custom hooks, useEffect + inner async, export default vs named, fetch + .text(), Promise.all + map, Pyodide FS + packages, Vite serves `public/` as `/` (unknown path → index.html), (station, line) tuple keys, restart `npm run dev` after any `python/` change, `pyodide.globals.get`, setter + function → `setX(() => fn)`, PyProxy → `.toJs()`, props, controlled inputs, `onSubmit` (DOM) vs `onSearch` (own prop), state lives at the top of a component. **Recurring slip: saving a value under one name and using another (network/networkDict, graph/networkGraph, StationSelector/StationPicker).**
- **RouteResult done (Mon 00:37):** `components/RouteResult/RouteResult.jsx` gets `route` ([seconds, path]) → minutes `Math.round(route[0]/60)` + `<ul>` of `route[1].map(([name, line], index) => <li key=...>)`. App: `const [route, setRoute] = useState(null)`, `setRoute(search(o, d).toJs())`, `{route === null ? null : <RouteResult route={route} />}`.
- **MetroMap done (Claude, Mon 00:45):** `components/MetroMap/MetroMap.jsx` (prop `route` = [seconds, path], optional) + `lib/mapGeometry.js` (pure: UTM → SVG, official line colors, `routePoints`) + `services/networkService.js` (`fetchNetwork()` → /py/network.json). Raul wires it: `<MetroMap route={route} />` in App. Preview: `Claude outputs/map-preview.svg`.
- **MetroMap v2 by Fable (Mon 01:20, runs fine on Raul's Mac):** Leaflet + Esri dark basemap (needs internet; attribution included — check it on Vercel), UTM→lat/lng in `lib/mapGeometry.js`, animated lines per status, fly-to-route, collision-hidden labels, `MapLegend.jsx`, `MetroMap.css`. Props: `route`, `statuses` ({LINE: {status, info}} as ParseStatus returns). **`lib/lineStatus.js` `statusOf(entry)` → {kind, text, info}: Raul's LineStatusBadge/useLineStatus should REUSE it, not duplicate.** Fallback if it misbehaves: simple SVG map at commit 5481eac. **AI.md must credit Fable for the map v2.**
- **Next step (Mon):** counter-case first — type a station that doesn't exist ("xyz"): `BestRoute` returns None → `.toJs()` crashes. Handle it. Then group the path by line (like PrintRoute), then Vercel proxy (Claude) + useLineStatus.
- Commits Raul still needs to make (if not done Sun night): python refactor (`CLAUDE: move Normalize, FindNodes, BestRoute into metro.routing`), web pyodide + StationPicker.
- Check: Sé → Luz ≈ 3.4 min; Artur Alvim → Paraíso ≈ 35 min; Capão Redondo → Luz ≈ 51 min.

## Python core reference — `python/metro/`, no I/O
- `travel_time.py`: a=1.1, b=1.2; OVERHEAD, HEADWAY per line; `SegmentTime(d, line, factor=1)`.
- `network.py`: `BuildGraph(network, statuses=None)` → `{(station, line): [((station, line), seconds), ...]}`. 93 nodes, 192 edges.
- `routing.py`: `FastestRoute(graph, start, goal)` → `(seconds, path)` or None.
- `line_status.py`: `ParseStatus(html)`; `LINE_BY_NUMBER`, `STATUS_FACTOR`, `CLOSED_STATUSES`.
- `main.py` helpers as reference: `Normalize`, `FindNodes`, `BestRoute`, `PrintRoute`.
- `network.json` = `{"stations": {LINE: [{name,line,x,y}]}, "neighbors": {LINE: [{station,next_station,distance_between}]}}`; x/y UTM meters (EPSG:31983).
- Fixtures: `data-prep/raw/direto_metro_*_sample.html`. `python/check_core.py` offline.

## Web rubric checklist
React (Vite) + Tailwind, ≥8 components, useState + useEffect, ≥2 custom hooks, logic separated from presentation, external API with full CRUD, ≥15 meaningful commits, Vercel deploy (Root = `web`), ZIP, README, AI.md, private repo with professors' write access. Staying in JavaScript (no TS).

## Web plan
- Hooks: `usePyodide`, `useLineStatus` (fetch from Vercel serverless proxy — Claude writes the proxy), `useSavedTrips` (CRUD on MockAPI).
- Components (≥8): Header, LineStatusList, LineStatusBadge, StationPicker, RouteResult, MetroMap (Claude), SavedTripsList, SavedTripItem, SaveTripForm, Footer/ErrorBanner/Loading.
- Saved trip: `{ id, name, origin, destination }`.

## Schedule (revised Mon 00:48 — ahead: Pyodide, StationPicker, RouteResult, MetroMap done Sun night)
| Day | Raul | Claude |
|---|---|---|
| **Mon 16** | "xyz" case (BestRoute → None) + group path by line like PrintRoute; wire `<MetroMap route={route} />`; `useLineStatus` + LineStatusList + LineStatusBadge; **first Vercel deploy**; if time: MockAPI + `useSavedTrips` (pulled from Tue). **Basic Tailwind on every new component as it's written.** | Vercel status proxy function |
| **Tue 17 — everything (Raul wants to finish Tue; Wed = buffer only)** | **Morning:** finish CRUD + saved-trip components, redeploy, confirm professors; 15 min to decide problem sentence, impact indicator, SDGs, archetype, mission/vision/values. **Afternoon:** light styling pass, math PDF fixes, ≥15 commits. **Evening:** record pitch video (≤3 min, 9 beats), send brand email, submit. | Morning: web README + AI.md (3 langs), rebuild Python ZIP. Afternoon: STXD slides, video script, email draft (once brand decisions are in). Evening: all ZIPs. |
| **Wed 18** | buffer — only what slipped; official deadline Wed evening | fixes |

Cut order if behind: styling/map polish → extra components. Never cut CRUD, deploy, or required docs.
