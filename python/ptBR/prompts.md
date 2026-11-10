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

## Funcionalidades desenvolvidas, sugeridas ou modificadas com IA

| Item | Papel da IA |
|---|---|
| Separação núcleo (`metro/`) × CLI (`main.py`) | Sugerida |
| Estrutura de pastas, READMEs, `.gitignore` | Gerados |
| Tradução da documentação (ptBR/enUS) | Gerada |

## Verificação, testes e ajustes

_em andamento — será preenchido conforme o desenvolvimento_

## Análise crítica

_em andamento — será preenchido ao final do projeto_
