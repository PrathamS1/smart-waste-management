import heapq
import openrouteservice
from bson.objectid import ObjectId
from dotenv import dotenv_values
from config.config import db
from flask import jsonify

config = dotenv_values(".env")
ORS_API_KEY = config['ORS']
client = openrouteservice.Client(key=ORS_API_KEY)

def fetch_filtered_bins_and_coords():
    # Get bins with fill above threshold
    bins = list(db.bins.find({"fill_percentage": {"$gte": FILL_THRESHOLD}}))
    bin_coords = [(bin['longitude'], bin['latitude']) for bin in bins]

    index_map = {}
    for i, bin in enumerate(bins):
        index_map[i] = {
            "type": "bin",
            "id": str(bin["_id"]),
            "fill": bin.get("fill_percentage", 0)
        }

    return bin_coords, bins, index_map

def build_global_bin_graph():
    FILL_THRESHOLD = 60
    bins = list(db.bins.find({"fill_percentage": {"$gte": FILL_THRESHOLD}}))

    if not bins:
        return {"graph": {}, "index_map": {}, "nodes": 0}

    coords = [(bin['longitude'], bin['latitude']) for bin in bins]

    index_map = {
        i: {
            "type": "bin",
            "id": str(bin["_id"]),
            "fill": bin.get("fill_percentage", 0),
            "longitude": bin["longitude"],
            "latitude": bin["latitude"]
        }
        for i, bin in enumerate(bins)
    }

    graph = {i: {} for i in range(len(coords))}
    for i in range(len(coords)):
        for j in range(len(coords)):
            if i != j:
                try:
                    route = client.directions([coords[i], coords[j]], profile='driving-car')
                    distance = route['routes'][0]['summary']['distance']
                    graph[i][j] = round(distance, 1)
                except Exception as e:
                    print(f"ORS error between bin {i} and {j}: {e}")
                    graph[i][j] = float('inf')

    return {
        "graph": graph,
        "index_map": index_map,
        "nodes": len(coords)
    }



def dijkstra_optimized_route(graph_data, vehicle):
    graph = graph_data['graph']
    index_map = graph_data['index_map']

    start_node = 0
    vehicle_capacity = vehicle.get("load_capacity", 0)

    index_map[start_node] = {
        "type": "start",
        "id": str(vehicle["_id"]),
        "capacity": vehicle_capacity,
        "license": vehicle.get("vehicle_license", "")
    }

    n = graph_data['nodes']
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

def multi_vehicle_routing(graph_data, all_vehicles):
    all_results = []
    used_bin_ids = set()

    global_index_map = graph_data['index_map']

    for vehicle in all_vehicles:
        start_coord = (vehicle['longitude'], vehicle['latitude'])
        vehicle_capacity = vehicle['load_capacity']

        # Filter unused bins from the global index_map
        available_bins = [
            (idx, info) for idx, info in global_index_map.items()
            if info["type"] == "bin" and info["id"] not in used_bin_ids
        ]

        if not available_bins:
            break

        coords = [start_coord] + [
            (bin_info['longitude'], bin_info['latitude']) for _, bin_info in available_bins
        ]

        # Create local index_map for this vehicle's subgraph
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
        for new_idx, (orig_idx, bin_info) in enumerate(available_bins, start=1):
            index_map[new_idx] = bin_info

        # Build subgraph using OpenRouteService
        subgraph = {}
        for i in range(len(coords)):
            subgraph[i] = {}
            for j in range(len(coords)):
                if i != j:
                    try:
                        route = client.directions([coords[i], coords[j]], profile='driving-car')
                        subgraph[i][j] = round(route['routes'][0]['summary']['distance'], 1)
                    except:
                        subgraph[i][j] = float('inf')

        # Run Dijkstra for this vehicle
        result = dijkstra_optimized_route({
            "graph": subgraph,
            "index_map": index_map,
            "nodes": len(coords)
        }, vehicle)

        # Update used bins
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

def compute_multi_vehicle_route():
    vehicles = list(db.vehicles.find())
    if not vehicles:
        return jsonify({"error": "No vehicles found"}), 400
    graph_data = build_global_bin_graph()
    print("Graph data built successfully\n", graph_data)
    all_routes = multi_vehicle_routing(graph_data, vehicles)

    return jsonify({
        "routes": all_routes
    })