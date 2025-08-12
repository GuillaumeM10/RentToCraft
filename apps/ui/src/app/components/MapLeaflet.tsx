"use client";
import type { Icon } from "leaflet";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});

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
  const [icon, setIcon] = useState<Icon>();

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const L = await import("leaflet");
      if (mounted) {
        setIcon(new L.Icon({ iconUrl: "/images/map-marker.svg" }));
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
      {icon && <Marker icon={icon} position={[latitude, longitude]} />}
    </MapContainer>
  );
};

export default MapLeaflet;
