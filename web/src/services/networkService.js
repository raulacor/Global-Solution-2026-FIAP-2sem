// Loads the metro network (stations + neighbors) that sync-python.mjs copies to public/py/.
// Same file the Python core reads, so the map and the routing always agree.
export async function fetchNetwork() {
  const response = await fetch('/py/network.json')
  if (!response.ok) throw new Error(`network.json: HTTP ${response.status}`)
  return response.json()
}
