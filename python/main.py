"""CLI da CitizenTech (entrega de Computational Thinking with Python).
Menu de opções, validação de entradas, try/except e persistência em JSON.
Usa o pacote metro/ para toda a lógica.
"""
import json
import os 
import unicodedata
from pathlib import Path

from urllib.request import urlopen
from metro.line_status import ParseStatus
from metro.network import BuildGraph
from metro.routing import FastestRoute



LINE_BY_NUMBER = {
    "1": "AZUL", 
    "2": "VERDE", 
    "3": "VERMELHA",         
    "4": "AMARELA", 
    "5": "LILAS", 
    "15": "PRATA"
    }

def get_statuses():
    try:    
        URL = "https://www.metro.sp.gov.br/wp-content/themes/metrosp/direto-metro.php?embed=1"

        html = urlopen(URL, timeout=10).read().decode("utf-8")
        return ParseStatus(html) 
    
    except OSError:
        print("Você precisa estar conectado à internet.")
        return None

def clean():
    input("\nAperte enter para continuar...")
    os.system('cls' if os.name == 'nt' else 'clear')


NETWORK_FILE = Path(__file__).parent / "data" / "network.json"


def Normalize(text):
    """'Paraíso ' → 'PARAISO': uppercase, no accents, no extra spaces."""
    text = unicodedata.normalize("NFD", text.strip().upper())
    return "".join(c for c in text if unicodedata.category(c) != "Mn")


def FindNodes(graph, typed):
    """Every (station, line) node whose name matches what the user typed."""
    nodes = []
    for station, line in graph:
        if Normalize(station) == Normalize(typed):
            nodes.append((station, line))
    return nodes


def BestRoute(graph, start_nodes, goal_nodes):
    """Try every start × goal node and keep the fastest. Returns (seconds, path) or None."""
    best = None
    for start in start_nodes:
        for goal in goal_nodes:
            result = FastestRoute(graph, start, goal)
            if result is not None and (best is None or result[0] < best[0]):
                best = result
    return best


def PrintRoute(seconds, path):
    """Prints the route grouped by line, marking each transfer."""
    print(f"\nTempo estimado: {seconds / 60:.0f} min")
    current_line = None
    for station, line in path:
        if line != current_line:
            print(f"\n  Linha {line}:")
            current_line = line
        print(f"    • {station}")

def option_line_status(data): ## Option 1 from the main menu
    if data is None:
        return

    while True:
        print(
            """
            \n=== DETOUR — o melhor caminho pelo metrô ===
            1. Conferir uma linha
            2. Ver linhas disponiveis\n
            3. Sair
            """)

        optionStatusMenu = input("Escolha uma opção: ")

        
        match optionStatusMenu:
            case "1":
                lineChoice = input("\nInsire o numero da linha que voce deseja apurar: ")
                if lineChoice in LINE_BY_NUMBER:
                    line = LINE_BY_NUMBER[lineChoice]
                    print(f"\nLinha {lineChoice} ({line}): {data[line]['status']}")
                    print(data[line]["info"])
                    clean()

                else: 
                    print("Linha indisponível para consulta")

            case "2":
                os.system('cls' if os.name == 'nt' else 'clear')
                print("\nLinhas disponiveis para apuração: ")
                
                for numb, name in LINE_BY_NUMBER.items():
                    print(f"Linha {numb}: {name}")

                clean()
                
            case "3":
                clean()
                return False

            case _:
                print("Opção inválida.")

def option_fastest_route(): 
    while True:
        print(
            """
            \n=== DETOUR — o melhor caminho pelo metrô ===
            1. Calcular rota
            0. Sair\n
            """)

        optionFastestRoute = input("Escolha uma opção: ")

        match optionFastestRoute:
            case "1":
                statuses = get_statuses()
                if statuses:
                    with open(NETWORK_FILE, "r", encoding="utf-8") as network:
                        networkDict = json.load(network)
                    graph = BuildGraph(networkDict, statuses)

                    startNodes = FindNodes(graph, input("Início: "))
                    targetNodes = FindNodes(graph, input("Destino: "))

                    if not startNodes or not targetNodes:
                        print("Estação não encontrada.")
                    else:
                        route = BestRoute(graph, startNodes, targetNodes)
                        if route is None:
                            print("Não há rota disponível (linha paralisada).")
                        else:
                            PrintRoute(route[0], route[1])
                    clean()

                else:
                    break



            case "0":
                clean()
                return False

            case _:
                print("Opção inválida.")



def main_menu():
    while True:
        print(
            """
            \n=== DETOUR — o melhor caminho pelo metrô ===
            1. Ver status das linhas
            2. Calcular rota mais rápida
            3. Viagens salvas
            0. Sair\n
            """)

        optionMainMenu = input("Escolha uma opção: ")

        match optionMainMenu:
            case "1":
                option_line_status(get_statuses())

            case "2":
                option_fastest_route()

            case "0":
                return False

            case _:
                print("Opção inválida.")


if __name__=="__main__":
    main_menu()
