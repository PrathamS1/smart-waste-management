import openrouteservice

# Replace with your actual ORS API key
client = openrouteservice.Client(key='5b3ce3597851110001cf6248043b3db39d7b49919b8a6178feb2936d')

# Example: Get distance between two coordinates (lon, lat)
coords = ((77.5946, 12.9716), (77.7000, 13.0000))  # Example: Bangalore points

route = client.directions(coords, profile='driving-car', format='geojson')
distance = route['features'][0]['properties']['segments'][0]['distance']
duration = route['features'][0]['properties']['segments'][0]['duration']

print(f"Distance: {distance} meters, Duration: {duration} seconds")
