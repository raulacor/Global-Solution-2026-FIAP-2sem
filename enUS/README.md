🌐 [Português](../ptBR/README.md) · **English**

# CitizenTech — São Paulo Metro

> Global Solution 2026.2 · FIAP · Software Engineering · 1st year

## CitizenTech Sheet

| Field | Content |
|---|---|
| **CitizenTech name** | _TBD_ |
| **City and neighborhood** | São Paulo — Metro network |
| **Citizen served** | Commuters who depend on the metro every day |
| **Problem, in one sentence** | _TBD_ |
| **How it works** | A map of the metro network showing each line's real operating status; the user picks an origin and a destination and sees the fastest route drawn on the map |
| **What each part does** | See [Repository structure](#repository-structure) |
| **Repository link** | _TBD_ |
| **Impact indicator** | _TBD_ |
| **Connected SDGs** | _TBD_ |

**Data:** real, public data only.
- Stations and tracks: GeoSampa (Prefeitura de São Paulo), snapshot of 2024-11-26
- Commercial speed and minimum headway per line: Metrô's Transparency Portal, "oferta" dataset (lines 1, 2, 3 and 15)
- Both obtained through [viniciusoike/metrosp](https://github.com/viniciusoike/metrosp) (MIT license)
- Live line status: Direto do Metrô (to be added)

## Repository structure

```
python/          Logic — Computational Thinking with Python
  metro/         shared core (network, travel time, status, routing)
  main.py        menu-driven CLI
  data/          real data used by the application
data-prep/       one-off script that turns the raw public data into python/data/network.json
math/            Math — Differentiated Problem Solving
  models/        Python models and plots
  report/        technical report (PDF)
web/             Interface + Interaction — Front-end Design and Web Development
  src/components React components
  src/hooks      custom hooks
  src/services   data and API access
  src/lib        front-end business rules
assets/3d/       3D model of the map
AI.md            AI usage (Front-end / Web Development)
ptBR/ · enUS/    every document in both languages (in every folder)
```

The `python/metro` package is the same logic on both ends: the CLI imports it directly, and the browser runs it through [Pyodide](https://pyodide.org).

## How to run

**Web**

```bash
cd web
npm install
npm run dev
```

**CLI**

```bash
cd python
python3 main.py
```

## Author

Raul Azzi Corsi — RM569022
