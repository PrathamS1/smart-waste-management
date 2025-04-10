from config.config import db
from bson.objectid import ObjectId

#& Vehicle Model
class Vehicle:
    def __init__(self, city_id, vehicle_license, load_capacity, latitude, longitude, current_load=0, assigned_bins=None, status="available"):
        self.city_id = city_id
        self.vehicle_license = vehicle_license
        self.load_capacity = load_capacity
        self.current_load = current_load
        self.latitude = latitude
        self.longitude = longitude
        self.assigned_bins = assigned_bins if assigned_bins is not None else []
        self.status = status
    
    def save(self):
        vehicles_collection = db.vehicles
        vehicles_collection.insert_one(self.__dict__)
    
    @staticmethod
    def get_all_vehicles():
        vehicles_collection = db.vehicles
        vehicles = list(vehicles_collection.find({}))
        
        for vehicle in vehicles:
            vehicle["_id"] = str(vehicle["_id"])
        
        return vehicles
    
    @staticmethod
    def get_vehicle_by_license(vehicle_license):
        vehicles_collection = db.vehicles
        vehicle = vehicles_collection.find_one({"vehicle_license": vehicle_license}, {'_id':0})
        if not vehicle:
            return {"message": "Vehicle not found"}, 404
        return vehicle
    
    @staticmethod
    def update_vehicle(vehicle_license, new_data):
        if "assigned_bins" in new_data:
            new_data["assigned_bins"] = [ObjectId(bin_id) for bin_id in new_data["assigned_bins"]]
        
        new_data["vehicle_license"] = vehicle_license
        result = db.vehicles.update_one({"vehicle_license": vehicle_license}, {"$set": new_data})
        
        return result.modified_count > 0

    @staticmethod
    def delete_vehicle(vehicle_license):
        result = db.vehicles.delete_one({"vehicle_license": vehicle_license})
        return result.deleted_count > 0
    
    @staticmethod
    def assign_bins_to_vehicle(vehicle_license, bins):
        vehicles_collection = db.vehicles
        bin_ids = [ObjectId(bin_id) for bin_id in bins]
        result = vehicles_collection.update_one({"vehicle_license": vehicle_license}, {"$set": {"assigned_bins": bin_ids}})
        return result.modified_count > 0

    @staticmethod
    def get_assigned_bins_of_vehicle(vehicle_license):
        vehicle = db.vehicles.find_one({"vehicle_license": vehicle_license}, {'_id': 0})
        return vehicle.get("assigned_bins", []) if vehicle else False