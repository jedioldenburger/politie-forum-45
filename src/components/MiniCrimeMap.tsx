'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

export default function MiniCrimeMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      }).setView([52.1326, 5.2913], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add some sample markers for preview
      const sampleLocations = [
        { lat: 52.3676, lng: 4.9041, color: '#dc2626' }, // Amsterdam
        { lat: 51.9225, lng: 4.4792, color: '#f59e0b' }, // Rotterdam
        { lat: 52.0907, lng: 5.1214, color: '#dc2626' }, // Utrecht
        { lat: 51.4416, lng: 5.4697, color: '#84cc16' }, // Eindhoven
        { lat: 53.2194, lng: 6.5665, color: '#f59e0b' }, // Groningen
        { lat: 52.2130, lng: 6.8958, color: '#dc2626' }, // Enschede
      ];

      sampleLocations.forEach(loc => {
        const icon = L.divIcon({
          html: `<div style="background-color: ${loc.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'mini-marker',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        L.marker([loc.lat, loc.lng], { icon }).addTo(map);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
      className="rounded-xl overflow-hidden"
    />
  );
}
