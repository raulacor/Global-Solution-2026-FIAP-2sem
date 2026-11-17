import { useState, useEffect } from 'react'
import { loadPyodide } from 'pyodide'


export default function usePython() {
    const functions = ['travel_time.py', 'routing.py', 'network.py', 'line_status.py']
    const [func, setFunction] = useState({search: null, parseStatus: null})
    
    
    useEffect(() => {
        async function load() {
            const pyodide = await loadPyodide({ indexURL: '/pyodide/' })
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
            from metro.line_status import ParseStatus  
            
            with open("network.json", "r", encoding="utf-8") as network:
                networkDict = json.load(network)

                
            def search(startStation, targetStation, statuses):
                if statuses:
                    status = statuses.to_py()
                    networkGraph = BuildGraph(networkDict, status)
                else:
                    networkGraph = BuildGraph(networkDict)

                start = FindNodes(networkGraph, startStation)
                target = FindNodes(networkGraph, targetStation)
                route = BestRoute(networkGraph, start, target)
            
                return route

  
            `)
            const parseStatus = pyodide.globals.get("ParseStatus")
            const search = pyodide.globals.get("search")
            setFunction(() => ({search, parseStatus}))
        }
        load()
    }, [])

    return func
}

