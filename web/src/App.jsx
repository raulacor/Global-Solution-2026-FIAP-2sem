import usePython from "./hooks/usePyodide"

function App() {
  const python = usePython()
  return (
    <>
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-2xl font-semibold">GS 2026.2 — CitizenTech</h1>
    </main>
    <p>{python === null ? "loading" : python.runPython(`
    import json
    from metro.network import BuildGraph
    from metro.routing import FastestRoute

    with open("network.json", "r", encoding="utf-8") as network:
      networkDict = json.load(network)
    graph = BuildGraph(networkDict)
    route = FastestRoute(graph, ("SÉ", "AZUL"), ("LUZ", "AZUL"))
    print(route)
    `)}
    </p>
    </>
  )
}

export default App
