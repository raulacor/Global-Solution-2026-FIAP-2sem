import groupRoute from "../../lib/groupRoute"


export default function RouteResult({ route }) {
    const totalSeconds = route[0]
    const mins = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const group = groupRoute(route[1])
    
    return (
        <>
        <h3>Tempo estimado: {mins}:{seconds}</h3>
        {group.map((group, l) => (
            <div key={l}>
                <h2>{group.line}</h2>
                <ul>
                    {group.lines.map((station, j) =>(
                        <li key={j}>{station}</li>
                    ))}
                </ul>

            </div>
        ))}    
        </>


    )    
}