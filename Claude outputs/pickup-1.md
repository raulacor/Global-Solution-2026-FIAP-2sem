# Pickup — Detour (FIAP GS 2026.2 CitizenTech) — updated Sun 15/11/2026

> Attach this file to a new chat and say "read the pickup and let's continue".

## Who / how we work
- Raul Azzi Corsi, FIAP Software Engineering, 1st year, RM569022. Solo project.
- **Teaching mode ON:** Raul writes the code. Claude guides with one pointed question at a time (about a concrete line in his code), mini-lessons for new topics, and gives direct code only when he explicitly asks ("do it", "take care of it", "I'm too tired").
- **Claude owns:** READMEs, scaffolding, `.gitignore`, `prompts.md` / `AI.md`, translations (English is the source → `ptBR/` + `enUS/` mirrors), the **map component**, test benches and ZIPs. Raul commits himself.
- Repo: `/Users/raulcorsi/Coding/repos/GS-2026-2` (Claude reaches it via device_bash at `$HOME/mnt/GS-2026-2`). Remote: github.com/raulacor/Global-Solution-2026-FIAP-2sem (private, professors invited). Branch `feat/python-core`, last commit 89f49fa.

## Deadline
**Submit everything by Wed 18/11 evening** (GTA VI on the 19th). Edge Computing is skipped.

## The app: Detour — "the app that helps you find the best way around the subway"
- 6 metro lines (AZUL, VERDE, VERMELHA, AMARELA, LILAS, PRATA). CPTM and Line 17 excluded. Real data only.
- Live line status from the official "Direto do Metrô" page: `https://www.metro.sp.gov.br/wp-content/themes/metrosp/direto-metro.php?embed=1`
- Fastest route = Dijkstra over a graph whose edge weights come from the math travel-time model.
- Status effects: Velocidade Reduzida / Operação Parcial → cruise speed × 0.5 (assumption, Metrô publishes no number); Paralisada / Operação Encerrada → line's edges removed; unknown → unchanged.

## Status by deliverable
| Deliverable | State |
|---|---|
| **Math (DPS)** | Code done, merged (PR #2). PDF written. **Pending PDF fixes:** Fonte column, commas in tables, PT figure labels, "(2024)" on Sé numbers, appendix of .py files, Line 4/5 sources, limitations (50% assumption, per-line status, overhead unchanged under reduced speed, straight-line distances, daily-average overhead). |
| **Python** | ✅ **DONE.** CLI: 1 status, 2 fastest route (+ save trip), 3 saved trips (list/rename/delete, JSON in `python/data/saved_trips.json`). READMEs + prompts.md (entries 1–18, verification, critical analysis) in all 3 languages. ZIP built: `gs_Python_Raul Azzi Corsi.zip` at repo root (gitignored; contains `python/` + `data-prep/`, with both `prompt.md` and `prompts.md`). |
| **Web (Front-end + Web Dev)** | Not started. `web/` = React 19 + Vite 8 + Tailwind v4 + pyodide + oxlint; `scripts/sync-python.mjs` copies `python/metro` → `web/public/py/` on predev/prebuild. `src/` components/hooks/lib/services empty, App.jsx stub. |
| **STXD slides** | Not started (Tue). |
| **Pitch video + brand email** | Not started (Wed). Needs archetype, mission, vision, values. |
| Still open | Problem sentence, impact indicator, SDGs, archetype, mission/vision/values. |

## Python core (shared with the web via Pyodide) — `python/metro/`, no I/O
- `travel_time.py`: a=1.1, b=1.2 m/s²; OVERHEAD per line (s); HEADWAY per line (s); `GetCruiseSpeed`, `TravelTime(d,v,a,b)`, `TransferTime(line)` = headway/2, `SegmentTime(d, line, factor=1)`.
- `network.py`: `BuildGraph(network, statuses=None)` → `{(station, line): [((station, line), seconds), ...]}`. 93 nodes, 192 edges. Paulista(AMARELA)↔Consolação(VERDE) = 500 s walk + headway/2.
- `routing.py`: `FastestRoute(graph, start, goal)` → `(seconds, path)` or None.
- `line_status.py`: `ParseStatus(html)` → `{"AZUL": {"status": "...", "info": "..."}, ...}`; `LINE_BY_NUMBER`, `STATUS_FACTOR`, `CLOSED_STATUSES`.
- `main.py` helpers usable as reference for the web: `Normalize`, `FindNodes`, `BestRoute`, `PrintRoute`.
- Data: `python/data/network.json` = `{"stations": {LINE: [{name,line,x,y}]}, "neighbors": {LINE: [{station,next_station,distance_between}]}}`. x/y are UTM meters (EPSG:31983) → the SVG map uses them directly.
- Test fixtures: `data-prep/raw/direto_metro_{sample,reduzida,parcial,paralisada}_sample.html`. `python/check_core.py` runs offline.
- Reference results: Artur Alvim → Paraíso ≈ 35 min (Vermelha → Sé → Azul); Sé → Luz ≈ 3 min; Capão Redondo → Luz ≈ 51 min.

## Web rubric checklist
React (Vite) + **Tailwind**, **≥8 components**, `useState` + `useEffect`, **≥2 custom hooks**, logic/data separated from presentation, **external API with full CRUD**, **≥15 meaningful commits**, deploy link (Vercel, Root Directory = `web`), ZIP, README, **AI.md**, private repo with professors' write access.

## Web plan
- **Hooks:** `usePyodide` (load Pyodide + `metro/` + network.json, expose BuildGraph/FastestRoute), `useLineStatus` (fetch from a Vercel serverless function that proxies the Direto do Metrô page → CORS), `useSavedTrips` (CRUD on **MockAPI**).
- **Components (≥8), draft:** Header, LineStatusList, LineStatusBadge, StationPicker (origin/destination), RouteResult, MetroMap (Claude — SVG from UTM x/y, dotted route), SavedTripsList, SavedTripItem (rename/delete), SaveTripForm, Footer/ErrorBanner/Loading.
- **Pyodide fallback:** if routing isn't running in the browser by Sun night, port Dijkstra to JS.
- Saved trip shape: `{ id, name, origin, destination }` (route recalculated with today's status).

## Schedule
| Day | Work |
|---|---|
| **Sun 15 (today)** | Web: component plan + folder skeleton, `usePyodide` running BuildGraph/FastestRoute in the browser (or decide JS fallback), StationPicker + RouteResult, Claude builds MetroMap. |
| Mon 16 | Vercel status function + `useLineStatus` + status components; MockAPI + `useSavedTrips` + saved-trip components; deploy. |
| Tue 17 | Web README / AI.md (3 langs), ≥15 web commits, confirm professors accepted; math PDF fixes; STXD slides (roadmap: per-segment status, time-of-day overhead). |
| Wed 18 | Pitch video (≤3 min, 9 beats) + brand-archetype email; all ZIPs; submit. |

Cut order if behind: map polish → extra components. Never cut CRUD, deploy, or the required docs.
