'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export default function WebVitalsReporter() {
  useEffect(() => {
    // Send metrics to analytics endpoint
    const sendToAnalytics = (metric: any) => {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      });

      // Send to your analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        // Use sendBeacon if available, fallback to fetch
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/vitals', body);
        } else {
          fetch('/api/analytics/vitals', {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
          }).catch(console.error);
        }
      } else {
        // Log in development
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          rating: metric.rating,
        });
      }
    };

    // Register all Core Web Vitals
    // Note: FID is deprecated in favor of INP in web-vitals v4+
    onCLS(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics); // Replaces FID
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}
