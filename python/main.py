"""CLI da CitizenTech (entrega de Computational Thinking with Python).
Menu de opções, validação de entradas, try/except e persistência em JSON.
Usa o pacote metro/ para toda a lógica.
"""
import json
import os 

from urllib.request import urlopen
from metro.line_status import ParseStatus

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
                option_line_status()

            case "0":
                return False

            case _:
                print("Opção inválida.")


if __name__=="__main__":
    network = get_statuses()
    #main_menu()
    option_line_status(network)