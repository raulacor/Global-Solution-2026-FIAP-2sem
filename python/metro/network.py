"""Rede do metrô: estações, linhas e ligações entre estações.

Recebe os dados reais já carregados (dicionários/listas) e monta a estrutura
que o cálculo de rota usa. Não lê arquivos: quem lê é a CLI ou o front-end.
"""
from .travel_time import SegmentTime, TransferTime

PAULISTA_CONSOLACAO_WALK = 500   # [s] tunnel crossing, Metrô/ViaQuatro average (8 min 20 s)

def BuildGraph(network):

    graph = {}
    lines_by_name = {}

    for l in network["neighbors"]:
        for s in network["neighbors"][l]:
            station = (s["station"], l)
            next_station = (s["next_station"], l)
            time_to_next = SegmentTime(s["distance_between"], l)   # [m] in → [s] out
            graph.setdefault(station, []).append((next_station, time_to_next))
            graph.setdefault(next_station, []).append((station, time_to_next))
      
    for l in network["stations"]:
        for st in network["stations"][l]:
            lines_by_name.setdefault(st["name"], []).append(l)

    for name in lines_by_name:
        lines = lines_by_name[name]
        for from_line in lines:
            for to_line in lines:
                if from_line != to_line:
                    graph.setdefault((name, from_line), []).append(((name, to_line), TransferTime(to_line)))

    graph.setdefault(("PAULISTA", "AMARELA"), []).append((("CONSOLAÇÃO", "VERDE"), PAULISTA_CONSOLACAO_WALK + TransferTime("VERDE")))
    graph.setdefault(("CONSOLAÇÃO", "VERDE"), []).append((("PAULISTA", "AMARELA"), PAULISTA_CONSOLACAO_WALK + TransferTime("AMARELA")))

    return graph
