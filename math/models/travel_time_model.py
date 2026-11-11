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
    travel = v/a + v/b + (d - (v**2/(2*a)) - (v**2/(2*b)))/v 
    return travel

d, v=GetDistance("ARTUR ALVIM", "VERMELHA")
print(TravelTime(d, v, a, b))
print(TravelTime(400, 87/3.6, a, b))