import json
import math

a = 1.1 ## Acceleration
b = 1.2 ## Break rate

def GetDistance(station:str, line:str):
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

    with open("../../python/data/network.json", 'r') as network:
        data = json.load(network)
        networkDict = data

    for s in networkDict["neighbors"][line]:
        if s["station"] == station:
            distanceValue = float(s["distance_between"])

            return distanceValue, GetCruiseSpeed(line)

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


d, v=GetDistance("ARTUR ALVIM", "VERMELHA")
print(TravelTime(d, v, a, b))
print(TravelTimeDerivative(d, v, a, b))
