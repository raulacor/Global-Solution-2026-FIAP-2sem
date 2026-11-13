"""Tempo de viagem entre duas estações vizinhas.

Modelo de movimento do trem (aceleração, cruzeiro, frenagem) vindo da
disciplina Differentiated Problem Solving (ver math/).
"""

import math


a = 1.1 ## Acceleration
b = 1.2 ## Break rate

# Per-stop overhead (s) = (real time − model time) / segments, from math/models/validation.py
OVERHEAD = {
    "AZUL": 49.8,
    "VERDE": 55.2,
    "VERMELHA": 69.2,
    "AMARELA": 45.1,
    "LILAS": 63.4,
    "PRATA": 60.3,
}


def GetCruiseSpeed(line):
    match line:
        case "AZUL" | "VERMELHA":
            speedKM = 87
            v = speedKM / 3.6
            return v
        case "PRATA":
            speedKM = 83
            v = speedKM / 3.6
            return v
        case _:
            speedKM = 80
            v = speedKM / 3.6
            return v



def TravelTime(d, v, a, b):
    switch = v**2/(2*a) + v**2/(2*b)
    if d >= switch:
        trapezoidTravel = d/v + v/(2*a) + v/(2*b)
        return trapezoidTravel
    else:
        vPeak = math.sqrt(d/(1/(2*a) + 1/(2*b)))
        triangleTravel = vPeak/a + vPeak/b
        return triangleTravel


def SegmentTime(d, line):
    v = GetCruiseSpeed(line)
    time = TravelTime(d, v, a, b)
    segmentTime = time + OVERHEAD[line]
    return segmentTime
