from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from routes.bin_routes import bin_routes

app=Flask(__name__)
CORS(app)
socketIo=SocketIO(app)

app.register_blueprint(bin_routes, url_prefix='/api')

@app.route('/')
def home():
    return "Smart Waste Management System Simulator"

if __name__ == '__main__':
    socketIo.run(app, host='localhost', port=5000, debug=True)

@socketIo.on('update_bin')
def handle_bin_update(data):
    print(f"Bin update received: {data}")
    socketIo.emit('bin_update', data, broadcast=True)

@socketIo.on('update_route')
def handle_route_update(data):
    print(f"Route update received: {data}")
    socketIo.emit('route_update', data, broadcast=True)