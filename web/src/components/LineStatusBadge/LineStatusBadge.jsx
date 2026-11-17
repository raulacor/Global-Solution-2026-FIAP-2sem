import { LINE_COLORS } from '../../lib/mapGeometry'
import { statusOf } from '../../lib/lineStatus'

export default function LineStatusBadge({status}) {
  return (
    <li>
        <span className='inline-flex items-center gap-2'>
            <span className='h-3 w-3 rounded-full' style={{backgroundColor: LINE_COLORS[line]} } />
            {line}
        </span>
        <p>{statusOf(status).text}</p>
    </li>
  )
}