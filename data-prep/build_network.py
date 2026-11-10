import sqlite3
import struct
import math


coordStations = []

conn = sqlite3.connect("./raw/SIRGAS_GPKG_estacaometro.gpkg")
cur = conn.cursor()

def Pythagoras(x1, x2, y1, y2):
    xSide = x1 - x2
    ySide = y1 - y2

    hypotenuse = math.hypot(xSide, ySide)
    return hypotenuse


stations = cur.execute("SELECT * FROM SIRGAS_GPKG_estacaometro")
allStations = cur.fetchall()

for s in range(len(allStations)):
    coordX = struct.unpack("<d", allStations[s][1][-16:-8])[0]
    coordY = struct.unpack("<d", allStations[s][1][-8:])[0]
    stationName = allStations[s][2]
    stationLine = allStations[s][3]

    coordStations.append({
        "name": stationName,
        "line": stationLine,
        "x": coordX,
        "y": coordY,
        })
print(Pythagoras(coordStations[0]['x'], coordStations[1]['x'], coordStations[0]['y'], coordStations[1]['y'],))

