🌐 **Português** · [English](../enUS/README.md)

# Detour — Aplicação Web

Entrega de **Front-end Design** e **Web Development** (GS 2026.2).

**No ar:** [detour-rust.vercel.app](https://detour-rust.vercel.app)

## Descrição

O Detour encontra o caminho mais rápido entre duas estações do metrô de São Paulo **levando em conta a situação real e atual de cada linha**. Se uma linha está paralisada, a rota desvia dela; se uma linha está com velocidade reduzida, seus trechos ficam mais lentos e a rota pode mudar.

O cálculo da rota não é uma cópia em JavaScript: o mesmo pacote Python que a CLI usa (`../python/metro/`) roda **dentro do navegador** através do [Pyodide](https://pyodide.org). A situação das linhas vem ao vivo da página oficial "Direto do Metrô".

## Funcionalidades

- **Busca de rota** — digite origem e destino (acentos e maiúsculas não importam). O resultado mostra o tempo estimado, o número de baldeações e as estações agrupadas por linha.
- **Situação das linhas ao vivo** — as 6 linhas desenhadas como uma única linha de metrô contínua (18 nós, 3 por linha), cada trecho com o estilo da sua situação: contínuo (normal), tracejado (velocidade reduzida / operação parcial), apagado com nós vermelhos (paralisada / encerrada).
- **Rota que considera a situação** — a situação atual vai junto em cada busca (linha paralisada → seus trilhos saem do grafo; velocidade reduzida → velocidade de cruzeiro × 0,5).
- **Mapa interativo** — a rede sobre um mapa escuro de São Paulo (Leaflet), linhas animadas pela situação, rota escolhida em destaque com os nomes das estações.
- **Estação inexistente / ainda carregando** — mensagens claras em vez de erros.
- **Viagens salvas (CRUD)** — _em andamento: MockAPI + `useSavedTrips`._

## Como funciona

```
Navegador
 ├─ usePyodide ─ carrega o Pyodide + python/metro + network.json, monta o grafo,
 │               expõe search(origem, destino, statuses) e parseStatus(html)
 ├─ useLineStatus(parseStatus) ─ GET /api/status → parseStatus(html) → { LINHA: {status, info} }
 └─ App ─ StationPicker → search(...) → RouteResult + MetroMap
                         statuses ─────→ LineStatusList + MetroMap + search

/api/status ─ função serverless da Vercel (api/status.js): busca a página do Direto do Metrô
              no servidor (o navegador não pode, CORS) e devolve o HTML, com cache de 60 s.
              No `npm run dev` a mesma URL é atendida pelo proxy do Vite (vite.config.js).
```

## Estrutura do projeto

```
web/
├── api/status.js            função da Vercel: proxy da situação do Metrô (CORS)
├── scripts/sync-python.mjs  copia ../python/metro, o network.json e o runtime do Pyodide para public/
├── src/
│   ├── App.jsx              layout da página e estado (rota, mensagem)
│   ├── components/          só apresentação
│   ├── hooks/               estado + efeitos (usePyodide, useLineStatus)
│   ├── lib/                 lógica pura, sem React (groupRoute, lineStatus, mapGeometry)
│   └── services/            acesso a dados (networkService)
└── vite.config.js           plugins React + Tailwind, proxy de dev para /api/status
```

### Componentes

| Componente | Papel |
|---|---|
| `Logo` | botão com a marca "Detour" (limpa a busca) |
| `StationPicker` | campos de origem / destino com o botão redondo de busca |
| `StationIcon`, `BookmarkIcon` | ícones SVG próprios (herdam a cor do texto) |
| `RouteResult` | linha do tempo da rota: tempo, baldeações, estações por linha |
| `MetroMap` | mapa Leaflet da rede, animações por situação, destaque da rota |
| `LineStatusList` | a linha de situação com 18 nós |
| `LineStatusBadge` | o trecho de uma linha (3 nós) e sua situação |
| `SavedTripsMenu` | botão do menu de viagens salvas (a lista vem com o CRUD) |

### Hooks próprios

| Hook | Papel |
|---|---|
| `usePyodide` | carrega o Python no navegador uma vez; devolve `{ search, parseStatus }` (os dois `null` enquanto carrega) |
| `useLineStatus` | busca `/api/status` e interpreta com o parser em Python; roda de novo quando `parseStatus` fica disponível |

## Pré-requisitos

- Node.js 20.19+ (ou 22.12+)
- npm

## Instalação e execução

```bash
npm install
npm run dev
```

`npm run dev` e `npm run build` rodam antes o `scripts/sync-python.mjs`, que copia para `public/` (gerado, fora do Git):
- `../python/metro/` → `public/py/metro/` e `../python/data/network.json` → `public/py/network.json`
- o runtime do Pyodide (`pyodide.asm.wasm`, `python_stdlib.zip`, …) → `public/pyodide/`

Depois de mudar algo em `../python/`, reinicie o `npm run dev` para a cópia ser atualizada.

## Tecnologias

React 19 · Vite 8 · Tailwind CSS v4 · Pyodide · Leaflet · Vercel (hospedagem + função serverless) · oxlint

## Deploy

Vercel, **Root Directory = `web`**, branch de produção `main` (cada merge publica de novo).
No ar: [detour-rust.vercel.app](https://detour-rust.vercel.app)

## Fontes de dados

- Rede, estações, velocidades e intervalos: veja o [README do repositório](../../ptBR/README.md#ficha-da-citizentech).
- Situação ao vivo: [Direto do Metrô](https://www.metro.sp.gov.br/wp-content/themes/metrosp/direto-metro.php?embed=1) (oficial).
- Fundo do mapa: Esri World Dark Gray Base (atribuição exibida no mapa).

## Uso de IA

Veja [AI.md](../../ptBR/AI.md).

## Autor

Raul Azzi Corsi — RM569022
