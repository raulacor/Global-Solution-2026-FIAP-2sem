"""Rota mais rápida entre duas estações da rede."""
import heapq
import unicodedata

def FastestRoute(graph, start, goal):
    dist = {start: 0}          # node → best time so far [s]
    prev = {}
    heap = [(0, start)]


    while heap:
        time, node = heapq.heappop(heap)
        if node == goal:
            path = [goal]
            node = goal
            while node != start:
                node = prev[node]
                path.append(node)
            path.reverse()
            return dist[goal], path

        if time > dist[node]:
            continue

        for neighbor, cost in graph[node]:
            new_time = time + cost     # [s] + [s] = [s]

            if neighbor not in dist or new_time < dist[neighbor]:
                dist[neighbor] = new_time
                prev[neighbor] = node

                heapq.heappush(heap, (new_time, neighbor))

    return None # If this path is unreachble


def Normalize(text):
    """'Paraíso ' → 'PARAISO': uppercase, no accents, no extra spaces."""
    text = unicodedata.normalize("NFD", text.strip().upper())
    return "".join(c for c in text if unicodedata.category(c) != "Mn")

def FindNodes(graph, typed):
    """Every (station, line) node whose name matches what the user typed."""
    nodes = []
    for station, line in graph:
        if Normalize(station) == Normalize(typed):
            nodes.append((station, line))
    return nodes

def BestRoute(graph, start_nodes, goal_nodes):
    """Try every start × goal node and keep the fastest. Returns (seconds, path) or None."""
    best = None
    for start in start_nodes:
        for goal in goal_nodes:
            result = FastestRoute(graph, start, goal)
            if result is not None and (best is None or result[0] < best[0]):
                best = result
    return best
