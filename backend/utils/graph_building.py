import heapq
import openrouteservice
from bson.objectid import ObjectId
from dotenv import dotenv_values
from config.config import db
from flask import jsonify

# Load OpenRouteService client
config = dotenv_values(".env")
ORS_API_KEY = config['ORS']
client = openrouteservice.Client(key=ORS_API_KEY)

# === Dijkstra's Algorithm ===
def dijkstra_optimized_route(graph_data, vehicle):
    graph = graph_data['graph']
    index_map = graph_data['index_map']
    start_node = 0
    vehicle_capacity = vehicle.get("load_capacity", 0)

    visited_states = set()
    pq = [(0, start_node, 0, frozenset([start_node]), [start_node])]

    best_result = {
        "route": [],
        "total_distance": float("inf"),
        "collected_fill": 0
    }

    while pq:
        dist, node, collected, visited, route = heapq.heappop(pq)

        if collected <= vehicle_capacity and collected > best_result["collected_fill"]:
            best_result = {
                "route": route,
                "total_distance": dist,
                "collected_fill": collected
            }

        state = (node, collected, visited)
        if state in visited_states:
            continue
        visited_states.add(state)

        for neighbor in graph[node]:
            if neighbor in visited:
                continue

            neighbor_info = index_map[neighbor]
            extra_fill = neighbor_info['fill'] if neighbor_info['type'] == 'bin' else 0
            new_fill = collected + extra_fill

            if new_fill > vehicle_capacity:
                continue

            heapq.heappush(pq, (
                dist + graph[node][neighbor],
                neighbor,
                new_fill,
                visited | {neighbor},
                route + [neighbor]
            ))

    return best_result

# === Multi-Vehicle Route Planner ===
def multi_vehicle_routing(FILL_THRESHOLD=60):
    all_results = []
    used_bin_ids = set()
    all_vehicles = list(db.vehicles.find())

    if not all_vehicles:
        return []

    # Get bins above threshold
    bins = list(db.bins.find({"fill_percentage": {"$gte": FILL_THRESHOLD}}))
    if not bins:
        return []

    for vehicle in all_vehicles:
        start_coord = (vehicle['longitude'], vehicle['latitude'])
        print(f"Vehicle Start Coord: {start_coord}")
        vehicle_capacity = vehicle['load_capacity']

        # Filter out already-used bins
        available_bins = [
            bin for bin in bins if str(bin["_id"]) not in used_bin_ids
        ]
        if not available_bins:
            break

        # Build coordinates list (start + bins)
        coords = [start_coord] + [(bin["longitude"], bin["latitude"]) for bin in available_bins]
        print(f"Coordinates: {coords}")
        # Create index_map
        index_map = {
            0: {
                "type": "start",
                "id": str(vehicle["_id"]),
                "capacity": vehicle_capacity,
                "license": vehicle["vehicle_license"],
                "longitude": vehicle["longitude"],
                "latitude": vehicle["latitude"]
            }
        }
        for i, bin in enumerate(available_bins, start=1):
            index_map[i] = {
                "type": "bin",
                "id": str(bin["_id"]),
                "fill": bin.get("fill_percentage", 0),
                "longitude": bin["longitude"],
                "latitude": bin["latitude"]
            }

        # Build subgraph
        subgraph = {}
        for i in range(len(coords)):
            subgraph[i] = {}
            for j in range(len(coords)):
                if i != j:
                    try:
                        print(f"Fetching route from {i} to {j} having coords {coords[i]} to {coords[j]}")
                        route = client.directions([coords[i], coords[j]], profile='driving-car')
                        dist = round(route['routes'][0]['summary']['distance'], 1)
                        subgraph[i][j] = dist
                    except Exception as e:
                        print(f"Error: ORS from {i} to {j} failed: {e}")
                        subgraph[i][j] = float('inf')

        # ✅ Print Graph Details
        print("\n--- Subgraph for Vehicle ---")
        print(f"Vehicle ID: {vehicle['_id']}, License: {vehicle['vehicle_license']}")
        print("Graph:")
        for src in subgraph:
            print(f"{src}: {subgraph[src]}")
        print("Index Map:")
        for idx in index_map:
            print(f"{idx}: {index_map[idx]}")
        print("--- End of Graph ---\n")
        # Compute route
        result = dijkstra_optimized_route({
            "graph": subgraph,
            "index_map": index_map,
            "nodes": len(coords)
        }, vehicle)

        print(f"Result: {result}")
        # Track bins used
        used_bin_ids.update([
            index_map[n]['id'] for n in result['route']
            if index_map[n]['type'] == 'bin'
        ])

        route_bin_ids = [
            index_map[n]['id'] for n in result['route']
            if index_map[n]['type'] == 'bin'
        ]

        all_results.append({
            "vehicle_id": str(vehicle["_id"]),
            "license": vehicle["vehicle_license"],
            "route_node_indices": result["route"],
            "route_bin_ids": route_bin_ids,
            "total_distance": result["total_distance"],
            "collected_fill": result["collected_fill"]
        })

    return all_results

# === Flask Route ===
def compute_multi_vehicle_route():
    all_routes = multi_vehicle_routing()
    return jsonify({
        "routes": all_routes
    })
