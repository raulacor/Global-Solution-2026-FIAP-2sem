# Pickup — Detour (FIAP GS 2026.2 CitizenTech) — updated Sun 15/11/2026 13:50

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

## Web — where we stopped
- `scripts/sync-python.mjs` copies `python/metro` → `web/public/py/metro/` and `python/data/network.json` → `web/public/py/network.json` (predev/prebuild). Served at `/py/metro/*.py` and `/py/network.json`.
- `web/src/hooks/usePyodide.js`: `export default function usePython()` — `useState(null)`, `useEffect` with inner `async function load()` → `await loadPyodide()` → `setPython(pyodide)`; `load()` called; deps `[]`. Returns the interpreter itself (not {ready,result,error}).
- `App.jsx`: `const python = usePython()`; `<p>{python === null ? "Loading…" : python.runPython('1+1')}</p>` → shows **2**. ✅
- **Next step (task 3):** load `metro/` into Pyodide's FS. Taught: `python.FS.writeFile('greet.py', code)` + `python.pyimport('greet')` (unrelated example). **Open question to Raul:** how do you get the text of `/py/metro/travel_time.py` in JS? (hint: `fetch` + `.text()` from `useJoke`). Expected next snags: `metro` is a package → needs `FS.mkdir('metro')` and all 5 files incl. `__init__.py`; network.json must be passed in (fetch + JSON or write to FS); PyProxy results → `.toJs()`.
- Check: Sé → Luz ≈ 3 min; Artur Alvim → Paraíso ≈ 35 min; Capão Redondo → Luz ≈ 51 min.

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
