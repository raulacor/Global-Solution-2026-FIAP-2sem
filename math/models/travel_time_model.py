import json
import math

a = 1.1 ## Acceleration
b = 1.2 ## Break rate

# Metrô Transparency Portal, "oferta" dataset — data-prep/raw/metro_sp_service_current.csv, Sep 2026
COMMERCIAL_SPEED_KMH = {"AZUL": 30, "VERDE": 32, "VERMELHA": 32, "PRATA": 35}

with open("../../python/data/network.json", 'r') as network:
    data = json.load(network)
    networkDict = data


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


def GetDistance(station:str, line:str):
    for s in networkDict["neighbors"][line]:
        if s["station"] == station:
            distanceValue = float(s["distance_between"])

            return distanceValue

def TravelTime(d, v, a, b):
    switch = v**2/(2*a) + v**2/(2*b)
    if d >= switch:
        trapezoidTravel = d/v + v/(2*a) + v/(2*b)
        return trapezoidTravel
    else:
        vPeak = math.sqrt(d/(1/(2*a) + 1/(2*b)))
        triangleTravel = vPeak/a + vPeak/b
        return triangleTravel


def TravelTimeDerivative(d, v, a, b):
    """
    Every stacked addtional km/h adds progressively more time to the journey
    """
    switch = v**2/(2*a) + v**2/(2*b)
    if d >= switch:
        dT_dv = -d / v**2 + 1 / (2*a) + 1 / (2*b)
    else:
        return 0
    return dT_dv


def LineRunningTime(line:str, v, a, b):
    totalTime = 0
    for s in networkDict["neighbors"][line]:
        distanceValue = float(s["distance_between"])
        totalTime += TravelTime(distanceValue, v, a, b)
    return totalTime


def LineRealTime(line:str):
    totalDistance = 0
    for s in networkDict["neighbors"][line]:
        distanceValue = float(s["distance_between"])
        totalDistance += distanceValue

    realTime = totalDistance / (COMMERCIAL_SPEED_KMH[line]/3.6)
    return realTime


def LineOverhead(line):
    v = GetCruiseSpeed(line)
    allStations = len(networkDict["neighbors"][line])
            
    for c in COMMERCIAL_SPEED_KMH:
        if c == line:
            overheadPerStop = ((LineRealTime(line) - LineRunningTime(line, v, a, b)) / allStations)

    return overheadPerStop


def VelocityAt(t, d, v, a, b):
    T = TravelTime(d, v, a, b)
    if t < 0 or t > T:
        return 0

    switch = v**2 / (2 * a) + v**2 / (2 * b)
    if d >= switch:
        vPeak = v
    else:
        vPeak = math.sqrt(d / (1 / (2 * a) + 1 / (2 * b)))

    if t < vPeak / a:
        return a * t
    elif t < T - vPeak / b:
        return vPeak
    else:
        return b * (T - t)


def IntegrateDistance(d, v, a, b, dt=0.1):
  T = TravelTime(d, v, a, b)
  total_distance = 0.0
  t = 0.0

  while t < T:
    step = min(dt, T - t)  # Prevents overshooting T on the final slice
    total_distance += VelocityAt(t, d, v, a, b) * step
    t += dt

  return total_distance


linha = "VERMELHA"
stacion = "ARTUR ALVIM"


d = GetDistance(stacion, linha)
v = GetCruiseSpeed(linha)

for s in COMMERCIAL_SPEED_KMH:
    print(f"LineOverhead Test for {s}: {LineOverhead(s)}")

print(IntegrateDistance(d, v, a, b))
""" 
print(f"LineOverhead Test: {LineOverhead(linha)}")
print(f"LineRealTime Test: {LineRealTime(linha)}")
print(f"LineRunningTime Test: {LineRunningTime(linha, v, a, b)}")
print(f"GetCruiseSpeed Test: {GetCruiseSpeed(linha)}")
print(f"TravelTime Test: {TravelTime(d, v, a, b)}")
print(f"TravelTimeDerivative Test: {TravelTimeDerivative(d, v, a, b)}")
 """