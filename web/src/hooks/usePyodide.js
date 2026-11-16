import { useState, useEffect } from 'react'
import { loadPyodide } from 'pyodide'


export default function usePython() {
    const functions = ['travel_time.py', 'routing.py', 'network.py', 'line_status.py']
    const [python, setPython] = useState(null)
    useEffect(() => {
        async function load() {
            const pyodide = await loadPyodide()
            pyodide.FS.mkdir('metro')
            pyodide.FS.writeFile('metro/__init__.py', '')

            const pythonFunctions = await Promise.all(
                functions.map(async (pythonFunction) => {
                    const response = await fetch('./py/metro/' + pythonFunction)
                    const pythonData = await response.text()
                    pyodide.FS.writeFile('metro/' + pythonFunction, pythonData)
                })    
            )    
            const jsonFile = await fetch('./py/network.json')
            const jsonData = await jsonFile.text()
            pyodide.FS.writeFile('network.json', jsonData)

    
            setPython(pyodide)
        }
        load()
    }, [])

    return python
}

