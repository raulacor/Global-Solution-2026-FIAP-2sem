"""Rota mais rápida entre duas estações da rede."""
import heapq

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