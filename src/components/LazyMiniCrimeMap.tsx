'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// Dynamically import MiniCrimeMap with no SSR
const MiniCrimeMap = dynamic(() => import('./MiniCrimeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
      <div className="text-slate-500 dark:text-slate-400 text-sm">Kaart laden...</div>
    </div>
  ),
});

export default function LazyMiniCrimeMap() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use Intersection Observer to only load map when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' } // Load 50px before it comes into view
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {isVisible ? (
        <MiniCrimeMap />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
          <div className="text-slate-500 dark:text-slate-400 text-sm">Kaart laden...</div>
        </div>
      )}
    </div>
  );
}
