import json
from pathlib import Path

SAVED_FILE = Path(__file__).parent / "data" / "saved_trips.json"

def LoadTrips():
    default_data = []
    try:
        with open(SAVED_FILE, encoding="utf-8") as sf:
                savedFile = json.load(sf)
                return savedFile

    except FileNotFoundError:
         with open(SAVED_FILE, "w", encoding="utf-8") as nf:
              savedFile = json.dump(default_data, nf, indent=4)

    return default_data

def SaveTrips(trips):
    with open(SAVED_FILE, "w", encoding="utf-8") as wf:
        json.dump(trips, wf, ensure_ascii=False, indent=4)
        