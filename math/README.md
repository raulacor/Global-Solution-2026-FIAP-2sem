🌐 [Português](ptBR/README.md) · **English**

# CitizenTech — São Paulo Metro · Mathematical Modeling

**Differentiated Problem Solving** deliverable (GS 2026.2).

A model of the train's motion between two stations (acceleration, cruise, braking), using limits, derivatives and integrals to compute the travel time that feeds the application's route calculation.

```
models/          Python implementations and plots
report/          technical report (PDF)
```

## The model

Train motion between two stations follows a trapezoidal velocity profile: accelerate at `a`, cruise at `v`, brake at `b`. All three inputs are published Metrô figures: `a = 1.1 m/s²`, `b = 1.2 m/s²`, and the line's top speed (87 km/h on Azul and Vermelha, 83 on Prata, 80 on the rest).

| Case | Condition | Travel time |
|---|---|---|
| Trapezoid (reaches cruise) | `d ≥ v²/(2a) + v²/(2b)` | `T = d/v + v/(2a) + v/(2b)` |
| Triangle (too short to cruise) | `d < v²/(2a) + v²/(2b)` | `v_peak = √(d / (1/(2a) + 1/(2b)))`, `T = v_peak/a + v_peak/b` |

Example: Artur Alvim → Corinthians-Itaquera (Line 3, 1397.5 m) takes **78.9 s**.

## Limits

The switch distance `v²/(2a) + v²/(2b)` is about 509 m at 87 km/h. Approaching it from either side, both formulas tend to the same value (about 42.1 s), so `T(d)` is **continuous** at the switch.

## Derivative — what "Velocidade Reduzida" costs

```
dT/dv = −d/v² + 1/(2a) + 1/(2b)      (trapezoid)
dT/dv = 0                             (triangle: v_peak does not depend on v)
```

- Artur Alvim → Corinthians: `dT/dv ≈ −1.52 s per m/s`, which is **≈ 0.43 s per km/h** lost (÷ 3.6).
- Setting `dT/dv = 0` gives exactly the `v_peak` expression, so the derivative marks the same boundary as the limits section.
- **Nonlinearity:** cutting the speed from 87 to 60 km/h, the linear estimate is 27 × 0.43 ≈ 11.6 s, but the real difference is **19.5 s** (98.4 − 78.9). The `d/v²` term grows as `v` drops: *every stacked additional km/h lost adds progressively more time to the journey.*

## Validation against Metrô data

Model running time for each line (sum of `T` over every segment) compared with the time implied by Metrô's published commercial speed (Sep 2026). The difference, spread evenly across segments, is the **per-stop overhead**: time spent at platforms plus running below top speed. The model leaves out both.

| Line | Commercial speed | Overhead per stop |
|---|---|---|
| 1-Azul | 30 km/h | 49.8 s |
| 2-Verde | 32 km/h | 55.2 s |
| 3-Vermelha | 32 km/h | 69.2 s |
| 15-Prata | 35 km/h | 60.3 s |

Line 3-Vermelha: 2427 s real vs 1251 s model, so 1176 s are missing across 17 segments.

**Interpretation:** the overhead is highest on Line 3-Vermelha, the line Metrô itself identifies as having the most concentrated passenger flow. Sé, where Lines 1 and 3 meet, is the system's busiest station, and more of its passengers are on Line 3 (~199k/day) than on Line 1 (~169k/day). Crowding stretches the time at each platform. In routing, every segment weight becomes `T + overhead(line)`, so absolute times are calibrated with real data while the model still captures per-segment shape and the effect of reduced speed.

**Sources:** Metrô Transparency Portal ("oferta" dataset; system and planning reports); Gazeta SP (Sé station figures); Diário do Transporte (Line 3 incident, 07/09/2026).

## Author

Raul Azzi Corsi — RM569022
