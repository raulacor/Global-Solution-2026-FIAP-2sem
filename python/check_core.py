"""Quick manual check of the metro/ core. Run this file directly (VS Code ▶ works).

It does the I/O (reads network.json) so that metro/ never has to.
"""
import json
from pathlib import Path

from metro.network import BuildGraph

DATA = Path(__file__).parent / "data" / "network.json"

with open(DATA, encoding="utf-8") as f:
    network = json.load(f)

graph = BuildGraph(network)
print(f"nodes: {len(graph)}  edges: {sum(len(v) for v in graph.values())}")

for node in [("ARTUR ALVIM", "VERMELHA"), ("SÉ", "AZUL"), ("PAULISTA", "AMARELA")]:
    print(node)
    for neighbor, cost in graph.get(node, []):
        print(f"    {neighbor}  {cost:.1f} s")


# ---- line_status check -------------------------------------------------------
from metro.line_status import LineStatusParser

SAMPLE_HTML = Path(__file__).parent.parent / "data-prep" / "raw" / "direto_metro_sample.html"

with open(SAMPLE_HTML, encoding="utf-8") as f:
    html = f.read()

print("\n--- line_status ---")
parser = LineStatusParser()
parser.feed(html)
print("statuses:", parser.statuses)
