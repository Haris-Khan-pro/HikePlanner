export type MapLayerType = 'standard' | 'satellite' | 'terrain' | 'hybrid';

export interface Waypoint {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description?: string;
  photos?: string[];
  timestamp: Date;
  elevation?: number;
}

export interface TrailOverlay {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
  color: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  distance: number;
  elevation: number;
}

export interface OfflineRegion {
  id: string;
  name: string;
  bounds: {
    northeast: { latitude: number; longitude: number };
    southwest: { latitude: number; longitude: number };
  };
  minZoom: number;
  maxZoom: number;
  size: number; // in MB
  downloadedAt: Date;
  isDownloaded: boolean;
}

export interface MapState {
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
  heading: number;
  pitch: number;
}

export interface GPXTrack {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
    elevation?: number;
    timestamp?: Date;
  }[];
  metadata?: {
    author?: string;
    description?: string;
    time?: Date;
  };
}