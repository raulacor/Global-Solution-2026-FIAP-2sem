# Pickup — Detour (FIAP GS 2026.2 CitizenTech) — updated Sun 15/11/2026 23:50

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
- **Next step (Mon):** counter-case first — type a station that doesn't exist ("xyz"): `BestRoute` returns None → `.toJs()` crashes. Handle it. Then RouteResult (show minutes + path grouped by line, like PrintRoute), store the whole result instead of only seconds.
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

## Schedule (revised Sun 13:50 — Raul off the rest of Sunday)
| Day | Raul | Claude |
|---|---|---|
| **Mon 16** | metro/ + network.json into Pyodide, Sé→Luz check; **decide Pyodide vs JS Dijkstra by lunch**; StationPicker + RouteResult; `useLineStatus` + status components | component skeleton, MetroMap, Vercel status proxy |
| **Tue 17** | MockAPI + `useSavedTrips` + saved-trip components; deploy; confirm professors; ≥15 commits; math PDF fixes | web README + AI.md (3 langs), STXD slide draft |
| **Wed 18** | pitch video, brand email, ZIPs, submit | video script + email draft, ZIPs |

Cut order if behind: map polish → extra components. Never cut CRUD, deploy, or required docs.
