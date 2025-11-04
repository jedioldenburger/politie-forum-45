/**
 * Analytics bootstrap (no Firebase Analytics). We rely on GA4 (gtag.js).
 * Exposes a no-op initializer to keep call sites stable.
 */

export const initAnalytics = async () => {
  // Intentionally no-op: GA4 is loaded via next/script in layout.
  return null;
};

export const getAnalyticsInstance = () => null;
