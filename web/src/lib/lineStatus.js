// Turns the status text published by Direto do Metrô into one of six "kinds".
// Each kind has its own animation on the map (see components/MetroMap/MetroMap.css)
// and mirrors what the Python core does with it (metro/line_status.py).

export const STATUS_KINDS = {
  normal: { label: 'Operação normal', hint: 'trens circulando normalmente' },
  reduced: { label: 'Velocidade reduzida', hint: 'trens mais lentos' },
  partial: { label: 'Operação parcial', hint: 'só parte da linha funciona' },
  stopped: { label: 'Paralisada', hint: 'linha parada' },
  closed: { label: 'Operação encerrada', hint: 'fora do horário' },
  unknown: { label: 'Sem informação', hint: 'situação desconhecida' },
}

// 'Operação Normal' → 'operacao normal'
function simplify(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .trim()
    .toLowerCase()
}

const KIND_BY_TEXT = {
  'operacao normal': 'normal',
  'velocidade reduzida': 'reduced',
  'operacao parcial': 'partial',
  paralisada: 'stopped',
  'operacao encerrada': 'closed',
}

// entry: what ParseStatus gives for one line — { status, info } — or just the status text.
// No entry at all means nothing was reported for the line, so it is shown as running normally.
export function statusOf(entry) {
  if (entry === undefined || entry === null) {
    return { kind: 'normal', text: STATUS_KINDS.normal.label, info: '' }
  }
  const text = typeof entry === 'string' ? entry : (entry.status ?? '')
  const info = typeof entry === 'string' ? '' : (entry.info ?? '')
  const kind = KIND_BY_TEXT[simplify(text)] ?? 'unknown'
  return { kind, text: text || STATUS_KINDS.unknown.label, info }
}
