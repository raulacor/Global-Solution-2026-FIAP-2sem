# Pickup — Detour (FIAP GS 2026.2 CitizenTech) — updated Tue 17/11/2026 00:22

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
- **Styling session (Mon 23:45 → Tue 00:21, Claude at Raul's request — credit in AI.md):** `index.css` (dark body, Parisienne via Google Fonts → `font-logo` in `@theme`; Google `@import` must come BEFORE tailwind's); `Logo` (wordmark button, neon cyan hover, prop `onReset` — **not wired yet**); `StationPicker` (split pill inputs Origem/Destino, round 48px search button overlapping both, neon `#00f0ff` hover/focus); `icons/StationIcon` (Raul's drawing: ring + 3 tracks, currentColor); `SavedTripsMenu` + `icons/BookmarkIcon` (round button, props `open`, `onToggle`); sticky translucent header (z-[1100] above Leaflet); route result in a floating panel under the fields (absolute → map never moves); map `mt-12`, `h-[60vh]`, max 1100px (MetroMap got a `className` prop); `RouteResult` timeline (big minutes, padded seconds, per-line colored bar + dots, "⇄ Baldeação em X", `prettyName`); `LineStatusList`/`LineStatusBadge` = one continuous 18-node metro line (3 nodes per line, solid/dashed/faded by status, text under each stretch). Old `<main>` "GS 2026.2" stub removed. **Components now ≥8 ✅.**
- **App.jsx fixes DONE (Tue 00:35):** extra `statuses` param removed, `setRoute(result.toJs())` back, `<Logo onReset={() => { setRoute(null); setMessage(null) }} />`. Inputs don't clear on reset (their state lives in StationPicker) — lift later if wanted. Leftover redundant `search === null ? ... :` on the result line (harmless).
- **Night behavior:** after midnight Metrô reports "Operação Encerrada" on every line → BuildGraph removes all edges → "Rota indisponível" (correct). Backlog: when all lines are closed, show "O metrô está fechado agora" instead (good video moment).
- **web README + AI.md (3 langs) written by Claude Tue 00:27** — update the saved-trips CRUD lines once it exists.
- ~~Raul's open bugs in App.jsx~~ (old): (1) `onSearch={(origin, destination, statuses) => …}` — extra `statuses` param shadows the hook's statuses → routing ignores live status; (2) `setRoute(result)` lost `.toJs()` → map's `pathOf` needs a real array, so the dotted route isn't drawn; (3) `<Logo onReset={...} />` → clear route + message.
- **Small pending:** click before Pyodide loads → `result` = text → `.toJs()` crash (fix: early `if (search === null) { setMessage(...); return }`); `./py` → `/py` in usePyodide; StationPicker default export still named StationSelector; time display `3:4` → pad seconds.
- **DEPLOYED ✅ (Mon 22:08): https://detour-rust.vercel.app** (production = main, auto-redeploys on every merge to main; work continues on feat/web → PR → main). Pyodide runtime now served from `/pyodide/` (sync script copies node_modules/pyodide → public/pyodide, gitignored; `loadPyodide({ indexURL: '/pyodide/' })`) — without it prod 404'd on python_stdlib.zip.
- **Deploy notes (old):** Vercel → import repo → Root Directory `web` → "Include files outside the root directory" ON (sync reads ../python) → first deploy is a *preview* of feat/web; merge to main Tue for the production link. Test on Vercel: map loads, Sé → Luz (Pyodide in prod build — riskiest), status list real.
- **MockAPI created (Tue 00:43):** project `detour`, resource `trips` → **https://6afbccb1892984c4494a5896.mockapi.io/api/v1/trips** (prefix /api/v1). Check schema = id + name, origin, destination (String); set generated rows to 0. Next: `useSavedTrips` (GET/POST/PUT/DELETE with fetch `method` + `body`, JSON headers) + saved-trips dropdown in SavedTripsMenu.
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

## SUBMITTED (Tue 11:49): Python ZIP, Web Development, Front-end Design (each: repo link + gs_Web ZIP + deploy link). Remaining: STXD PDF (ready), Math PDF (fixes pending), Pitch (deck + video + email doc, Wed).

## STXD deck (Claude, Tue 11:36) — https://claude.ai/artifact/9pTQFP6idsvi6Y5Zi6Y8P2
13 slides PT: cover (Time: Detour (individual)), problema, escopo, RF/RNF/RN (6 each, with justification), caso de uso, protótipo ×3 (real screenshots 800px + Nielsen heuristics), tom de voz, roadmap, fim. Raul reviewed: OK. Brief says only "slides publicados no Teams" → export PDF (Share › Export) to submit. Optional: swap HD screenshots.
- Web CRUD DONE Tue 11:20 (tripsService + useSavedTrips by Raul; save button, SavedTripsMenu, SavedTripItem, ActionIcons by Claude). README/AI.md updated (entries 14–15).

## Brand decisions (Raul, Tue 00:50)
1. Problem/solution (his words): "Detour allows the commuter to proactively find a better way to his destination instead of just waiting for life to catch on" — this is the *solution*; proposed *problem* sentence: "When a metro line slows down or stops, commuters only find out on the platform and lose time waiting instead of taking a better way."
2. Impact indicator: minutes saved per trip (computable: route with live status vs. route ignoring it, when a line has a problem).
3. SDGs: 11 (target 11.2, public transport) + 9 — agreed.
4. Archetype: Explorer (primary) + Sage (secondary).
5. Mission (his words): "Detour is for people who don't like commuting, for people who want to get to their destination as fast as possible."
6. Vision: be recognized by the official subway channels.
7. Values: simplicity, usefulness, time-saving.
Problem sentence OK by Raul; root README CitizenTech sheet filled (EN/ptBR/enUS) Tue 00:55.

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

## Schedule (revised Tue 00:22 — the 3 p.m. wake-up was a joke: Tue is a full day again, Wed back to buffer + video)
| When | Raul | Claude |
|---|---|---|
| **Tue morning–afternoon** | fix the 3 App.jsx items above; MockAPI project + `useSavedTrips` (CRUD) + saved-trips dropdown in `SavedTripsMenu`; merge feat/web → main (redeploy); confirm professors accepted; 15 min: problem sentence, impact indicator, SDGs, archetype, mission/vision/values | web README + AI.md (3 langs, credit Claude + Fable incl. styling); rebuild Python ZIP |
| **Tue evening** | math PDF fixes (incl. transfer-walk limitation) | STXD slides, video script, brand email draft (needs the brand decisions) |
| **Wed 18 (deadline evening)** | record pitch video (≤3 min), send brand email, final merge/deploy check, ZIPs, submit | all ZIPs, final checks |

**Polish backlog (Tue, only if time):** transfer walk time — model only counts headway/2 wait at transfers (except Paulista↔Consolação 500 s), so trips with a transfer come out ~5 min short (Sé → Brigadeiro: model 9.8 min vs ~15 real). Options: one declared assumption constant, field measurement, or document as limitation (at minimum add to math PDF limitations).

Cut order if behind: styling/map polish → extra components. Never cut CRUD, deploy, or required docs.
