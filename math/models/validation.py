import json

from travel_time_model import a, b, networkDict, TravelTime, GetCruiseSpeed


# Metrô Transparency Portal, "oferta" dataset — data-prep/raw/metro_sp_service_current.csv, Sep 2026
COMMERCIAL_SPEED_KMH = {"AZUL": 30, "VERDE": 32, "VERMELHA": 32, "PRATA": 35}



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


if __name__ == "__main__":
    sLine = "VERMELHA"

    v = GetCruiseSpeed(sLine)

    print(f"LineOverhead Test: {LineOverhead(sLine)}")
    print(f"LineRealTime Test: {LineRealTime(sLine)}")
    print(f"LineRunningTime Test: {LineRunningTime(sLine, v, a, b)}")