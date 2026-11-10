🌐 **Português** · [English](../enUS/AI.md)

# Uso de IA — Aplicação Web

## Ferramentas utilizadas

| Ferramenta | Finalidade |
|---|---|
| Claude (Anthropic) | Mentoria: interpretação do enunciado, discussão da arquitetura, dicas durante o desenvolvimento, estrutura inicial do projeto (Vite + React + Tailwind) e documentação |

## Interações realizadas

### 1. Ideia e fonte dos dados — 08/11/2026

> I wanted [...] a 2d or 3d map of the whole Sao Paulo's subway system connected to an api [...] that tracks if the lines are good to go or if they are delayed

**Resposta obtida:** não existe API pública oficial de status do Metrô; a situação é publicada no site oficial. Proposta de uma função serverless no deploy para buscar esse dado e entregá-lo ao front-end, já que o navegador bloquearia a requisição direta (CORS).

### 2. Python no navegador — 08/11/2026

> I don't want the function to be primarily cli and want it to work in the browser

**Resposta obtida:** executar o pacote Python da solução no navegador com Pyodide, copiado para `web/public/py/` antes de cada `dev`/`build`.

### 3. Estrutura inicial — 08/11/2026

> can you do the initial scaffolding?

**Resposta obtida:** projeto Vite + React com Tailwind CSS v4 configurado, Pyodide como dependência, pastas `components/`, `hooks/`, `services/` e `lib/` para separar apresentação, estado, acesso a dados e regras de negócio.

### 4. Documentação bilíngue — 08/11/2026

> I want both, make a enUS folder and a ptBR folder for each document and fill them in please

**Resposta obtida:** todos os documentos passaram a existir em `ptBR/` e `enUS/`; os arquivos nos locais exigidos pelas rubricas trazem a versão em inglês, que é a fonte das demais cópias.

### 5. Inglês como versão principal — 08/11/2026

> just switch so the main files are in english as this is the files that if needed i will add or change

**Resposta obtida:** os arquivos nos locais exigidos passaram a trazer a versão em inglês.

## Aplicação no projeto

| Item | Papel da IA |
|---|---|
| Scaffolding Vite + React + Tailwind | Gerado |
| Script `scripts/sync-python.mjs` | Gerado |
| Arquitetura (Pyodide, função serverless para status) | Sugerida |
| Tradução da documentação (ptBR/enUS) | Gerada |

## Validação das respostas

_em andamento — será preenchido conforme o desenvolvimento_

## Análise crítica

_em andamento — será preenchido ao final do projeto_
