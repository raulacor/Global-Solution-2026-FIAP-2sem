import useSearch from "./hooks/usePyodide"

function App() {
  const search = useSearch()
  return (
    <>
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-2xl font-semibold">GS 2026.2 — CitizenTech</h1>
    </main>
    <p>{search === null ? "loading" : search("se", "luz").toJs()[0]}
    </p>
    </>
  )
}

export default App
