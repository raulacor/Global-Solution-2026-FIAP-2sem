import usePython from "./hooks/usePyodide"

function App() {
  const python = usePython()
  return (
    <>
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-2xl font-semibold">GS 2026.2 — CitizenTech</h1>
    </main>
    <p>{python === null ? "loading" : python.runPython('1+1')}</p>
    </>
  )
}

export default App
