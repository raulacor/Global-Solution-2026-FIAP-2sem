import { useState, useEffect } from 'react'
import { loadPyodide } from 'pyodide'


export default function usePython() {
    const functions = ['travel_time.py', 'routing.py', 'network.py', 'line_status.py']
    const [search, setSearch] = useState(null)
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

            pyodide.runPython(`
            import json
            from metro.network import BuildGraph
            from metro.routing import FastestRoute, Normalize, FindNodes, BestRoute
            
            with open("network.json", "r", encoding="utf-8") as network:
                networkDict = json.load(network)

            networkGraph = BuildGraph(networkDict)
            
            def Search(startStation, targetStation):
                start = FindNodes(networkGraph, startStation)
                target = FindNodes(networkGraph, targetStation)
                route = BestRoute(networkGraph, start, target)
            
                return route

  
            `)
            const search = pyodide.globals.get("Search")
            setSearch(() => search)
        }
        load()
    }, [])

    return search
}

