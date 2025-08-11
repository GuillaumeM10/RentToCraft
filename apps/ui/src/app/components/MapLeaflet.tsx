"use client";
import { Icon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

type MapProps = {
  readonly longitude?: number;
  readonly latitude?: number;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
  readonly zoom?: number;
};

const MapLeaflet = ({
  longitude,
  latitude,
  width,
  height = 300,
  className = "",
  zoom = 13,
}: MapProps) => {
  if (!latitude || !longitude) {
    return null;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ width, height, zIndex: 0 }}
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        icon={new Icon({ iconUrl: "/images/map-marker.svg" })}
        position={[latitude, longitude]}
      />
    </MapContainer>
  );
};

export default MapLeaflet;
