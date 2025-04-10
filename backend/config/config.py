from pymongo import MongoClient
from dotenv import dotenv_values

config=dotenv_values(".env")
# Retrieve environment variables
MONGO_URI = config['MONGO_URI']
MONGO_DB = config['MONGO_DB']

# Check if MONGO_URI is set
if not MONGO_URI:
    print('Error: MONGO_URI environment variable not found.')
    exit(1)
else:
    print('MONGO_URI environment variable found.')

# Create a MongoClient object
client = MongoClient(MONGO_URI)

# Check if the database is accessible
try:
    client.admin.command('ping')
    print("MongoDB connection successful.")
except Exception as e:
    print(f"MongoDB connection failed: {e}")

# Check if MONGO_DB is set
if not MONGO_DB:
    print('Error: MONGO_DB environment variable not found.')
    exit(1)
else:
    print('MONGO_DB environment variable found.', MONGO_DB) 

# Access the database
db = client[MONGO_DB]
# Check if the database is accessible
try:
    db.command('ping')
    print("Database connection successful.")
except Exception as e:
    print(f"Database connection failed: {e}")
# Check if the collection exists
try:
    if 'bins' in db.list_collection_names():
        print("Collection 'bins' exists.")
    else:
        print("Collection 'bins' does not exist.")
except Exception as e:
    print(f"Error checking collection: {e}")
