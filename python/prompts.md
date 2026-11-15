🌐 [Português](ptBR/prompts.md) · **English**

# AI Usage — Python Application

## Tools used

| Tool | Purpose |
|---|---|
| Claude (Anthropic) | Mentoring: reading and interpreting the brief, discussing the idea and the architecture, questions and hints during development, initial repository structure and documentation |

## Prompts used

### 1. Reading the brief — 2026-11-08

> Hey claude, read the pdf and completely understand what is being asked to guide me as we come up and build this solution. [...] You will work as my mentor guiding me same thing as we've been doing this whole semester, but readmes, the scaffolding of the project, gitignores and a 3d model (if we go with my idea) and the prompts.md file is on you.

**Result:** a summary of each course's deliverables, the shared requirements (CitizenTech Sheet, SDGs, real or simulated data) and the 11/19 deadline.

### 2. Solution idea — 2026-11-08

> I wanted to integrate the python with the front end, so i wanted a 2d or 3d map of the whole Sao Paulo's subway system connected to an api [...] that tracks if the lines are good to go or if they are delayed and we can use the differentiated problem solving part to create a calculation to see which path within the subway system is faster.

**Result:** the AI researched and pointed out that Metrô offers no official public status API (the status is published on the "Direto do Metrô" site and by community scraping projects), and that finding the fastest route is a graph problem, not a differential and integral calculus one.

### 3. Real data only — 2026-11-08

> I don't want to use any simulated data can we still make this work as i described and what would you suggest for the differentiated project

**Result:** line status fetched from the official site through a serverless function (working around CORS) and with `urllib` in the CLI; network and stations from public datasets; CRUD operations on records the user creates. For the math, it suggested modeling the train's motion between stations — the computed time becomes the weight of each graph edge.

### 4. Python in the browser — 2026-11-08

> I don't want the function to be primarily cli and want it to work in the browser and we later add a function to make it work as a CLI

**Result:** the logic lives in a Python package with no input/output (`metro/`), run in the browser through Pyodide and imported by the CLI (`main.py`).

### 5. Initial structure — 2026-11-08

> can you do the initial scaffolding?

**Result:** folders, `.gitignore`, READMEs, this file and `AI.md`. The `metro/` modules were created empty, each with only a description of its responsibility.

### 6. Bilingual documentation — 2026-11-08

> I want both, make a enUS folder and a ptBR folder for each document and fill them in please

**Result:** every document now exists in `ptBR/` and `enUS/`; the files at the locations the rubrics require hold the English version, which is the source the other copies follow.

### 7. English as the main version — 2026-11-08

> just switch so the main files are in english as this is the files that if needed i will add or change

**Result:** the files at the required locations now hold the English version.

### 8. Repository scope — 2026-11-08

> You can remove STXD and the pitch from this repo this is only for the source code and math

**Result:** the repository holds only the source code (Python and web) and the math models; the math models are written in Python.

### 9. Data preparation, guided — 2026-11-09/10

> lets code / check it please (series of review requests while writing `data-prep/build_network.py`)

**Result:** the AI first wrote a data-prep script on its own; Raul pointed out that the code was supposed to be his, so it was deleted and he rewrote it himself. Over two sessions the AI guided him with questions and short explanations (GeoPackage as SQLite, reading the geometry blob with `struct`, UTM coordinates in meters, Pythagoras for distances, `sort(key=...)`, `json.dump` options). On Raul's explicit request, the AI supplied the final sorting lines (sort Line 1 by Y, the others by X). The output is `python/data/network.json`: 93 stations and 87 neighbor distances.

### 10. Python core design and real data — 2026-11-13

> lets tackle what we have to tackle today / what about the other line? isn't there another one missing

**Result:** guided design of `metro/`. Raul decided on one graph node per (station, line) so line changes can carry a cost. Transfer cost = half the headway of the line being boarded (the AI explained the average-wait reasoning). Real values were researched together: headways from Metrô's CSV, the ViaQuatro infographic (Line 4) and Metrô's 2019 report (Line 5, found by Raul); end-to-end times for Lines 4 and 5 (Raul found the 21–25 min and 36 min figures; the AI found the operator's 20 min); the Paulista↔Consolação tunnel crossing (8 min 20 s, Metrô/ViaQuatro average). Raul wrote `travel_time.py`.

### 11. Graph builder — 2026-11-13

> check it please / take control and fix it please

**Result:** Raul wrote `BuildGraph` with step-by-step hints (adjacency dict, `setdefault`, tuple edges). On explicit request, the AI fixed two lines (the `return` indentation and the data path). The AI created `check_core.py`, a runnable test bench, after Raul couldn't run package modules with VS Code's ▶ button.

### 12. Dijkstra — 2026-11-13

> check please (series of reviews)

**Result:** Raul wrote `FastestRoute` (relaxation rule derived by him through questions; `heapq` explained in a mini-lesson) and the path rebuild from `prev`. Verified: Artur Alvim → Paraíso = 2110.7 s with a transfer at Sé; Capão Redondo → Luz ≈ 51 min, close to the World Bank's ~50 min Capão→Sé.

### 13. Unit annotations — 2026-11-13

> can you add the units next to the numbers that we already did? this way i will have an example on how to start doing that from now on

**Result:** the AI added unit comments (`[m]`, `[s]`, `[m/s]`, unit algebra) to the three core files, without changing any logic.

### 14. Line status parser — 2026-11-14

> check my progress please (series of reviews)

**Result:** Raul wrote `LineStatusParser` (an `HTMLParser` subclass) from a skeleton and hints, and found real examples of every non-normal status on the Wayback Machine; the AI saved them as test files in `data-prep/raw/`. On request, the AI renamed the parser methods back to the names `HTMLParser` requires, and supplied the final `ParseStatus` lines that return status + description.

### 15. Status-aware routing — 2026-11-14

> lets tackle the color sitch / so for paralisada we don't need to remove the edge can't we just add a factor of zero?

**Result:** the AI showed that Metrô publishes no speed figure for "Velocidade Reduzida", so the reduction is a documented assumption (`REDUCED_SPEED_FACTOR = 0.5`). Raul chose it, wrote the `factor` parameter in `SegmentTime` and wired the statuses into `BuildGraph`; closed lines lose their edges (a factor of 0 would divide by zero). Raul argued that per-line slowdowns are realistic because of train bunching.

### 16. CLI route option — 2026-11-14

> can you do that im too tired now

**Result:** Raul built the menus (`while` + `match/case`) and the status option. On explicit request, the AI wrote `Normalize`, `FindNodes`, `BestRoute` and `PrintRoute` in `main.py` and wired them into the route option.

## Features developed, suggested or modified with AI

| Item | AI's role |
|---|---|
| Core (`metro/`) × CLI (`main.py`) split | Suggested |
| Folder structure, READMEs, `.gitignore` | Generated |
| Documentation translation (ptBR/enUS) | Generated |
| `data-prep/build_network.py` | Guided (written by Raul); final sort lines supplied by the AI on request |
| `metro/travel_time.py`, `metro/routing.py` | Guided (written by Raul) |
| `metro/network.py` | Guided (written by Raul); two-line fix by the AI on request |
| `metro/line_status.py` | Guided (written by Raul); method rename and `ParseStatus` return supplied by the AI on request |
| Unit comments in `metro/` | Generated on request |
| `check_core.py` (test bench) | Generated |
| `main.py` menus and status option | Guided (written by Raul) |
| `main.py` `Normalize`, `FindNodes`, `BestRoute`, `PrintRoute` | Generated on request |
| Status test files in `data-prep/raw/` | Found by Raul (Wayback Machine), saved by the AI |

## Verification, testing and adjustments

_in progress — filled in as development continues_

## Critical analysis

_in progress — filled in at the end of the project_
