from config.config import db
from bson.objectid import ObjectId

#& Bin Model
class Bin:
    def __init__(self, city_id, latitude, longitude , capacity, fill_percentage):
        self.city_id = city_id
        self.latitude = latitude
        self.longitude = longitude
        self.capacity = capacity
        self.fill_percentage = fill_percentage

    def save(self):
        bins_collection = db.bins
        bins_collection.insert_one(self.__dict__)
    
    @staticmethod
    def get_all():
        bins_collection = db.bins
        print(list(bins_collection.find({}, {'_id':0})))
        return list(bins_collection.find({}, {'_id':0}))

    @staticmethod
    def get_by_id(bin_id):
        bins_collection = db.bins
        print(bins_collection.find_one({'_id':ObjectId(bin_id)}, {'_id':0}))
        return bins_collection.find_one({"_id": ObjectId(bin_id)}, {'_id':0})
    
    @staticmethod
    def get_by_city(city_id):
        bins_collection = db.bins
        try:
            city_id = int(city_id)
        except ValueError:
            return {"error": "Invalid city_id format"}, 400        
        print(f"City ID: {city_id}, Type: {type(city_id)}")
        
        try:
            bins_in_city = list(bins_collection.find({"city_id": city_id}, {'_id':0}))
        except Exception as e:
            print(f"Error occurred while fetching bins for city {city_id}: {e}")
            return {"error": f"Error occurred while fetching bins for city {city_id}"}, 500
        
        if not bins_in_city:
            print("No bins found for this city.")
            return {"message": "No bins found for this city."}
        
        return bins_in_city
    
    @staticmethod
    def update_bin(bin_id, new_data):
        bins_collection = db.bins
        bins_collection.update_one({"_id": ObjectId(bin_id)}, {"$set": new_data})
        return {"message": "Bin updated successfully"}

    @staticmethod
    def delete_bin(bin_id):
        bins_collection = db.bins
        bins_collection.delete_one({"_id": ObjectId(bin_id)})
        return {"message": "Bin deleted successfully"}
