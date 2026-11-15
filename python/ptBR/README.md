🌐 **Português** · [English](../enUS/README.md)

# Detour — Metrô SP · Aplicação Python

Entrega de **Computational Thinking with Python** (GS 2026.2).

## Descrição

O Detour é o app que ajuda você a encontrar o melhor caminho pelo metrô. Ele cobre as seis linhas do Metrô de São Paulo (1-Azul, 2-Verde, 3-Vermelha, 4-Amarela, 5-Lilás, 15-Prata) e oferece três funções:

- **Status das linhas:** a situação real e atual de cada linha, lida da página oficial "Direto do Metrô".
- **Rota mais rápida:** a viagem de menor tempo entre duas estações (algoritmo de Dijkstra). Ela considera o status do dia: linhas com velocidade reduzida ou operação parcial contam como mais lentas, e linhas paralisadas são retiradas da rede.
- **Viagens salvas:** salve um par origem/destino com um nome e depois liste, renomeie ou apague. As viagens ficam guardadas em JSON e continuam salvas entre execuções.

O tempo entre duas estações vem do modelo matemático do movimento do trem (acelera → velocidade de cruzeiro → freia), calibrado com as velocidades comerciais publicadas pelo Metrô. Esse modelo está em `math/`.

## Estrutura

```
metro/              núcleo sem entrada/saída (roda também no navegador via Pyodide)
  travel_time.py    tempo entre estações, tempo de baldeação (metade do intervalo)
  network.py        monta o grafo: um nó por (estação, linha)
  routing.py        Dijkstra: rota mais rápida
  line_status.py    lê o status das linhas do HTML da página oficial
main.py             menu de opções (CLI)
storage.py          lê e grava as viagens salvas (JSON)
check_core.py       arquivo de testes do núcleo, sem internet
data/
  network.json      estações e distâncias reais (geradas em data-prep/)
  saved_trips.json  viagens salvas (criado automaticamente)
prompts.md          uso de IA no desenvolvimento
```

## Como executar

Requer **Python 3.10+** (usa `match/case`) e nenhuma biblioteca externa.

```bash
cd python
python3 main.py
```

As opções 1 e 2 precisam de **conexão com a internet**, porque leem o status atual do site do Metrô. Sem conexão, o programa mostra "Você precisa estar conectado à internet." e volta ao menu.

Para conferir o núcleo sem internet (o grafo e o leitor de status com páginas reais salvas):

```bash
python3 check_core.py
```

## Menu

```
1. Ver status das linhas      → consulte uma linha pelo número ou liste todas
2. Calcular rota mais rápida  → digite início e destino (acentos e maiúsculas não importam)
                                e salve a viagem, se quiser
3. Viagens salvas             → liste, renomeie ou apague viagens salvas
0. Sair
```

Exemplo: `artur alvim` → `paraiso` dá cerca de 35 min (Linha 3 até a Sé e depois Linha 1).

## Autor

Raul Azzi Corsi — RM569022
