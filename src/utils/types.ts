export interface Crime {
  id: string;
  lat: number;
  lng: number;
  category: string;
  region: string;
  timestamp: string;  // ISO
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CrimeFilterParams {
  category?: string;
  region?: string;
  period?: string;  // e.g. "7d", "30d", "all"
}

export interface CrimeStats {
  total: number;
  byCategory: Record<string, number>;
  byRegion: Record<string, number>;
}
