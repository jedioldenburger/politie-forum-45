'use client';

import { Crime } from '@/utils/types';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

interface NewsLocation {
  id: string;
  title: string;
  slug: string;
  url: string;
  timestamp: number;
  location: {
    city: string;
    region: string;
    lat: number;
    lng: number;
  };
  category: string;
  summary: string;
}

interface CrimeMapProps {
  crimes?: Crime[];
  newsLocations?: NewsLocation[];
}

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const categoryIcons: Record<string, string> = {
  'Inbraak': '🏠',
  'Diefstal': '💼',
  'Geweld': '⚠️',
  'Vandalisme': '🔨',
  'Vermissing': '🔍',
};

const severityColors: Record<string, string> = {
  'low': '#84cc16',
  'medium': '#f59e0b',
  'high': '#ea580c',
  'critical': '#dc2626',
};

const newsColor = '#2563eb'; // Blue color for news articles

export default function CrimeMap({ crimes = [], newsLocations = [] }: CrimeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([52.1326, 5.2913], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      // Initialize marker cluster group
      markersLayerRef.current = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });
      map.addLayer(markersLayerRef.current);
    }

    return () => {
      // Cleanup only when component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!markersLayerRef.current || !crimes) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add crime markers
    crimes.forEach(crime => {
      const icon = L.divIcon({
        html: `<div style="background-color: ${severityColors[crime.severity || 'medium']}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          ${categoryIcons[crime.category] || '📍'}
        </div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([crime.lat, crime.lng], { icon });

      const popupContent = `
        <div style="min-width: 200px;">
          <div style="background: ${severityColors[crime.severity || 'medium']}; color: white; padding: 8px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
            <strong style="font-size: 16px;">${categoryIcons[crime.category] || '📍'} ${crime.category}</strong>
          </div>
          <div style="padding: 4px 0;">
            ${(crime as any).articleTitle ? `
              <div style="margin-bottom: 8px;">
                <strong style="font-size: 15px; color: #1e40af;">${(crime as any).articleTitle}</strong>
              </div>
            ` : ''}
            <div style="margin-bottom: 8px;">
              <strong>📍 Locatie:</strong> ${crime.region}
            </div>
            <div style="margin-bottom: 8px;">
              <strong>📅 Datum:</strong> ${new Date(crime.timestamp).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            ${crime.description ? `
              <div style="margin-bottom: 12px; color: #374151; line-height: 1.4;">
                ${crime.description.substring(0, 150)}${crime.description.length > 150 ? '...' : ''}
              </div>
            ` : ''}
            ${(crime as any).articleSlug ? `
              <a href="/nieuws/${(crime as any).articleSlug}" target="_blank" style="display: inline-block; background: ${severityColors[crime.severity || 'medium']}; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 500;">
                Lees artikel →
              </a>
            ` : `
              <div style="font-size: 11px; color: #666; border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px;">
                ID: ${crime.id}
              </div>
            `}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersLayerRef.current!.addLayer(marker);
    });

    // Add news article markers
    newsLocations.forEach(news => {
      const icon = L.divIcon({
        html: `<div style="background-color: ${newsColor}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          📰
        </div>`,
        className: 'custom-marker news-marker',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([news.location.lat, news.location.lng], { icon });

      const popupContent = `
        <div style="min-width: 250px;">
          <div style="background: ${newsColor}; color: white; padding: 8px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
            <strong style="font-size: 16px;">📰 Nieuwsartikel</strong>
          </div>
          <div style="padding: 4px 0;">
            <div style="margin-bottom: 8px;">
              <strong style="font-size: 15px; color: #1e40af;">${news.title}</strong>
            </div>
            <div style="margin-bottom: 8px;">
              <strong>📍 Locatie:</strong> ${news.location.city}, ${news.location.region}
            </div>
            <div style="margin-bottom: 8px;">
              <strong>📅 Gepubliceerd:</strong> ${new Date(news.timestamp).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            ${news.summary ? `
              <div style="margin-bottom: 12px; color: #374151; line-height: 1.4;">
                ${news.summary.substring(0, 150)}${news.summary.length > 150 ? '...' : ''}
              </div>
            ` : ''}
            <a href="${news.url}" target="_blank" style="display: inline-block; background: ${newsColor}; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 500;">
              Lees artikel →
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersLayerRef.current!.addLayer(marker);
    });

    // Fit bounds if there are markers
    const allPoints = [
      ...crimes.map(c => [c.lat, c.lng] as [number, number]),
      ...newsLocations.map(n => [n.location.lat, n.location.lng] as [number, number])
    ];
    if (allPoints.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(allPoints);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [crimes, newsLocations]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700">
        <h2 className="text-xl font-bold text-white">Interactieve Kaart</h2>
        <p className="text-primary-100 text-sm mt-1">Klik op een marker voor meer details • Markers clusteren automatisch</p>
      </div>
      <div className="p-4 relative">
        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Legenda:</span>
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <span key={category} className="flex items-center">
              <span className="text-lg mr-1">{icon}</span>
              <span className="text-gray-600">{category}</span>
            </span>
          ))}
          <span className="flex items-center border-l border-gray-300 pl-4">
            <span className="text-lg mr-1">📰</span>
            <span className="text-gray-600">Nieuwsartikelen</span>
          </span>
        </div>
        <div ref={mapContainerRef} style={{ height: '600px', width: '100%', borderRadius: '8px' }} />
        {crimes && crimes.length === 0 && newsLocations && newsLocations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg pointer-events-none" style={{ top: '80px' }}>
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 font-medium">Geen meldingen of nieuwsartikelen gevonden met deze filters</p>
              <p className="text-gray-400 text-sm mt-2">Probeer andere filtercriteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
