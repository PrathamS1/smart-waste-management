from flask import Blueprint, request, jsonify
from models.bin_model import Bin

bin_routes = Blueprint('bin_routes', __name__)

#* Get all bins
@bin_routes.route('/bins', methods=['GET'])
def get_all_bins():
    bins=Bin.get_all()
    return jsonify(bins), 200

#* Get bins by city
@bin_routes.route('/bins/<city_id>', methods=['GET'])
def get_bins_by_city(city_id):
    bins=Bin.get_by_city(city_id)
    return jsonify(bins), 200

#* Add a new bin
@bin_routes.route('/bins', methods=['POST'])
def add_bin():
    data = request.get_json()
    new_bin = Bin(data['bin_id'], data['city_id'], data['latitude'], data['longitude'], data['capacity'], data['fill_percentage'])
    new_bin.save()
    return jsonify({"message": "Bin added successfully"}), 201

#* Update a bin
@bin_routes.route('/bins/<bin_id>', methods=['PATCH'])
def update_bin(bin_id):
    data = request.get_json()
    updated_bin = Bin.update_bin(bin_id, data)
    return jsonify(updated_bin), 200

#* Delete a bin
@bin_routes.route('/bins/<bin_id>', methods=['DELETE'])
def delete_bin(bin_id):
    deleted_bin = Bin.delete_bin(bin_id)
    return jsonify(deleted_bin), 200

#* Get bin by id
@bin_routes.route('/bins/id/<bin_id>', methods=['GET'])
def get_bin_by_id(bin_id):
    bin = Bin.get_by_id(bin_id)
    return jsonify(bin), 200