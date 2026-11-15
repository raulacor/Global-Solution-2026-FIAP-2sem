🌐 **Português** · [English](../enUS/prompts.md)

# Uso de IA — Aplicação Python

## Ferramentas utilizadas

| Ferramenta | Finalidade |
|---|---|
| Claude (Anthropic) | Mentoria: leitura e interpretação do enunciado, discussão da ideia e da arquitetura, perguntas e dicas durante o desenvolvimento, estrutura inicial do repositório e documentação |

## Prompts utilizados

### 1. Leitura do enunciado — 08/11/2026

> Hey claude, read the pdf and completely understand what is being asked to guide me as we come up and build this solution. [...] You will work as my mentor guiding me same thing as we've been doing this whole semester, but readmes, the scaffolding of the project, gitignores and a 3d model (if we go with my idea) and the prompts.md file is on you.

**Resultado:** resumo das entregas de cada disciplina, requisitos comuns (Ficha da CitizenTech, ODS, dados reais ou simulados) e o prazo de 19/11.

### 2. Ideia da solução — 08/11/2026

> I wanted to integrate the python with the front end, so i wanted a 2d or 3d map of the whole Sao Paulo's subway system connected to an api [...] that tracks if the lines are good to go or if they are delayed and we can use the differentiated problem solving part to create a calculation to see which path within the subway system is faster.

**Resultado:** a IA pesquisou e apontou que o Metrô não oferece uma API pública oficial de status (a informação é publicada no site "Direto do Metrô" e em projetos comunitários que fazem scraping), e que o cálculo de rota mais rápida é um problema de grafos, não de cálculo diferencial e integral.

### 3. Somente dados reais — 08/11/2026

> I don't want to use any simulated data can we still make this work as i described and what would you suggest for the differentiated project

**Resultado:** status das linhas obtido do site oficial via função serverless (contornando CORS) e com `urllib` na CLI; rede e estações de bases públicas; operações de CRUD sobre registros criados pelo próprio usuário. Para a matemática, foi sugerido modelar o movimento do trem entre estações — o tempo calculado vira o peso de cada ligação do grafo.

### 4. Python no navegador — 08/11/2026

> I don't want the function to be primarily cli and want it to work in the browser and we later add a function to make it work as a CLI

**Resultado:** a lógica fica em um pacote Python sem entrada/saída (`metro/`), executado no navegador via Pyodide e importado pela CLI (`main.py`).

### 5. Estrutura inicial — 08/11/2026

> can you do the initial scaffolding?

**Resultado:** criação das pastas, `.gitignore`, READMEs, deste arquivo e do `AI.md`. Os módulos de `metro/` foram criados vazios, apenas com a descrição da responsabilidade de cada um.

### 6. Documentação bilíngue — 08/11/2026

> I want both, make a enUS folder and a ptBR folder for each document and fill them in please

**Resultado:** todos os documentos passaram a existir em `ptBR/` e `enUS/`; os arquivos nos locais exigidos pelas rubricas trazem a versão em inglês, que é a fonte das demais cópias.

### 7. Inglês como versão principal — 08/11/2026

> just switch so the main files are in english as this is the files that if needed i will add or change

**Resultado:** os arquivos nos locais exigidos passaram a trazer a versão em inglês.

### 8. Escopo do repositório — 08/11/2026

> You can remove STXD and the pitch from this repo this is only for the source code and math

**Resultado:** o repositório guarda apenas o código-fonte (Python e web) e os modelos matemáticos, escritos em Python.

### 9. Preparação dos dados, guiada — 09–10/11/2026

> lets code / check it please (série de pedidos de revisão enquanto escrevia `data-prep/build_network.py`)

**Resultado:** a IA primeiro escreveu sozinha um script de preparação; Raul apontou que o código deveria ser dele, então o script foi apagado e ele o reescreveu. Em duas sessões, a IA o guiou com perguntas e explicações curtas (GeoPackage como SQLite, leitura do blob de geometria com `struct`, coordenadas UTM em metros, Pitágoras para distâncias, `sort(key=...)`, opções do `json.dump`). A pedido explícito de Raul, a IA forneceu as linhas finais da ordenação (Linha 1 por Y, as demais por X). O resultado é `python/data/network.json`: 93 estações e 87 distâncias entre vizinhas.

### 10. Projeto do núcleo Python e dados reais — 13/11/2026

> lets tackle what we have to tackle today / what about the other line? isn't there another one missing

**Resultado:** projeto guiado do `metro/`. Raul decidiu usar um nó do grafo por (estação, linha), para que a baldeação tenha custo. Custo da baldeação = metade do intervalo entre trens da linha embarcada (a IA explicou o raciocínio da espera média). Os valores reais foram pesquisados em conjunto: intervalos do CSV do Metrô, do infográfico da ViaQuatro (Linha 4) e do relatório de 2019 do Metrô (Linha 5, encontrado por Raul); tempos ponta a ponta das Linhas 4 e 5 (Raul encontrou 21–25 min e 36 min; a IA encontrou os 20 min da operadora); travessia do túnel Paulista↔Consolação (8 min 20 s, média Metrô/ViaQuatro). Raul escreveu o `travel_time.py`.

### 11. Construção do grafo — 13/11/2026

> check it please / take control and fix it please

**Resultado:** Raul escreveu o `BuildGraph` com dicas passo a passo (dicionário de adjacência, `setdefault`, arestas como tuplas). A pedido explícito, a IA corrigiu duas linhas (indentação do `return` e caminho do arquivo). A IA criou o `check_core.py`, um arquivo de testes executável, depois que Raul não conseguiu rodar módulos do pacote pelo botão ▶ do VS Code.

### 12. Dijkstra — 13/11/2026

> check please (série de revisões)

**Resultado:** Raul escreveu o `FastestRoute` (a regra de relaxamento foi deduzida por ele a partir de perguntas; o `heapq` foi explicado em uma mini-aula) e a reconstrução do caminho a partir de `prev`. Verificado: Artur Alvim → Paraíso = 2110,7 s com baldeação na Sé; Capão Redondo → Luz ≈ 51 min, próximo dos ~50 min Capão→Sé citados pelo Banco Mundial.

### 13. Unidades nos comentários — 13/11/2026

> can you add the units next to the numbers that we already did? this way i will have an example on how to start doing that from now on

**Resultado:** a IA adicionou comentários com unidades (`[m]`, `[s]`, `[m/s]`, álgebra das unidades) nos três arquivos do núcleo, sem alterar a lógica.

### 14. Leitor do status das linhas — 14/11/2026

> check my progress please (série de revisões)

**Resultado:** Raul escreveu o `LineStatusParser` (subclasse de `HTMLParser`) a partir de um esqueleto e de dicas, e encontrou no Wayback Machine exemplos reais de cada status anormal; a IA os salvou como arquivos de teste em `data-prep/raw/`. A pedido, a IA renomeou os métodos do parser de volta para os nomes exigidos pelo `HTMLParser` e forneceu as linhas finais do `ParseStatus` que devolvem status + descrição.

### 15. Rota sensível ao status — 14/11/2026

> lets tackle the color sitch / so for paralisada we don't need to remove the edge can't we just add a factor of zero?

**Resultado:** a IA mostrou que o Metrô não publica um valor de velocidade para "Velocidade Reduzida", então a redução é uma premissa documentada (`REDUCED_SPEED_FACTOR = 0.5`). Raul a escolheu, escreveu o parâmetro `factor` em `SegmentTime` e ligou os status ao `BuildGraph`; linhas fechadas perdem suas arestas (um fator 0 dividiria por zero). Raul argumentou que aplicar a lentidão à linha inteira é realista por causa do agrupamento de trens.

### 16. Opção de rota na CLI — 14/11/2026

> can you do that im too tired now

**Resultado:** Raul construiu os menus (`while` + `match/case`) e a opção de status. A pedido explícito, a IA escreveu `Normalize`, `FindNodes`, `BestRoute` e `PrintRoute` no `main.py` e os ligou à opção de rota.

## Funcionalidades desenvolvidas, sugeridas ou modificadas com IA

| Item | Papel da IA |
|---|---|
| Separação núcleo (`metro/`) × CLI (`main.py`) | Sugerida |
| Estrutura de pastas, READMEs, `.gitignore` | Gerados |
| Tradução da documentação (ptBR/enUS) | Gerada |
| `data-prep/build_network.py` | Guiado (escrito por Raul); linhas finais de ordenação fornecidas pela IA a pedido |
| `metro/travel_time.py`, `metro/routing.py` | Guiados (escritos por Raul) |
| `metro/network.py` | Guiado (escrito por Raul); correção de duas linhas pela IA a pedido |
| `metro/line_status.py` | Guiado (escrito por Raul); renomeação dos métodos e retorno do `ParseStatus` fornecidos pela IA a pedido |
| Comentários com unidades em `metro/` | Gerados a pedido |
| `check_core.py` (arquivo de testes) | Gerado |
| Menus do `main.py` e opção de status | Guiados (escritos por Raul) |
| `Normalize`, `FindNodes`, `BestRoute`, `PrintRoute` do `main.py` | Gerados a pedido |
| Arquivos de teste de status em `data-prep/raw/` | Encontrados por Raul (Wayback Machine), salvos pela IA |

## Verificação, testes e ajustes

_em andamento — será preenchido conforme o desenvolvimento_

## Análise crítica

_em andamento — será preenchido ao final do projeto_
