# Pickup — GS 2026.2 CitizenTech: São Paulo Metro app

> Handoff/context file to resume the project in a fresh chat.
> Everything below is what was decided and built so far. Teaching mode is ON:
> Raul writes all the code; Claude mentors Socratically and handles scaffolding,
> READMEs, `.gitignore`, `prompts.md`/`AI.md`, translations, and the map component
> (stand-in for the 3D model).

---

## 1. The assignment

- **Course:** FIAP Global Solution 2026.2 — "CitizenTech" — Engenharia de Software, 1º ano (Paulista/Lins).
- **Deadline:** 19/11/2026, 23h55. Doing it **solo**.
- **Theme:** "CitizenTech da Minha Cidade" — pick a real problem in São Paulo and build a small working prototype that helps a real person.
- **Disciplines in scope (6 — Edge Computing/Sensor is SKIPPED):**
  1. Computational Thinking with Python — *Lógica*
  2. Differentiated Problem Solving — *Matemática* (limits, derivatives, integrals)
  3. Front-end Design — *Interface* (React/Vite/Next + Tailwind)
  4. Web Development — *Interação* (same React app, submitted separately)
  5. Software & Total Experience Design (STXD) — *Experiência* (slides)
  6. Storytelling & Inspiração Empreendedora — *Pitch* (≤3min video + brand email)

### Rubric essentials
- **Python:** menu, input validation, `try/except`, `if/elif/else` + `match/case`, `while` + `for`, functions w/ params & return, lists/tuples/dicts, **JSON persistence**, only course-level libs. Deliver ZIP with `.py` + `readme.md` + `prompts.md`. Wrong format = −10.
- **Math:** `.py` files + **PDF technical report** (problem, model, limits/derivatives/integrals, interpretation).
- **Front-end + Web Dev (same app, 2 submissions):** React (Vite or Next), **Tailwind**, ≥8 components, `useState`+`useEffect`, ≥2 **custom hooks**, logic/data separated from presentation, **external API with full CRUD**, ≥15 meaningful commits, deploy link, ZIP, README, **AI.md**, private GitHub repo with write access for both professors.
- **STXD slides:** cover (names+RM), problem, scope (in/out), RF/RNF/RN with justification, use-case diagram, mid-fi prototype + heuristics + tone of voice, roadmap.
- **Pitch:** YouTube video ≤3min (face+voice+slides, 9 beats) + a document with a simulated investor email explaining the brand archetype (mission/vision/values).
- **Common to all:** fill the "Ficha da CitizenTech" at the top of the README; **real or public data only** (we chose real); connect to the UN SDGs (ODS) and explain how.

---

## 2. The initial prompt (verbatim intent)

Raul asked Claude to read the assignment PDF, understand it, and mentor him through building it the same way all semester. Claude owns: READMEs, project scaffolding, `.gitignore`s, a 3D model (if the idea needs one), and `prompts.md`. Edge Computing/Sensor is skipped entirely. Raul is also handling a separate cybersecurity final at the same time.

---

## 3. The idea

A **2D map of the São Paulo Metro network** that shows each line's **real operating status** and, when the user picks an origin and destination, draws the **fastest route** as a dotted path.

**Problem (near-final sentence):** a daily metro passenger, standing at a station on a bad day, can't tell **where** the system is slow or stopped, so they can't choose a faster way around it and lose more time than they have to.
(Last wording to finalize — swap "I" for "a daily metro passenger" and add the moment they're deciding. The *who* is already in the README Ficha: "Passageiro que depende do metrô no dia a dia".)

---

## 4. Decisions we agreed on

- **Real data only** — no simulated data.
- **Six metro lines only** (1-Azul, 2-Verde, 3-Vermelha, 4-Amarela, 5-Lilás, 15-Prata). **CPTM trains excluded.**
- **2D map** (not 3D).
- **CRUD** runs on the user's own records (real data, since users create them). Choose **later** between **saved trips** vs **crowding/incident reports**, picking the easier one based on time left.
- **One shared Python core** in `python/metro/` with **no I/O** (no input/print/file access): runs in the browser via **Pyodide** and is imported by the CLI. A build script copies it into the web app before dev/build.
- **CLI is required** (not optional) — the Python rubric grades its menu/validation/persistence.
- **Docs:** English files are the source of truth; `ptBR/` and `enUS/` folders mirror each doc. Rubric-required copies (root `README.md`, `AI.md`, `python/README.md`, `python/prompts.md`) sit at their required paths.
- **Repo scope:** source code + math only. STXD and pitch are **not** in the repo (`docs/` was removed).
- **Map component:** Claude may build just the map (as the stand-in for the dropped 3D model), or it could be delegated to Fable; **TBD**. Everything in `AI.md` honestly.
- **Pitch is last**, after the app is 100% working.
- **Name / ODS / impact indicator:** still TBD (deciding as we go).

---

## 5. Real data sources (confirmed)

- **Stations & line tracks:** **GeoSampa** (Prefeitura de SP), obtained via `viniciusoike/metrosp` (MIT), snapshot 2024-11-26. Raw GeoPackage files live in `data-prep/raw/`.
  - Known gap: GeoSampa snapshot has no point for Line 15 station **Jardim Colonial**, so Line 15 ends at São Mateus.
- **Commercial speed & min headway per line:** Metrô Transparency Portal "oferta" dataset (`transparencia.metrosp.com.br`), lines 1/2/3/15 only. Raw CSV in `data-prep/raw/metro_sp_service_current.csv`.
- **Live line status:** official "Direto do Metrô" embed page
  `https://www.metro.sp.gov.br/wp-content/themes/metrosp/direto-metro.php?embed=1`
  Shows each line's status (e.g. "Operação Normal", "Velocidade Reduzida"). Also lists Line 17-Ouro (Operação Transitória) which we exclude.
  - Browser: fetch via a **serverless function on Vercel** (CORS workaround), returns JSON.
  - CLI: fetch with stdlib `urllib` + parse with `html.parser`.
  - On fetch failure: show the **last real status with its timestamp** (still real data).

### Train constants (published Metrô specs, for the math model)
- Acceleration **a = 1.1 m/s²**; service deceleration **b = 1.2 m/s²**.
- Max/cruise speed per line (km/h): **1=87, 2=80, 3=87, 15=83, 4=80, 5=80**. Convert to m/s by `÷ 3.6`.

---

## 6. Tech stack & repo layout

**Stack:** React + Vite + Tailwind CSS v4 + Pyodide. `web/scripts/sync-python.mjs` copies `python/metro` → `web/public/py/` before every `dev`/`build` (the generated `web/public/py/` is gitignored).

```
python/          Logic (Computational Thinking with Python)
  metro/         shared core, NO I/O: network.py, travel_time.py, line_status.py, routing.py, __init__.py
  main.py        CLI menu (to build)
  data/          network.json (generated)
  README.md, prompts.md, ptBR/, enUS/
math/            Differentiated Problem Solving
  models/        travel_time_model.py (+ future derivative/limits/validation)
  report/        PDF technical report (to write)
  README.md, ptBR/, enUS/
web/             Interface + Interaction (React app) — components/ hooks/ services/ lib/
  README.md, AI.md, ptBR/, enUS/, scripts/sync-python.mjs
data-prep/       one-off: build_network.py + raw/ (GeoPackage + service CSV)
assets/3d/       (map stands in for the 3D model)
README.md        root — has the Ficha da CitizenTech
AI.md            AI usage for the web side
.gitignore
```

**Git:** remote `github.com/raulacor/Global-Solution-2026-FIAP-2sem`.
Branches used: `feat/data-prep-stations` (merged to `main`), `feat/math-travel-time-model`.
(Early snag already fixed: `web/` had its own nested `.git`; now tracked as a normal folder.)

---

## 7. What's built so far

### `data-prep/build_network.py` → `python/data/network.json` ✅
- Opens the GeoPackage with `sqlite3` (a `.gpkg` is a SQLite DB); reads each station's point from the `geom` **blob** with `struct.unpack` (last 16 bytes = two little-endian doubles = X,Y).
- **Coordinates are UTM meters (EPSG:31983 / SIRGAS 2000 zone 23S), kept as `x`/`y`** — good for distances and a schematic map. **NOTE: not yet converted to lat/lon** — decide later if the web map needs real lat/lon.
- Groups stations by line into a dict; **dedupes** repeated station rows (GeoSampa lists Vila Mariana twice on Line 1); **sorts each line into riding order** (AZUL by `y` descending, every other line by `x` ascending).
- Computes **neighbor distances** with Pythagoras (`math.hypot`).
- Writes one JSON: `{"stations": {LINE: [ {name,line,x,y}... ]}, "neighbors": {LINE: [ {station,next_station,distance_between}... ]}}`.
- Result: **93 stations, 87 neighbor distances.** (e.g. Artur Alvim→Corinthians-Itaquera = 1397.5 m.)

### `math/models/travel_time_model.py` ✅ (trip-time model)
- `GetDistance(station, line)` → reads `network.json`, returns `(distance, cruise_speed_m_s)` for the pair starting at `station` on `line`. Uses the line key directly (one loop), so same-named stations on different lines don't collide.
- Nested `GetCruiseSpeed(line)` uses `match/case`: AZUL/VERMELHA 87, PRATA 83, else 80 km/h, all `÷ 3.6`.
- `TravelTime(d, v, a, b)` with `a=1.1, b=1.2`. Velocity profile = trapezoid (accelerate → cruise → brake):
  - **Trapezoid (reaches cruise):** `T = v/a + v/b + (d - v²/(2a) - v²/(2b)) / v`
  - **Switch distance:** `v²/(2a) + v²/(2b)` (~509 m at 87 km/h).
  - **Triangle (too short to reach cruise):** `vPeak = sqrt( d / (1/(2a) + 1/(2b)) )`, then `T = vPeak/a + vPeak/b`.
  - Verified: Artur Alvim→Corinthians = **78.9 s**; the two formulas meet **continuously** at the switch (~42.1 s at 509 m) — that's the "limits" section of the math report.

### Session 2026-11-11 (math: derivative + start of validation)
- **Trapezoid simplified** (Raul) to `T = d/v + v/(2a) + v/(2b)` — now in `TravelTime`. Same 78.9 s.
- **`TravelTimeDerivative(d, v, a, b)`** added:
  - Trapezoid branch: `dT/dv = -d/v² + 1/(2a) + 1/(2b)`.
  - Triangle branch (`d < switch`): returns **0** — `vPeak` never uses `v`, so lowering the cruise limit costs nothing on short hops.
  - Removed `global switch`; each function computes its own `switch` from its own params.
  - Checked: d=400 m @87 km/h → T = 37.3 s (triangle), dT/dv = 0.
- **Findings for the report:**
  - Artur Alvim: dT/dv ≈ −1.52 s per m/s → **≈0.43 s per km/h** (divide by 3.6).
  - Setting dT/dv = 0 gives exactly the `vPeak` expression → the derivative marks the **same switch boundary** as the limits section.
  - Nonlinearity: 87→60 km/h, linear estimate 27 × 0.43 ≈ 11.6 s, actual `TravelTime(60/3.6)` − 78.9 = **19.5 s** (98.4 − 78.9). `d/v²` grows as v drops. Raul's conclusion sentence: *"every stacked additional km/h adds progressively more time to the journey."*
- **Validation, started:**
  - Model avg on Artur Alvim segment = 63.8 km/h vs CSV `speed` for Line 3 (Sep 2026) = **32 km/h** → real segment ≈ 157 s vs model 78.9 s.
  - Gap explained by **dwell time** (~40 s per Raul's experience) **+ cruise slower than 87** in practice.
  - CSV `speed` (Sep 2026): Azul 30, Verde 32, Vermelha 32, Prata 35 km/h. The column just says `speed`; **confirm on the Portal's "oferta" dataset that it's "velocidade comercial"** before citing. Metrô's 2026 system sheet lists max speeds 87/80/87/83.
  - Agreed method: per line, `real = total_distance / (csv_speed/3.6)`, `model = LineRunningTime(line)` (sum of `TravelTime` per segment, using `GetCruiseSpeed`). Spread `(real − model)` across stops as a **per-stop overhead** → calibrated with real data, model still handles per-segment shape + status.
  - Reference (Claude's check, for Raul to reproduce): Vermelha 17 segments, 21,571 m, model ≈1251 s.
- ⚠️ `travel_time_model.py` had **uncommitted changes** at end of session — commit first. Also the test calls currently use `17` instead of `60/3.6`.

---

## 8. Gameplan (agreed 2026-11-11) — due Thu 19/11 23:55

| Day | Work |
|---|---|
| Thu 12 | **Math code:** write `LineRunningTime(line)` (loop over `neighbors[line]`) → per-stop overhead for lines 1/2/3/15; integral check (area under v(t) = d); plots. Merge branch. |
| Fri 13 | **Python core:** `network.py` adjacency, `travel_time.py`, `routing.py` Dijkstra (reduced → lower v; paralisada → drop edges), `line_status` parser. |
| Sat 14 | **CLI `main.py`:** menu, validation, try/except, match, JSON persistence. Zip Python deliverable. |
| Sun 15 | **Web:** components, map (Claude builds), Pyodide routing hook. |
| Mon 16 | **Web:** Vercel status fn + `useLineStatus`, CRUD on MockAPI + `useSavedTrips`, deploy. |
| Tue 17 | **Math PDF report**; web README/AI.md; professors added to repo; ≥15 commits. |
| Wed 18 | **STXD slides** + pitch script. |
| Thu 19 | Record pitch, brand email, ZIPs, **submit by afternoon**. |

**Decided:** CRUD = **saved trips** (same record the CLI persists). **Pyodide fallback:** if routing isn't running in the browser by end of Sunday, port Dijkstra to JS.
**No slack for the cybersecurity final** — if it eats a day, cut map polish first, never CLI or CRUD.

**Start tomorrow at:** writing `LineRunningTime(line)`; first run `len(networkDict["neighbors"]["VERMELHA"])` (expect 17 — each pair listed once, so no double counting).

### Still to decide
- CitizenTech **name**; final **one-sentence problem**; **ODS** list; **impact indicator**; **UTM→lat/lon** for the web map.

---

## 10. Progress 2026-11-12 → 11-13 (read this first)

**Deadline moved: submit EVERYTHING by Wed 18/11 (evening).** Cybersecurity is done (graduated) → more time.

### Math ✅ (merged to main, PR #2)
- `math/models/`: `travel_time_model.py` (core + `TravelTimeDerivative` + `VelocityAt`), `validation.py` (LineRunningTime/LineRealTime/LineOverhead), `integral.py` (∫v dt = d, dt convergence), `plots.py` → `math/plotOutputs/` (velocity_profile, travel_time_vs_top_speed, travel_time_vs_distance).
- PDF report written (PT). **Pending fixes:** Fonte column in data table; commas not dots in tables; PT labels on figures; "(2024)" on Sé numbers; appendix listing .py files; add Line 4/5 speed sources + limitations (straight-line distances, daily-average overhead).
- CSV `speed` = "velocidade comercial" — **confirmed** (Metrô Infraestrutura 2018 sheet row label).

### Real data per line (all six now real)
| Line | Commercial speed | Overhead/stop | Headway | Source notes |
|---|---|---|---|---|
| Azul | 30 | 49.8 s | 131 s | CSV Sep 2026 |
| Verde | 32 | 55.2 s | 127 s | CSV |
| Vermelha | 32 | 69.2 s | 132 s | CSV |
| Prata | 35 | 60.3 s | 170 s | CSV |
| Amarela | 37.1 | 45.1 s | 106 s | ViaQuatro/Motiva infographic: 20 min Luz→Vila Sônia, 106 s headway |
| Lilás | 31.0 | 63.4 s | 171 s | 36 min timed trip (Mobilidade Sampa 2018); headway Metrô Relatório Integrado 2019 via Via Trolebus |
- Paulista↔Consolação tunnel: 500 s (Metrô/ViaQuatro average 8 min 20 s; new tunnel due 2027).

### Python core (branch `feat/python-core`) ✅
- `metro/travel_time.py`: a, b, OVERHEAD, HEADWAY, GetCruiseSpeed, TravelTime, `TransferTime(line)` = headway/2 of line boarded, `SegmentTime(d, line)` = TravelTime + overhead. Unit comments added.
- `metro/network.py`: `BuildGraph(network)` → nodes = (station, line); 93 nodes, 192 edges; 8 same-name transfers + Paulista(AMARELA)↔Consolação(VERDE).
- `metro/routing.py`: `FastestRoute(graph, start, goal)` → (seconds, path) via Dijkstra/heapq. Artur Alvim→Paraíso = 2110.7 s via Sé transfer; Capão Redondo→Luz ≈ 51 min (World Bank says ~50 min Capão→Sé).
- `python/check_core.py`: runnable test bench (▶ works). Run package modules as `cd python && python3 -m metro.network`.

### Revised plan
| Day | Work |
|---|---|
| Sat 14 | `line_status.py` (parse Direto do Metrô → {line: status}) + status-aware routing (Velocidade Reduzida lowers v; Paralisada removes line edges) + **CLI main.py** + Python ZIP |
| Sun 15 | Web: components, map (Claude), Pyodide routing hook |
| Mon 16 | Vercel status fn + useLineStatus, CRUD saved trips + useSavedTrips, deploy (Root Directory = web) |
| Tue 17 | Web README/AI.md, ≥15 web commits, profs as collaborators (write access) · math PDF fixes · STXD slides |
| Wed 18 | Pitch video + brand-archetype email (2.5/10 pts; needs name, mission, vision, values) · ZIPs · submit |
- Cut order if behind: map polish → extra components. Never cut CLI persistence, CRUD, deploy.
- Decided: CRUD = saved trips. Mono-repo OK.
- Still open: name, mission/vision/values, archetype, ODS, impact indicator.

### Learning notes (Raul asked)
Run before answering (check_core.py) · write units next to numbers · treat examples as patterns, not paste.

---

## 9. Working style reminder
- Teaching mode ON across all domains; **Raul writes the code**, Claude guides with one pointed idea at a time.
- Claude handles: scaffolding, READMEs, `.gitignore`, `prompts.md`/`AI.md`, translations (en source → ptBR/enUS), and the map component.
- Session reminders were set for **11:30** and **16:00**.
