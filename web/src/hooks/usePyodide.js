import { useState, useEffect } from 'react'
import { loadPyodide } from 'pyodide'


export default function usePython() {
    const [python, setPython] = useState(null)
    useEffect(() => {
        async function load() {
            const pyodide = await loadPyodide()
            setPython(pyodide)
        }
        load()
    }, [])

    return python
}

