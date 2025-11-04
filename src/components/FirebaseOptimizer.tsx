"use client";

import { useEffect } from 'react';

/**
 * Firebase Connection Optimizer
 * - Force WebSocket connections (geen long-polling)
 * - Monitor connection status
 * - Auto-reconnect op errors
 */
export function FirebaseOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check of Firebase is geladen
    const checkFirebase = () => {
      // @ts-ignore
      const db = window.firebase?.database?.();
      if (!db) return;

      try {
        // Force WebSocket transport (geen long-polling fallback)
        // @ts-ignore - Firebase internal API
        db.INTERNAL?.forceWebSockets?.();

        // Monitor connection state
        const connectedRef = db.ref('.info/connected');

        connectedRef.on('value', (snapshot: any) => {
          if (snapshot.val() === true) {
            console.log('🔥 Firebase: WebSocket connected');
          } else {
            console.warn('🔥 Firebase: Disconnected, reconnecting...');
          }
        });

        // Cleanup
        return () => {
          connectedRef.off();
        };
      } catch (error) {
        console.error('Firebase optimizer error:', error);
      }
    };

    // Retry check als Firebase nog niet geladen is
    const interval = setInterval(() => {
      const cleanup = checkFirebase();
      if (cleanup) {
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup na 10 seconden
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return null; // Geen UI
}
