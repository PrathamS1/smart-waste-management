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
import binIconSrc from "../assets/bin.png";
import startIconSrc from "../assets/start.png";

import { useEffect, useState } from "react";

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

function BinMap({ center, bins, mapRef, onMapClickForStart, startLocation }) {
  const [startLocationMarker, setStartLocationMarker] = useState(null);
  console.log("City center received: " + center);
  console.log("Start location marker received: ", startLocationMarker);
  startLocation(startLocationMarker);
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
      </MapContainer>
    </div>
  );
}

export default BinMap;
