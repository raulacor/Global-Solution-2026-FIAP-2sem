// Copia o pacote Python (python/metro) para web/public/py/metro,
// para que o Pyodide carregue no navegador exatamente o mesmo código que a CLI usa.
// Roda sozinho antes de `npm run dev` e `npm run build`. A pasta gerada fica fora do Git.
import { cpSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(new URL('../../python/metro', import.meta.url))
const target = fileURLToPath(new URL('../public/py/metro', import.meta.url))

rmSync(target, { recursive: true, force: true })
cpSync(source, target, {
  recursive: true,
  filter: (path) => !path.includes('__pycache__'),
})
console.log('[sync:py] python/metro -> web/public/py/metro')

// network.json (estações + vizinhos) também vai junto, para o BuildGraph rodar no navegador.
const network = fileURLToPath(new URL('../../python/data/network.json', import.meta.url))
const networkTarget = fileURLToPath(new URL('../public/py/network.json', import.meta.url))
cpSync(network, networkTarget)
console.log('[sync:py] python/data/network.json -> web/public/py/network.json')
