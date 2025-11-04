'use client';

import * as d3 from 'd3';
import { getApps, initializeApp } from 'firebase/app';
import { collection, limit as fbLimit, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

// Firebase config (client-side)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase (client-side)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firestore = getFirestore(app);

interface SentimentData {
  location: string;
  avgSentimentScore: number; // 0-100
  articleCount: number;
  dominantTone: string; // e.g., "concerned", "hopeful"
  topEmotions: string[]; // e.g., ["outrage", "solidarity"]
  coordinates?: { lat: number; lng: number };
}

/**
 * 🗺️ SENTIMENT DASHBOARD - EMOTIONAL MAP OF NETHERLANDS
 *
 * Visualizes AI-detected sentiment data aggregated by location:
 * - Color-coded by average sentiment score (red = negative, green = positive)
 * - Size-coded by number of articles
 * - Interactive tooltips showing dominant tone + emotions
 * - Filterable by date range and emotion type
 *
 * Uses D3.js for SVG rendering and data visualization.
 */
export default function SentimentDashboard() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch and aggregate sentiment data
  useEffect(() => {
    async function fetchSentimentData() {
      try {
        const aiNewsRef = collection(firestore, 'ai_news');
        const q = query(
          aiNewsRef,
          orderBy('publishedAt', 'desc'),
          fbLimit(100) // Analyze recent 100 articles
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setLoading(false);
          return;
        }

        // Aggregate by location
        const locationMap = new Map<string, {
          scores: number[];
          tones: string[];
          emotions: string[];
          count: number;
        }>();

        snapshot.docs.forEach((doc: any) => {
          const data = doc.data();          // Skip if no AI sentiment or entities
          if (!data.aiSentiment || !data.aiEntities?.locations) return;

          data.aiEntities.locations.forEach((location: string) => {
            if (!locationMap.has(location)) {
              locationMap.set(location, {
                scores: [],
                tones: [],
                emotions: [],
                count: 0
              });
            }

            const loc = locationMap.get(location)!;
            loc.scores.push(data.aiSentiment.score);
            loc.tones.push(data.aiSentiment.tone);
            if (data.aiSentiment.emotions) {
              loc.emotions.push(...data.aiSentiment.emotions);
            }
            loc.count++;
          });
        });

        // Calculate averages and dominant values
        const aggregated: SentimentData[] = Array.from(locationMap.entries()).map(
          ([location, data]) => {
            const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;

            // Find most frequent tone
            const toneCounts = data.tones.reduce((acc, tone) => {
              acc[tone] = (acc[tone] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            const dominantTone = Object.entries(toneCounts)
              .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

            // Find top 3 emotions
            const emotionCounts = data.emotions.reduce((acc, emotion) => {
              acc[emotion] = (acc[emotion] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            const topEmotions = Object.entries(emotionCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([emotion]) => emotion);

            return {
              location,
              avgSentimentScore: Math.round(avgScore),
              articleCount: data.count,
              dominantTone,
              topEmotions,
              coordinates: getLocationCoordinates(location)
            };
          }
        );

        setSentimentData(aggregated.sort((a, b) => b.articleCount - a.articleCount));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sentiment data:', error);
        setLoading(false);
      }
    }

    fetchSentimentData();
  }, []);

  // Render D3 visualization
  useEffect(() => {
    if (!svgRef.current || sentimentData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };

    // Color scale: red (0) → yellow (50) → green (100)
    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([0, 100]);

    // Size scale based on article count
    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(sentimentData, d => d.articleCount) || 10])
      .range([5, 30]);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    // Render circles
    svg.selectAll('circle')
      .data(sentimentData)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => margin.left + (i % 10) * 70)
      .attr('cy', (d, i) => margin.top + Math.floor(i / 10) * 70)
      .attr('r', d => sizeScale(d.articleCount))
      .attr('fill', d => colorScale(d.avgSentimentScore))
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke-width', 3);
        tooltip
          .html(`
            <strong>${d.location}</strong><br/>
            Sentiment: ${d.avgSentimentScore}/100<br/>
            Tone: ${d.dominantTone}<br/>
            Articles: ${d.articleCount}<br/>
            Emotions: ${d.topEmotions.join(', ')}
          `)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 15) + 'px')
          .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8).attr('stroke-width', 2);
        tooltip.style('opacity', 0);
      });

    // Add location labels
    svg.selectAll('text')
      .data(sentimentData)
      .enter()
      .append('text')
      .attr('x', (d, i) => margin.left + (i % 10) * 70)
      .attr('y', (d, i) => margin.top + Math.floor(i / 10) * 70 + sizeScale(d.articleCount) + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#333')
      .text(d => d.location.substring(0, 10));

  }, [sentimentData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading sentiment data...</div>
      </div>
    );
  }

  if (sentimentData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          ⚠️ Geen AI-sentiment data beschikbaar. Voer eerst artikelen door de MCP pipeline (Menu Option 26).
        </p>
      </div>
    );
  }

  return (
    <div className="sentiment-dashboard bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🗺️ Emotionele Kaart van Nederland
      </h2>

      <p className="text-gray-600 mb-6">
        Sentiment-analyse van {sentimentData.reduce((acc, d) => acc + d.articleCount, 0)} artikelen,
        geaggregeerd per locatie. Cirkelgrootte = aantal artikelen, kleur = gemiddelde sentiment
        (rood = negatief, groen = positief).
      </p>

      {/* D3 Visualization */}
      <div className="mb-6 overflow-x-auto">
        <svg
          ref={svgRef}
          width="800"
          height="600"
          className="border border-gray-200 rounded"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500"/>
          <span className="text-sm">Negatief (0-40)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-500"/>
          <span className="text-sm">Neutraal (40-60)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500"/>
          <span className="text-sm">Positief (60-100)</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locatie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artikelen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dominante Toon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Emoties</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sentimentData.slice(0, 20).map((data) => (
              <tr key={data.location} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {data.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 100])(data.avgSentimentScore) }}
                  >
                    {data.avgSentimentScore}/100
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {data.articleCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {data.dominantTone}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {data.topEmotions.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Inzichten</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Meest negatieve locatie: {sentimentData.sort((a, b) => a.avgSentimentScore - b.avgSentimentScore)[0]?.location} ({sentimentData[0]?.avgSentimentScore}/100)</li>
          <li>• Meest positieve locatie: {sentimentData.sort((a, b) => b.avgSentimentScore - a.avgSentimentScore)[0]?.location} ({sentimentData[0]?.avgSentimentScore}/100)</li>
          <li>• Meest besproken locatie: {sentimentData.sort((a, b) => b.articleCount - a.articleCount)[0]?.location} ({sentimentData[0]?.articleCount} artikelen)</li>
        </ul>
      </div>
    </div>
  );
}

// Helper: Get coordinates for Dutch cities (simplified - expand with real geocoding API)
function getLocationCoordinates(location: string): { lat: number; lng: number } | undefined {
  const coords: Record<string, { lat: number; lng: number }> = {
    'Amsterdam': { lat: 52.3676, lng: 4.9041 },
    'Rotterdam': { lat: 51.9225, lng: 4.47917 },
    'Den Haag': { lat: 52.0705, lng: 4.3007 },
    'Utrecht': { lat: 52.0907, lng: 5.1214 },
    'Eindhoven': { lat: 51.4416, lng: 5.4697 },
    // Add more cities as needed
  };
  return coords[location];
}
