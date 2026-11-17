import { LINE_COLORS } from '../../lib/mapGeometry'
import LineStatusBadge from '../LineStatusBadge/LineStatusBadge'

export default function LineStatusList({ statuses }) {
    return (
        <ul>
            {Object.keys(LINE_COLORS).map((line) => (
                <LineStatusBadge key={line} line={line} status={statuses?.[line]} />
            ))}
        </ul>
    )

}