# Pickup — Detour (FIAP GS 2026.2 CitizenTech) — updated Mon 16/11/2026 21:31

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

## Web — where we stopped (Mon 21:31)
**Done:** Pyodide routing in the browser; `usePyodide` returns `{ search, parseStatus }` (initial state `{search: null, parseStatus: null}`; Python `search(start, target, statuses)` rebuilds the graph with `statuses.to_py()` when present → **routing reroutes around stopped/reduced lines**, tested with fake AZUL Paralisada: Sé → Luz via VERMELHA → República → AMARELA); `useLineStatus(parseStatus)` (2nd custom hook: fetch `/api/status` → `parseStatus(html).toJs({ dict_converter: Object.fromEntries })`, effect deps `[parseStatus]`); StationPicker; RouteResult grouped by line via `lib/groupRoute.js`; "Rota indisponível" message when no route; LineStatusBadge (`{line, status}`, color from `LINE_COLORS`, text from `statusOf`) + LineStatusList (`{statuses}`, maps `Object.keys(LINE_COLORS)`, `statuses?.[line]`); MetroMap v2 (Fable) gets `route` + `statuses`; its status legend (MapLegend.jsx) removed by Claude — LineStatusList is the one status list.
- **Status proxy (Claude):** `web/api/status.js` (Vercel function, 60 s edge cache) + Vite dev proxy in `vite.config.js` → same URL `/api/status` in dev and prod. Tested locally ✅.
- **Commits:** ≥15 on feat/web (rubric ✅ once tonight's 2 are in).
- **Components so far (6):** StationPicker, RouteResult, MetroMap, LineStatusBadge, LineStatusList (+ MapLegend removed). Need ≥8 → Header/Logo, SavedTrips components coming.
- **Small pending:** click before Pyodide loads → `result` = text → `.toJs()` crash (fix: early `if (search === null) { setMessage(...); return }`); `./py` → `/py` in usePyodide; StationPicker default export still named StationSelector; time display `3:4` → pad seconds.
- **Deploy (next):** Vercel → import repo → Root Directory `web` → "Include files outside the root directory" ON (sync reads ../python) → first deploy is a *preview* of feat/web; merge to main Tue for the production link. Test on Vercel: map loads, Sé → Luz (Pyodide in prod build — riskiest), status list real.
- **MockAPI:** create project + `trips` resource (name, origin, destination) — 10 min, no code.
- Lessons Mon: early return in handlers, two moments of a component (click vs drawing), JSX `? :` only, `null` draws nothing, `.toJs` placement, nested map, objects `{line, lines}`, Tailwind can't build dynamic classes → `style={{ backgroundColor }}`, `Object.keys`, `?.`, props names must match the tag's attributes, `() => ({...})` returns an object, `function` is reserved, `.to_py()` (JS → Python), effect deps `[x]`.
- **Recurring slips:** name saved one way / used another; braces vs parentheses in arrows; unsaved files (turn on VS Code Auto Save); `.method()` attached after the setter's closing paren.

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

## Raul's UI vision (Mon 11:13)
- **Header/navbar:** [Logo button] — [Origin input] [Destination input] [Search] — [Saved trips dropdown].
- Logo = "Detour" written as a button that resets the app (clear route/inputs/message — NOT a full page reload, which would re-download Pyodide).
- Each input: a line-color dropdown + a station dropdown. Line chosen → only that line's stations. No line → all stations, each with a colored circle for its line(s). Needs a custom dropdown component (native `<select>` can't draw colored circles). Data: `fetchNetwork()`; colors: `LINE_COLORS` in `lib/mapGeometry.js`.
- After Search, the header panel grows to show the route grouped by line (`lib/groupRoute.js`), circles in each line's color.
- Saved trips dropdown on the right = SavedTripsList/SavedTripItem (CRUD via `useSavedTrips` + MockAPI).
- Order: groupRoute → line status + deploy → dropdown picker + expanding header (Mon afternoon or Tue).

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

**Polish backlog (Tue, only if time):** transfer walk time — model only counts headway/2 wait at transfers (except Paulista↔Consolação 500 s), so trips with a transfer come out ~5 min short (Sé → Brigadeiro: model 9.8 min vs ~15 real). Options: one declared assumption constant, field measurement, or document as limitation (at minimum add to math PDF limitations).

Cut order if behind: styling/map polish → extra components. Never cut CRUD, deploy, or required docs.
