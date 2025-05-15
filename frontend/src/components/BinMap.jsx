import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import binIconSrc from "../assets/bin.png";
import startIconSrc from "../assets/start.png";

import { useEffect, useState } from "react";

// Initialize Leaflet Routing Machine
import "leaflet-routing-machine";

const binIcon = new L.Icon({
  iconUrl: binIconSrc,
  iconSize: [35, 40],
  iconAnchor: [17, 40],
  popupAnchor: [0, -35],
});
const startIcon = new L.Icon({
  iconUrl: startIconSrc,
  iconSize: [30, 40],
});

const ClickHandler = ({ onMapClickForStart, setStartMarker }) => {
  useMapEvent("click", (e) => {
    if (onMapClickForStart) {
      onMapClickForStart({ lat: e.latlng.lat, lng: e.latlng.lng });
      setStartMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
};

const MapCenterer = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

// Routing Control Component
const RoutingControl = ({ positions, color, routeInfo }) => {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;

    // Create routing control
    const routingControl = L.Routing.control({
      waypoints: positions.map(pos => L.latLng(pos[0], pos[1])),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      lineOptions: {
        styles: [{ color, weight: 8, opacity: 0.7 }]
      },
      createMarker: () => null, // Don't create markers for waypoints
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      })
    }).addTo(map);

    // Add popup to the route
    routingControl.on('routesfound', (e) => {
      const route = e.routes[0];
      const routeLine = route.coordinates;
      const midPoint = routeLine[Math.floor(routeLine.length / 2)];
      
      L.popup()
        .setLatLng(midPoint)
        .setContent(`
          <div>
            <h3 class="font-semibold">Vehicle ${routeInfo.index + 1}</h3>
            <p>License: ${routeInfo.license}</p>
            <p>Collected Fill: ${routeInfo.collected_fill} units</p>
          </div>
        `)
        .addTo(map);
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, positions, color, routeInfo]);

  return null;
};

function BinMap({ center, bins, mapRef, onMapClickForStart, startLocation, routes, routeBins }) {
  const [startLocationMarker, setStartLocationMarker] = useState(null);
  console.log("City center received: " + center);
  console.log("Start location marker received: ", startLocationMarker);
  console.log("Routes received in BinMap:", routes);
  console.log("Route bins received in BinMap:", routeBins);
  startLocation(startLocationMarker);

  // Function to get different colors for different routes
  const getRouteColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    return colors[index % colors.length];
  };

  // Function to create route positions
  const createRoutePositions = () => {
    if (!routes || !routeBins || routeBins.length === 0) {
      console.log("No routes or route bins available");
      return [];
    }

    return routes.map((route, index) => {
      const positions = route.route_bin_ids.map((_, idx) => {
        const bin = routeBins[idx];
        return bin ? [bin.latitude, bin.longitude] : null;
      }).filter(pos => pos !== null);

      if (startLocationMarker) {
        positions.unshift([startLocationMarker.lat, startLocationMarker.lng]);
      }

      return {
        positions,
        color: getRouteColor(index),
        routeInfo: {
          index,
          license: route.license,
          collected_fill: route.collected_fill
        }
      };
    });
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapCenterer center={center} />
        <ClickHandler
          onMapClickForStart={onMapClickForStart}
          setStartMarker={setStartLocationMarker}
        />
        {bins.map((bin) => (
          <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={binIcon}>
            <Popup>
              Bin ID: {bin.id} <br />
              Fill: {bin.fill}%
            </Popup>
          </Marker>
        ))}
        {startLocationMarker && (
          <Marker
            position={[startLocationMarker.lat, startLocationMarker.lng]}
            icon={startIcon}
          >
            <Popup>Start Location</Popup>
          </Marker>
        )}
        {createRoutePositions().map((route, index) => (
          <RoutingControl
            key={`route-${index}`}
            positions={route.positions}
            color={route.color}
            routeInfo={route.routeInfo}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default BinMap;
