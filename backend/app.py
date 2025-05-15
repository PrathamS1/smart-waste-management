from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS
from routes.bin_routes import bin_routes
from routes.vehicle_routes import vehicle_routes
from utils.optimization import optimization_routes, test_routes
import eventlet
eventlet.monkey_patch()

app=Flask(__name__)
# CORS(app)
# socketIo=SocketIO(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:4000"}}, supports_credentials=True)
socketIo = SocketIO(app, cors_allowed_origins="http://localhost:4000", async_mode="eventlet")

app.register_blueprint(bin_routes, url_prefix='/api')
app.register_blueprint(vehicle_routes, url_prefix='/api')
app.register_blueprint(optimization_routes, url_prefix='/api')
app.register_blueprint(test_routes, url_prefix='/api')

@app.route('/')
def home():
    return "Smart Waste Management System Simulator"


@socketIo.on('update_bin')
def handle_bin_update(data):
    print(f"Bin update received: {data}")
    socketIo.emit('bin_update', data, broadcast=True)

@socketIo.on('update_route')
def handle_route_update(data):
    print(f"Route update received: {data}")
    socketIo.emit('route_update', data, broadcast=True)

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        return '', 200

if __name__ == '__main__':
    socketIo.run(app, host='localhost', port=5000, debug=True)