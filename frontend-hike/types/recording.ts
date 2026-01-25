// types/recording.ts

export interface HikePoint {
  latitude: number;
  longitude: number;
  elevation?: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
}

export interface HikePhoto {
  id: string;
  uri: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  note?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  timestamp: Date;
}

export interface HikeStats {
  distance: number; // in kilometers
  duration: number; // in seconds
  elevationGain: number; // in meters
  elevationLoss: number; // in meters
  maxElevation: number;
  minElevation: number;
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
  avgPace: number; // min/km
}

export interface HikeRecording {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  isRecording: boolean;
  isPaused: boolean;
  points: HikePoint[];
  photos: HikePhoto[];
  waypoints: string[]; // waypoint IDs
  weather?: WeatherData;
  stats: HikeStats;
  notes?: string;
}

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';