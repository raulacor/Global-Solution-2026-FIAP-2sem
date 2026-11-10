🌐 [Português](ptBR/AI.md) · **English**

# AI Usage — Web Application

## Tools used

| Tool | Purpose |
|---|---|
| Claude (Anthropic) | Mentoring: interpreting the brief, discussing the architecture, hints during development, initial project structure (Vite + React + Tailwind) and documentation |

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

## Use in the project

| Item | AI's role |
|---|---|
| Vite + React + Tailwind scaffolding | Generated |
| `scripts/sync-python.mjs` script | Generated |
| Architecture (Pyodide, serverless status function) | Suggested |
| Documentation translation (ptBR/enUS) | Generated |

## Validating the responses

_in progress — filled in as development continues_

## Critical analysis

_in progress — filled in at the end of the project_
