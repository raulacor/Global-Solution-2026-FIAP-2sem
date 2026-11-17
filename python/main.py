"""CLI da CitizenTech (entrega de Computational Thinking with Python).
Menu de opções, validação de entradas, try/except e persistência em JSON.
Usa o pacote metro/ para toda a lógica.
"""
import json
import os 
from pathlib import Path

from urllib.request import urlopen
from metro.line_status import ParseStatus
from metro.network import BuildGraph
from metro.routing import FastestRoute, Normalize, FindNodes, BestRoute
from storage import LoadTrips, SaveTrips

LINE_BY_NUMBER = {
    "1": "AZUL", 
    "2": "VERDE", 
    "3": "VERMELHA",         
    "4": "AMARELA", 
    "5": "LILAS", 
    "15": "PRATA"
    }

NETWORK_FILE = Path(__file__).parent / "data" / "network.json"


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

                    start = input("Início: ")
                    target = input("Destino: ")
                    startNodes = FindNodes(graph, start)
                    targetNodes = FindNodes(graph, target)

                    if not startNodes or not targetNodes:
                        print("Estação não encontrada.")
                    else:
                        route = BestRoute(graph, startNodes, targetNodes)
                        if route is None:
                            print("Não há rota disponível (linha paralisada).")
                        else:
                            PrintRoute(route[0], route[1])

                            saveChoice = input("\nDeseja salvar essa viagem? [s/N] ")
                            if saveChoice.strip().lower() == "s":
                                savedName = input("Nome da viagem: ").strip() or f"{start} para {target}"
                                saved = LoadTrips()
                                saved.append({"name": savedName, "origin": start, "destination": target})
                                SaveTrips(saved)
                                print("Viagem salva!")
                    clean()

                else:
                    break



            case "0":
                clean()
                return False

            case _:
                print("Opção inválida.")

def ListTrips(trips):
    if not trips:
        print("Nenhuma viagem salva.")
    else:
        for ID, trip in enumerate(trips, 1):
            print(f"{ID}. {trip['name']}: {trip['origin']} → {trip['destination']}")

def PickTrip(trips): ## returns the list index of the chosen trip, or None
    ListTrips(trips)
    if not trips:
        return None
    choice = input("\nNúmero da viagem: ").strip()
    if choice.isdigit() and 1 <= int(choice) <= len(trips):
        return int(choice) - 1
    print("Opção inválida.")
    return None

def option_saved_trips(): ## Option 3 from the main menu
    while True:
        print(
            """
            \n=== DETOUR — viagens salvas ===
            1. Listar viagens
            2. Renomear viagem
            3. Apagar viagem
            0. Voltar
            """)

        optionSavedMenu = input("Escolha uma opção: ")
        trips = LoadTrips()

        match optionSavedMenu:
            case "1":
                ListTrips(trips)
                clean()

            case "2":
                index = PickTrip(trips)
                if index is not None:
                    newName = input("Novo nome: ").strip()
                    if newName:
                        trips[index]["name"] = newName
                        SaveTrips(trips)
                        print("Viagem renomeada!")
                clean()

            case "3":
                index = PickTrip(trips)
                if index is not None:
                    removed = trips.pop(index)
                    SaveTrips(trips)
                    print(f"Viagem '{removed['name']}' apagada!")
                clean()

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

            case "3":
                option_saved_trips()

            case "0":
                return False

            case _:
                print("Opção inválida.")


if __name__=="__main__":
    main_menu()
