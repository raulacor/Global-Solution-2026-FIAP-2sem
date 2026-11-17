🌐 [Português](ptBR/AI.md) · **English**

# AI Usage — Web Application

## Tools used

| Tool | Purpose |
|---|---|
| Claude (Anthropic) — Claude Opus | Mentoring: interpreting the brief, architecture, step-by-step hints and worked examples while Raul wrote the code; scaffolding, the status proxy, the first map, the visual styling (on request) and documentation |
| Claude Fable (Anthropic) | Second version of the map component (`MetroMap` v2), requested by Raul |

## Interactions

### 1. Idea and data source — 2026-11-08

> I wanted [...] a 2d or 3d map of the whole Sao Paulo's subway system connected to an api [...] that tracks if the lines are good to go or if they are delayed

**Response:** there is no official public Metrô status API; the status is published on the official website. Proposed a serverless function in the deployment to fetch it and serve it to the front end, since the browser would block the direct request (CORS).

### 2. Python in the browser — 2026-11-08

> I don't want the function to be primarily cli and want it to work in the browser

**Response:** run the solution's Python package in the browser with Pyodide, copied into `web/public/py/` before every `dev`/`build`.

### 3. Initial structure — 2026-11-08

> can you do the initial scaffolding?

**Response:** Vite + React project with Tailwind CSS v4 configured, Pyodide as a dependency, and `components/`, `hooks/`, `services/` and `lib/` folders separating presentation, state, data access and business rules.

### 4. Bilingual documentation — 2026-11-08

> I want both, make a enUS folder and a ptBR folder for each document and fill them in please

**Response:** every document now exists in `ptBR/` and `enUS/`; the files at the locations the rubrics require hold the English version, which is the source the other copies follow.

### 5. English as the main version — 2026-11-08

> just switch so the main files are in english as this is the files that if needed i will add or change

**Response:** the files at the required locations now hold the English version.

### 6. Python running in the browser, guided — 2026-11-15

> back to pyodide never heard of it what can you tell me?

**Response:** a short explanation of Pyodide (CPython compiled to WebAssembly) and of custom hooks, then one small step at a time: load Pyodide and run `1 + 1`; write the `metro/` files into Pyodide's virtual filesystem (`FS.mkdir`, `FS.writeFile`, `Promise.all` + `map`); load `network.json`; build the graph once and expose a Python function to JavaScript (`pyodide.globals.get`). Each new concept came with a small worked example in an unrelated domain (`useJoke`, `greet.py`, `animals/`), which Raul then mapped onto his own code. The hook `usePyodide` was written by Raul.

### 7. Shared routing helpers — 2026-11-15

> move those for me

**Response:** `Normalize`, `FindNodes` and `BestRoute` were moved from `python/main.py` into `python/metro/routing.py`, so the CLI and the website use the same code. The three reference routes were re-run to confirm nothing changed.

### 8. Components and the first map — 2026-11-15

> so to get done with everything from today all we need now is you map correct?

**Response:** StationPicker and RouteResult were written by Raul (guided: props, controlled inputs, `onSubmit`, lifting state to `App`, `map` for lists). The AI wrote the first map: an SVG drawn from the stations' UTM coordinates, with the route dotted on top.

### 9. Map v2 review — 2026-11-16

> look at the map changes i had fable do it and tell me what do you think

**Response:** Raul had Claude Fable rewrite the map (Leaflet + dark basemap, animations per line status, labels that hide when they overlap). Claude reviewed it: well-built React integration, but it duplicated status logic that Raul was about to write and added an external dependency (the basemap tiles). Decision: keep it, reuse its `statusOf` helper in Raul's components instead of writing a third status parser, and later remove its status legend in favor of Raul's `LineStatusList`.

### 10. Status proxy and live status — 2026-11-16

> this useLineStatus is a new hook than?

**Response:** the AI wrote the infrastructure: `web/api/status.js` (Vercel function that fetches the official page, working around CORS) and a Vite dev proxy for the same URL. Raul wrote `useLineStatus` (fetch → `parseStatus` → `.toJs({ dict_converter: Object.fromEntries })`), changed `usePyodide` to return `{ search, parseStatus }`, and made the Python `search` rebuild the graph with the current status (`.to_py()`). Tested with a fake "Paralisada" on Line 1: Sé → Luz rerouted through Line 3 → República → Line 4.

### 11. Production deploy fixes — 2026-11-16

> ok on my local it is still blank

**Response:** two problems found from the browser console. (1) A missing `line` prop in `LineStatusBadge` broke the whole page; Raul fixed it. (2) In the production build Pyodide could not find its runtime files (`python_stdlib.zip` 404): the AI extended the sync script to copy the Pyodide runtime into `public/pyodide/`, and Raul set `loadPyodide({ indexURL: '/pyodide/' })`.

### 12. Model check against reality — 2026-11-16

> the math s wrong se to brigadeiro is giving around 9 minutes whereas in real life takes approx. 15 min

**Response:** the AI broke the 9.8 min down step by step. Raul noticed that single-line trips match reality and only trips with a transfer come out short; the cause is that a transfer only counts the wait for the next train, not the walk between platforms (except Paulista ↔ Consolação). Recorded as a known limitation.

### 13. Visual styling — 2026-11-16/17

> i want you to take control i want the icon to have circle around it [...] and styalize the input labels please

**Response:** on request, the AI did the visual styling with Tailwind: dark theme, the "Detour" wordmark (Parisienne font), split pill inputs with a round neon search button, a custom icon drawn from Raul's sketch (`StationIcon`), the saved-trips button, a floating route panel (so the map never moves), the route timeline and the line status drawn as one 18-node metro line. Raul defined the layout and the look; the AI wrote the classes and markup, keeping his component logic unchanged.

## Use in the project

| Item | AI's role |
|---|---|
| Vite + React + Tailwind scaffolding | Generated |
| `scripts/sync-python.mjs` (Python package, network data, Pyodide runtime) | Generated |
| Architecture (Pyodide in the browser, serverless status function) | Suggested |
| `hooks/usePyodide.js` | Guided (written by Raul) |
| `hooks/useLineStatus.js` | Guided (written by Raul) |
| `lib/groupRoute.js` | Guided (written by Raul) |
| `StationPicker`, `RouteResult`, `LineStatusBadge`, `LineStatusList` — logic | Guided (written by Raul) |
| The same components — visual styling (Tailwind classes, markup) | Generated on request |
| `App.jsx` — state, search handler, error messages | Guided (written by Raul) |
| `App.jsx` — page layout (header, floating panel, sizes) | Generated on request |
| `MetroMap` v1 (SVG) | Generated (Claude) |
| `MetroMap` v2 (Leaflet), `lib/mapGeometry.js`, `lib/lineStatus.js`, `MetroMap.css` | Generated (Claude Fable, requested by Raul); status legend later removed by Claude |
| `services/networkService.js` | Generated |
| `api/status.js`, Vite dev proxy | Generated |
| `Logo`, `SavedTripsMenu`, `icons/StationIcon` (from Raul's sketch), `icons/BookmarkIcon` | Generated on request |
| `python/metro/routing.py` — `Normalize`, `FindNodes`, `BestRoute` moved from `main.py` | Moved on request |
| Documentation and translation (ptBR/enUS) | Generated |

## Validating the responses

- **Same results as the CLI:** in the browser, Sé → Luz = 206 s (3.4 min), the same as `python/main.py`. Artur Alvim → Paraíso ≈ 35 min and Capão Redondo → Luz ≈ 51 min were re-run after moving the helpers.
- **Status in the routing:** with a fake "Paralisada" on Line 1, Sé → Luz switched to Line 3 → República → Line 4, the route a rider would take in real life.
- **Edge cases:** an unknown station ("xyz") shows "Rota indisponível" instead of crashing; clicking before Pyodide finishes loading shows a loading message.
- **Production:** each fix was checked on the Vercel link, not only locally (blank page, Pyodide 404, map, status list).
- **Model vs. reality:** compared against real trips — single-line trips match; trips with a transfer come out short (see limitations).

Bugs found by testing and fixed:

- A file fetched from a wrong path came back as `index.html` (Vite's fallback) and was written into Pyodide as Python code.
- A relative import (`from .travel_time`) failed until the files were placed in a `metro/` package with `__init__.py`.
- Passing a function to a React state setter made React call it; fixed with `setX(() => fn)`.
- Python results reached React as proxies; fixed with `.toJs()` (and `dict_converter` for dictionaries).
- A missing `line` prop in `LineStatusBadge` blanked the production page.
- Pyodide's runtime files were missing from the production build.

## Critical analysis

**Where the AI helped:** explaining every new concept (custom hooks, effects, Pyodide's filesystem, props, controlled inputs, conditional rendering) with a worked example before Raul applied it, reading his code and pointing at the exact line instead of rewriting it, the infrastructure he hadn't studied yet (serverless function, dev proxy, build scripts), and the visual styling he asked for.

**Where the AI was wrong or needed correcting:**
- Its first map was replaced: Raul had another model build a richer one. The review then had to deal with duplicated status logic.
- It sometimes used terms before explaining them; Raul asked for plainer explanations, and worked examples became the default.
- The deploy problem with Pyodide's runtime files was predictable and was only caught on the first production deploy.

**Limitations of the solution:**
- **Transfers don't include walking time** between platforms (except Paulista ↔ Consolação), so routes with a transfer come out shorter than real trips (Sé → Brigadeiro: 9.8 min vs. about 15 min).
- The first visit downloads about 13 MB of Pyodide; searching only works after it finishes loading.
- The status depends on the HTML of the official page and on Vercel being able to reach it.
- The map background depends on an external tile server (Esri).
- The limitations of the Python model also apply (50% reduced-speed assumption, status per whole line, daily-average stop overhead, straight-line distances).

**Conclusion:** Raul wrote the application's logic — the hooks, the routing integration and the components' behavior — guided one step at a time; the AI wrote the infrastructure, the documentation and, on request, the visual layer. Every change was run in the browser, locally and in production, before being accepted.
