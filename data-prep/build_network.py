import sqlite3
import struct
import math


formatedStations = {
    "AMARELA": [],
    "AZUL": [],
    "LILAS": [],
    "PRATA": [], 
    "VERDE": [],
    "VERMELHA": []
}

def Pythagoras(x1, x2, y1, y2):
    xSide = x1 - x2
    ySide = y1 - y2

    hypotenuse = math.hypot(xSide, ySide)
    return hypotenuse

conn = sqlite3.connect("./raw/SIRGAS_GPKG_estacaometro.gpkg")
cur = conn.cursor()

stations = cur.execute("SELECT * FROM SIRGAS_GPKG_estacaometro")
allStations = cur.fetchall()

for s in range(len(allStations)):
    stationName = allStations[s][2]
    stationLine = allStations[s][3]
    coordX = struct.unpack("<d", allStations[s][1][-16:-8])[0]
    coordY = struct.unpack("<d", allStations[s][1][-8:])[0]

    if stationName not in [s["name"] for s in formatedStations[stationLine]]: ## Duplicate stations checker.
        formatedStations[stationLine].append({
            "name": stationName,
            "line": stationLine,
            "x": coordX,
            "y": coordY,           
        })

for line in formatedStations:
    if line == "AZUL":
        formatedStations[line].sort(key=lambda s: s["y"], reverse=True)
    else:
        formatedStations[line].sort(key=lambda s: s["x"])
    
print(len(formatedStations["AZUL"]), [s["name"] for s in formatedStations["AZUL"]])
""" print(Pythagoras(coordStations[0]['x'], coordStations[1]['x'], coordStations[0]['y'], coordStations[1]['y'],)) """

