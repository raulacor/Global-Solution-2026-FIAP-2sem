export default function RouteResult({ route }) {
    const totalSeconds = route[0]
    const mins = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)

    return (
        <ul>
            <h3>Tempo estimado: {mins}:{seconds}</h3>
            {route[1].map(([name, line], index) => (
                <li key={index}>{name} - {line}</li>
            ))}
        </ul>
    )
}