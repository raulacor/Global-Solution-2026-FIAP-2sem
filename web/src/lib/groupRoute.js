export default function groupRoute(route) {
    const groups = []
    for (const [station, line] of route) {
        const lastStation = groups[groups.length -1]
        if (lastStation === undefined || lastStation.line != line) {
            groups.push({line, lines: [station]})
        } else {
            lastStation.lines.push(station)
        }
    }
    return groups
}