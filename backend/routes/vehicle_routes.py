from flask import Blueprint, request, jsonify
from models.vehicle_model import Vehicle

vehicle_routes = Blueprint('vehicle_routes', __name__)

#* Get all vehicles
@vehicle_routes.route('/vehicles', methods=['GET'])
def get_all_vehicles():
    vehicles = Vehicle.get_all_vehicles()
    return jsonify(vehicles), 200

#* Get vehicle by vehicle license
@vehicle_routes.route('/vehicles/<vehicle_license>', methods=['GET'])
def get_vehicle_by_license(vehicle_license):
    vehicle=Vehicle.get_vehicle_by_license(vehicle_license)
    if isinstance(vehicle, tuple):
        return jsonify(vehicle[0]), vehicle[1]
    return jsonify(vehicle), 200

#* Add a new vehicle
@vehicle_routes.route('/vehicles', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    required_fields = ["vehicle_license", "load_capacity", "latitude", "longitude"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    new_vehicle = Vehicle(
        vehicle_license=data["vehicle_license"],
        load_capacity=data["load_capacity"],
        latitude=data["latitude"],
        longitude=data["longitude"],
        current_load=data.get("current_load", 0),
        assigned_bins=data.get("assigned_bins", []),
        status=data.get("status", "available")
    )
    new_vehicle.save()
    return jsonify({"message": "Vehicle added successfully"}), 201

#* Update a vehicle
@vehicle_routes.route('/vehicles/<vehicle_license>', methods=['PATCH'])
def update_vehicle(vehicle_license):
    data = request.get_json()
    updated_vehicle = Vehicle.update_vehicle(vehicle_license, data)
    if updated_vehicle:
        return jsonify({"message": "Vehicle updated successfully"}), 200
    else:
        return jsonify({"error": "Vehicle not found"}), 404

#* Delete a vehicle
@vehicle_routes.route('/vehicles/<vehicle_license>', methods=['DELETE'])
def delete_vehicle(vehicle_license):
    deleted_vehicle = Vehicle.delete_vehicle(vehicle_license)
    if not deleted_vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    return jsonify({"message": "Vehicle deleted successfully"}), 200

#* Assign bins to vehicle
@vehicle_routes.route('/vehicles/<vehicle_license>/assign_bins', methods=['POST'])
def assign_bins_to_vehicle(vehicle_license):
    data = request.get_json()
    if 'bins' not in data or not isinstance(data['bins'], list):
        return jsonify({"error": "Invalid input, expected 'bins' as a list"}), 400
    assigned_bins = Vehicle.assign_bins_to_vehicle(vehicle_license, data['bins'])
    if not assigned_bins:
        return jsonify({"error": "Vehicle not found"}), 404
    
    return jsonify({"message": "Bins assigned successfully"}), 200

#* Get assigned bins of vehicle
@vehicle_routes.route('/vehicles/<vehicle_license>/assigned_bins', methods=['GET'])
def get_assigned_bins_of_vehicle(vehicle_license):
    assigned_bins = Vehicle.get_assigned_bins_of_vehicle(vehicle_license)
    if assigned_bins == []:
        return jsonify({"message": "No bins assigned to the vehicle"}), 200
    if not assigned_bins:
        return jsonify({"error": "Vehicle not found"}), 404
    return jsonify(assigned_bins), 200