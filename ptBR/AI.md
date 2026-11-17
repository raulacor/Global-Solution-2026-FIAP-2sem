🌐 **Português** · [English](../enUS/AI.md)

# Uso de IA — Aplicação Web

## Ferramentas utilizadas

| Ferramenta | Finalidade |
|---|---|
| Claude (Anthropic) — Claude Opus | Mentoria: interpretação do enunciado, arquitetura, dicas passo a passo e exemplos resolvidos enquanto o Raul escrevia o código; estrutura inicial, proxy de situação, primeiro mapa, estilo visual (a pedido) e documentação |
| Claude Fable (Anthropic) | Segunda versão do componente de mapa (`MetroMap` v2), pedida pelo Raul |

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

### 6. Python rodando no navegador, guiado — 15/11/2026

> back to pyodide never heard of it what can you tell me?

**Resposta:** uma explicação curta do Pyodide (CPython compilado para WebAssembly) e de hooks próprios, e depois um passo pequeno de cada vez: carregar o Pyodide e rodar `1 + 1`; gravar os arquivos de `metro/` no sistema de arquivos virtual do Pyodide (`FS.mkdir`, `FS.writeFile`, `Promise.all` + `map`); carregar o `network.json`; montar o grafo uma vez e expor uma função Python para o JavaScript (`pyodide.globals.get`). Cada conceito novo veio com um exemplo resolvido num assunto sem relação (`useJoke`, `greet.py`, `animals/`), que o Raul depois aplicava no próprio código. O hook `usePyodide` foi escrito pelo Raul.

### 7. Funções de rota compartilhadas — 15/11/2026

> move those for me

**Resposta:** `Normalize`, `FindNodes` e `BestRoute` saíram de `python/main.py` e foram para `python/metro/routing.py`, para a CLI e o site usarem o mesmo código. As três rotas de referência foram rodadas de novo para confirmar que nada mudou.

### 8. Componentes e o primeiro mapa — 15/11/2026

> so to get done with everything from today all we need now is you map correct?

**Resposta:** StationPicker e RouteResult foram escritos pelo Raul (guiado: props, inputs controlados, `onSubmit`, estado subindo para o `App`, `map` para listas). A IA escreveu o primeiro mapa: um SVG desenhado a partir das coordenadas UTM das estações, com a rota pontilhada por cima.

### 9. Revisão do mapa v2 — 16/11/2026

> look at the map changes i had fable do it and tell me what do you think

**Resposta:** o Raul pediu ao Claude Fable que refizesse o mapa (Leaflet + mapa de fundo escuro, animações pela situação de cada linha, nomes que somem quando se sobrepõem). O Claude revisou: integração com React bem feita, mas duplicava a lógica de situação que o Raul ia escrever e adicionava uma dependência externa (os tiles do fundo). Decisão: manter, reaproveitar o `statusOf` dele nos componentes do Raul em vez de escrever um terceiro interpretador de situação, e depois remover a legenda de situação do mapa em favor do `LineStatusList` do Raul.

### 10. Proxy e situação ao vivo — 16/11/2026

> this useLineStatus is a new hook than?

**Resposta:** a IA escreveu a infraestrutura: `web/api/status.js` (função da Vercel que busca a página oficial, contornando o CORS) e um proxy de desenvolvimento no Vite para a mesma URL. O Raul escreveu o `useLineStatus` (fetch → `parseStatus` → `.toJs({ dict_converter: Object.fromEntries })`), mudou o `usePyodide` para devolver `{ search, parseStatus }` e fez o `search` em Python remontar o grafo com a situação atual (`.to_py()`). Testado com um "Paralisada" falso na Linha 1: Sé → Luz desviou pela Linha 3 → República → Linha 4.

### 11. Correções do deploy em produção — 16/11/2026

> ok on my local it is still blank

**Resposta:** dois problemas achados pelo console do navegador. (1) Uma prop `line` faltando no `LineStatusBadge` quebrava a página inteira; o Raul corrigiu. (2) No build de produção o Pyodide não achava seus arquivos de runtime (`python_stdlib.zip` 404): a IA estendeu o script de sincronização para copiar o runtime do Pyodide para `public/pyodide/`, e o Raul definiu `loadPyodide({ indexURL: '/pyodide/' })`.

### 12. Conferência do modelo com a realidade — 16/11/2026

> the math s wrong se to brigadeiro is giving around 9 minutes whereas in real life takes approx. 15 min

**Resposta:** a IA decompôs os 9,8 min passo a passo. O Raul percebeu que viagens numa linha só batem com a realidade e só as viagens com baldeação saem curtas; a causa é que a baldeação conta só a espera pelo próximo trem, não a caminhada entre plataformas (exceto Paulista ↔ Consolação). Registrado como limitação conhecida.

### 13. Estilo visual — 16-17/11/2026

> i want you to take control i want the icon to have circle around it [...] and styalize the input labels please

**Resposta:** a pedido, a IA fez o estilo visual com Tailwind: tema escuro, a marca "Detour" (fonte Parisienne), campos em pílula dividida com um botão redondo de busca em neon, um ícone próprio desenhado a partir do esboço do Raul (`StationIcon`), o botão de viagens salvas, um painel flutuante para a rota (para o mapa nunca se mexer), a linha do tempo da rota e a situação das linhas desenhada como uma linha de metrô com 18 nós. O Raul definiu o layout e o visual; a IA escreveu as classes e o markup, sem mudar a lógica dos componentes dele.

### 14. CRUD de viagens salvas, guiado — 17/11/2026

> created the trips resource nopw what i never used or even heard of this mockapi

**Resposta:** uma explicação do MockAPI como uma tabela online acessada por URLs, depois quatro passos pequenos, cada um com um exemplo resolvido numa API de "notas" sem relação: ler (`GET`), criar (`POST`, `JSON.stringify`, `[...lista, item]`), renomear (`PUT /trips/:id`, `lista.map`) e excluir (`DELETE`, `lista.filter`). O Raul escreveu `services/tripsService.js` e `hooks/useSavedTrips.js`; as revisões pegaram uma função devolvida sem ser chamada (`response.json`), o atalho `{ newName }` mandando o campo com o nome errado e um `return (a, b)` que só devolvia `b`.

### 15. Viagens salvas na tela — 17/11/2026

> netx is the read and delete and update all inside the save bookmark you cna also do that

**Resposta:** o Raul sugeriu tirar a origem e o destino da própria rota (a primeira e a última estação) em vez do texto digitado. A pedido, a IA fez as telas: um botão "Salvar viagem" no painel da rota (desativado como "Viagem salva" quando a mesma viagem já existe), o menu do marcador com contador, o `SavedTripItem` (buscar de novo com a situação de hoje, renomear na própria lista, excluir) e ícones de linha desenhados para as ações. A busca no `App` virou uma função com nome, `runSearch`, usada pelos campos e pelo menu.

## Aplicação no projeto

| Item | Papel da IA |
|---|---|
| Estrutura Vite + React + Tailwind | Gerado |
| `scripts/sync-python.mjs` (pacote Python, dados da rede, runtime do Pyodide) | Gerado |
| Arquitetura (Pyodide no navegador, função serverless de situação) | Sugerido |
| `hooks/usePyodide.js` | Guiado (escrito pelo Raul) |
| `hooks/useLineStatus.js` | Guiado (escrito pelo Raul) |
| `lib/groupRoute.js` | Guiado (escrito pelo Raul) |
| `StationPicker`, `RouteResult`, `LineStatusBadge`, `LineStatusList` — lógica | Guiado (escrito pelo Raul) |
| Os mesmos componentes — estilo visual (classes Tailwind, markup) | Gerado a pedido |
| `App.jsx` — estado, busca, mensagens de erro | Guiado (escrito pelo Raul) |
| `App.jsx` — layout da página (cabeçalho, painel flutuante, tamanhos) | Gerado a pedido |
| `MetroMap` v1 (SVG) | Gerado (Claude) |
| `MetroMap` v2 (Leaflet), `lib/mapGeometry.js`, `lib/lineStatus.js`, `MetroMap.css` | Gerado (Claude Fable, a pedido do Raul); legenda de situação removida depois pelo Claude |
| `services/networkService.js` | Gerado |
| `services/tripsService.js`, `hooks/useSavedTrips.js` (CRUD) | Guiado (escrito pelo Raul) |
| Botão "Salvar viagem", lista do `SavedTripsMenu`, `SavedTripItem`, `icons/ActionIcons`, `runSearch` | Gerado a pedido (ideia da origem/destino pelo Raul) |
| `api/status.js`, proxy de desenvolvimento do Vite | Gerado |
| `Logo`, `SavedTripsMenu`, `icons/StationIcon` (do esboço do Raul), `icons/BookmarkIcon` | Gerado a pedido |
| `python/metro/routing.py` — `Normalize`, `FindNodes`, `BestRoute` movidos de `main.py` | Movido a pedido |
| Documentação e tradução (ptBR/enUS) | Gerado |

## Validação das respostas

- **Mesmos resultados que a CLI:** no navegador, Sé → Luz = 206 s (3,4 min), igual ao `python/main.py`. Artur Alvim → Paraíso ≈ 35 min e Capão Redondo → Luz ≈ 51 min foram rodados de novo depois de mover as funções.
- **Situação na rota:** com um "Paralisada" falso na Linha 1, Sé → Luz passou para Linha 3 → República → Linha 4, o caminho que um passageiro faria na vida real.
- **CRUD:** um ciclo completo no MockAPI, conferido no app e no painel do próprio MockAPI: salvar Sé → Luz, o botão muda para "Viagem salva", renomear, buscar de novo pelo menu, excluir.
- **Casos de borda:** uma estação inexistente ("xyz") mostra "Rota indisponível" em vez de quebrar; clicar antes do Pyodide terminar de carregar mostra uma mensagem de carregamento.
- **Produção:** cada correção foi conferida no link da Vercel, não só localmente (página em branco, 404 do Pyodide, mapa, lista de situação).
- **Modelo vs. realidade:** comparado com viagens reais — viagens numa linha só batem; viagens com baldeação saem curtas (veja as limitações).

Bugs encontrados nos testes e corrigidos:

- Um arquivo buscado no caminho errado voltava como `index.html` (o fallback do Vite) e era gravado no Pyodide como se fosse código Python.
- Um import relativo (`from .travel_time`) falhava até os arquivos ficarem num pacote `metro/` com `__init__.py`.
- Passar uma função para um setter de estado fazia o React chamá-la; corrigido com `setX(() => fn)`.
- Resultados do Python chegavam ao React como proxies; corrigido com `.toJs()` (e `dict_converter` para dicionários).
- Uma prop `line` faltando no `LineStatusBadge` deixava a página de produção em branco.
- Os arquivos de runtime do Pyodide não entravam no build de produção.

## Análise crítica

**Onde a IA ajudou:** explicando cada conceito novo (hooks próprios, efeitos, sistema de arquivos do Pyodide, props, inputs controlados, renderização condicional) com um exemplo resolvido antes de o Raul aplicar, lendo o código dele e apontando a linha exata em vez de reescrever, na infraestrutura que ele ainda não tinha estudado (função serverless, proxy de desenvolvimento, scripts de build) e no estilo visual que ele pediu.

**Onde a IA errou ou precisou ser corrigida:**
- O primeiro mapa dela foi substituído: o Raul pediu a outro modelo um mais completo. A revisão então teve de lidar com lógica de situação duplicada.
- Às vezes usou termos antes de explicá-los; o Raul pediu explicações mais simples, e os exemplos resolvidos viraram o padrão.
- O problema de deploy com os arquivos de runtime do Pyodide era previsível e só foi pego no primeiro deploy de produção.

**Limitações da solução:**
- **As baldeações não incluem o tempo de caminhada** entre plataformas (exceto Paulista ↔ Consolação), então rotas com baldeação saem mais curtas que as viagens reais (Sé → Brigadeiro: 9,8 min contra cerca de 15 min).
- A primeira visita baixa cerca de 13 MB do Pyodide; a busca só funciona depois que termina de carregar.
- A situação depende do HTML da página oficial e de a Vercel conseguir acessá-la.
- O fundo do mapa depende de um servidor de tiles externo (Esri).
- As limitações do modelo em Python também valem (hipótese de 50% na velocidade reduzida, situação por linha inteira, tempo de parada médio do dia, distâncias em linha reta).

**Conclusão:** o Raul escreveu a lógica da aplicação — os hooks, a integração com a rota e o comportamento dos componentes — guiado um passo de cada vez; a IA escreveu a infraestrutura, a documentação e, a pedido, a camada visual. Cada mudança foi rodada no navegador, localmente e em produção, antes de ser aceita.
