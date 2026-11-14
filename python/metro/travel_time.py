"""Tempo de viagem entre duas estações vizinhas.

Modelo de movimento do trem (aceleração, cruzeiro, frenagem) vindo da
disciplina Differentiated Problem Solving (ver math/).
"""

import math


a = 1.1  # acceleration     [m/s²]  (Metrô spec)
b = 1.2  # braking rate     [m/s²]  (Metrô spec)

# Per-stop overhead [s] = (real time [s] − model time [s]) / segments, from math/models/validation.py
OVERHEAD = {
    "AZUL": 49.8,
    "VERDE": 55.2,
    "VERMELHA": 69.2,
    "AMARELA": 45.1,
    "LILAS": 63.4,
    "PRATA": 60.3,
}  # values in [s]

# Minimum headway [s] = seconds between trains. Lines 1, 2, 3, 15: Metrô "oferta" CSV, Sep 2026.
# Line 4: ViaQuatro/Motiva infographic. Line 5: Metrô Relatório Integrado 2019 (via Via Trolebus).
HEADWAY = {
    "AZUL": 131,
    "VERDE": 127,
    "VERMELHA": 132,
    "PRATA": 170,
    "AMARELA": 106,
    "LILAS": 171,
}  # values in [s]


def GetCruiseSpeed(line):
    """Top speed of a line. Returns v [m/s]."""
    match line:
        case "AZUL" | "VERMELHA":
            speedKM = 87          # [km/h]
            v = speedKM / 3.6     # [km/h] ÷ 3.6 → [m/s]
            return v
        case "PRATA":
            speedKM = 83          # [km/h]
            v = speedKM / 3.6     # [km/h] ÷ 3.6 → [m/s]
            return v
        case _:
            speedKM = 80          # [km/h]
            v = speedKM / 3.6     # [km/h] ÷ 3.6 → [m/s]
            return v



def TravelTime(d, v, a, b):
    """Moving time between two stations.

    d [m], v [m/s], a [m/s²], b [m/s²]  →  returns [s]
    """
    # [m/s]² / [m/s²] = [m²/s²] · [s²/m] = [m]  → switch is a distance
    switch = v**2/(2*a) + v**2/(2*b)
    if d >= switch:
        # [m]/[m/s] = [s]   and   [m/s]/[m/s²] = [s]  → every term is a time
        trapezoidTravel = d/v + v/(2*a) + v/(2*b)
        return trapezoidTravel
    else:
        vPeak = math.sqrt(d/(1/(2*a) + 1/(2*b)))   # √([m]·[m/s²]) = √[m²/s²] = [m/s]
        triangleTravel = vPeak/a + vPeak/b         # [m/s]/[m/s²] = [s]
        return triangleTravel


def TransferTime(line):
    """Average wait for the line you board. Returns [s]."""
    transferTime = HEADWAY[line] / 2   # [s] / 2 = [s]  (arrive at a random moment → wait half the gap)
    return transferTime


def SegmentTime(d, line):
    """Real-world time between two neighbouring stations. d [m] → returns [s]."""
    v = GetCruiseSpeed(line)               # [m/s]
    time = TravelTime(d, v, a, b)          # [s]  moving
    segmentTime = time + OVERHEAD[line]    # [s] + [s] = [s]  (you can only add same units)
    return segmentTime
