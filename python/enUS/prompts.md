🌐 [Português](../ptBR/prompts.md) · **English**

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

## Features developed, suggested or modified with AI

| Item | AI's role |
|---|---|
| Core (`metro/`) × CLI (`main.py`) split | Suggested |
| Folder structure, READMEs, `.gitignore` | Generated |
| Documentation translation (ptBR/enUS) | Generated |

## Verification, testing and adjustments

_in progress — filled in as development continues_

## Critical analysis

_in progress — filled in at the end of the project_
