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
from metro.line_status import LineStatusParser, ParseStatus

RAW = Path(__file__).parent.parent / "data-prep" / "raw"
SAMPLES = [
    "direto_metro_sample.html",             # all Operação Normal (14/11/2026)
    "direto_metro_reduzida_sample.html",    # Prata Velocidade Reduzida (12/10/2023)
    "direto_metro_parcial_sample.html",     # Prata Operação Parcial (24/10/2026)
    "direto_metro_paralisada_sample.html",  # Prata Paralisada (09/12/2023)
]

print("\n--- line_status ---")
for name in SAMPLES:
    with open(RAW / name, encoding="utf-8") as f:
        html = f.read()
    print(f"\n[{name}]")
    print("  ParseStatus:", ParseStatus(html))
    parser = LineStatusParser()
    parser.feed(html)
    for row in parser.statuses:
        print(f"  {row.get('linha-numero'):>2} {row.get('linha-situacao')!r:24} info: {str(row.get('linha-info'))[:80]}")
