🌐 [Português](../ptBR/README.md) · **English**

# Detour — São Paulo Metro · Python Application

**Computational Thinking with Python** deliverable (GS 2026.2).

## Description

Detour is the app that helps you find the best way around the subway. It covers the six São Paulo metro lines (1-Azul, 2-Verde, 3-Vermelha, 4-Amarela, 5-Lilás, 15-Prata) and offers three features:

- **Line status:** the real, live status of each line, read from Metrô's official "Direto do Metrô" page.
- **Fastest route:** the shortest-time trip between two stations (Dijkstra's algorithm). It takes today's status into account: lines with reduced speed or partial operation count as slower, and stopped lines are removed from the network.
- **Saved trips:** save an origin/destination pair under a name, then list, rename or delete it. Saved trips are stored in JSON and stay saved between runs.

The time between two stations comes from the math model of the train's motion (accelerate → cruise → brake), calibrated against Metrô's published commercial speeds. See `math/` for that model.

## Structure

```
metro/              core with no input/output (also runs in the browser via Pyodide)
  travel_time.py    time between stations, transfer time (half the headway)
  network.py        builds the graph: one node per (station, line)
  routing.py        Dijkstra: fastest route
  line_status.py    reads the line status from the official page's HTML
main.py             options menu (CLI)
storage.py          reads and writes the saved trips (JSON)
check_core.py       offline test bench for the core
data/
  network.json      real stations and distances (built in data-prep/)
  saved_trips.json  saved trips (created automatically)
prompts.md          AI usage during development
```

## How to run

Requires **Python 3.10+** (it uses `match/case`) and no external libraries.

```bash
cd python
python3 main.py
```

Options 1 and 2 need an **internet connection**, because they read the live status from the Metrô site. Without one, the program shows "Você precisa estar conectado à internet." and returns to the menu.

To check the core without internet (the graph and the status parser on real saved pages):

```bash
python3 check_core.py
```

## Menu

```
1. Ver status das linhas      → check one line by number, or list all lines
2. Calcular rota mais rápida  → type the origin and destination (accents and case don't matter)
                                and save the trip if you want
3. Viagens salvas             → list, rename or delete saved trips
0. Sair
```

Example: `artur alvim` → `paraiso` gives about 35 min (Line 3 to Sé, then Line 1).

## Author

Raul Azzi Corsi — RM569022
