import sqlite3
import struct
import math


conn = sqlite3.connect("./raw/SIRGAS_GPKG_estacaometro.gpkg")
cur = conn.cursor()

stations = cur.execute("SELECT * FROM SIRGAS_GPKG_estacaometro")
allStations = cur.fetchall()


def Pythagoras(x1, x2, y1, y2):
    xSide = x1 - x2
    ySide = y1 - y2

    hypotenuse = math.hypot(xSide, ySide)
    return hypotenuse


def SortStations(allStations):
    sortedStations = {
        "AMARELA": [],
        "AZUL": [],
        "LILAS": [],
        "PRATA": [], 
        "VERDE": [],
        "VERMELHA": []
    }
    for s in range(len(allStations)):
        stationName = allStations[s][2]
        stationLine = allStations[s][3]
        coordX = struct.unpack("<d", allStations[s][1][-16:-8])[0]
        coordY = struct.unpack("<d", allStations[s][1][-8:])[0]

        if stationName not in [s["name"] for s in sortedStations[stationLine]]: ## Duplicate stations checker.
            sortedStations[stationLine].append({
                "name": stationName,
                "line": stationLine,
                "x": coordX,
                "y": coordY,           
            })

    for line in sortedStations:
        if line == "AZUL":
            sortedStations[line].sort(key=lambda s: s["y"], reverse=True)
        else:
            sortedStations[line].sort(key=lambda s: s["x"])

    return sortedStations

def GetStationNeighbors(sortedStations):
    distanceStations = {
        "AMARELA": [],
        "AZUL": [],
        "LILAS": [],
        "PRATA": [], 
        "VERDE": [],
        "VERMELHA": []
    }
    for line in sortedStations:
        for i in range(len(sortedStations[line]) - 1):
            distance = Pythagoras(x1=sortedStations[line][i]["x"], x2=sortedStations[line][i+1]["x"], y1=sortedStations[line][i]["y"], y2=sortedStations[line][i+1]["y"])

            nameStation = sortedStations[line][i]["name"]
            nameNextStation = sortedStations[line][i+1]["name"]

            distanceStations[line].append({
                "station": nameStation,
                "next_station": nameNextStation,
                "distance_between": distance
            })

    return distanceStations

sortedStations = SortStations(allStations)
print(sortedStations)

neighbors = GetStationNeighbors(sortedStations)
print(neighbors)