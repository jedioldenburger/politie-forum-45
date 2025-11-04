// Performance monitoring utilities
// Detecteer en log lange setTimeout callbacks

interface PerformanceIssue {
  type: 'setTimeout' | 'setInterval' | 'requestIdleCallback';
  duration: number;
  timestamp: number;
  stackTrace?: string;
}

const performanceIssues: PerformanceIssue[] = [];
const THRESHOLD_MS = 50; // Warn voor callbacks > 50ms

// Monkey-patch setTimeout om lange callbacks te detecteren
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalSetTimeout = window.setTimeout;

  window.setTimeout = function(callback: (...args: any[]) => void, delay?: number, ...args: any[]) {
    const start = performance.now();

    const wrappedCallback = (...callbackArgs: any[]) => {
      const result = callback(...callbackArgs);
      const duration = performance.now() - start;

      if (duration > THRESHOLD_MS) {
        const issue: PerformanceIssue = {
          type: 'setTimeout',
          duration,
          timestamp: Date.now(),
          stackTrace: new Error().stack,
        };

        performanceIssues.push(issue);

        console.warn(
          `⚠️ Long setTimeout callback detected: ${duration.toFixed(2)}ms\n`,
          'Stack trace:', issue.stackTrace
        );
      }

      return result;
    };

    return originalSetTimeout(wrappedCallback, delay, ...args);
  } as typeof setTimeout;
}

// Monkey-patch setInterval
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalSetInterval = window.setInterval;

  window.setInterval = function(callback: (...args: any[]) => void, delay?: number, ...args: any[]) {
    const wrappedCallback = (...callbackArgs: any[]) => {
      const start = performance.now();
      const result = callback(...callbackArgs);
      const duration = performance.now() - start;

      if (duration > THRESHOLD_MS) {
        console.warn(
          `⚠️ Long setInterval callback detected: ${duration.toFixed(2)}ms`
        );
      }

      return result;
    };

    return originalSetInterval(wrappedCallback, delay, ...args);
  } as typeof setInterval;
}

// Export voor debugging
export function getPerformanceIssues() {
  return performanceIssues;
}

export function clearPerformanceIssues() {
  performanceIssues.length = 0;
}

// Report functie voor productie monitoring
export function reportPerformanceIssues() {
  if (performanceIssues.length === 0) {
    console.log('✅ No performance issues detected');
    return;
  }

  console.group('📊 Performance Issues Report');
  console.table(performanceIssues.map(issue => ({
    Type: issue.type,
    Duration: `${issue.duration.toFixed(2)}ms`,
    Time: new Date(issue.timestamp).toLocaleTimeString(),
  })));
  console.groupEnd();
}

// Auto-report elke 30 seconden in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => {
    if (performanceIssues.length > 0) {
      reportPerformanceIssues();
      clearPerformanceIssues();
    }
  }, 30000);
}
