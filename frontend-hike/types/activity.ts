// types/activity.ts

export interface Activity {
  id: string;
  trailId?: string;
  trailName?: string;
  userId?: string;
  startTime: string;
  endTime: string;
  distance: number; // in meters
  duration: number; // in seconds
  elevationGain: number; // in meters
  elevationLoss?: number; // in meters
  avgSpeed: number; // in m/s
  maxSpeed: number; // in m/s
  calories: number;
  path: ActivityPoint[];
  gpxData?: string;
  photos?: ActivityPhoto[];
  notes?: string;
}

export interface ActivityPoint {
  latitude: number;
  longitude: number;
  elevation?: number;
  timestamp?: string;
  speed?: number;
}

export interface ActivityPhoto {
  id: string;
  uri: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  caption?: string;
}

export interface ActivityCreate {
  trailId?: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
  elevationGain: number;
  elevationLoss?: number;
  avgSpeed: number;
  maxSpeed: number;
  calories: number;
  path: ActivityPoint[];
  gpxData?: string;
  notes?: string;
}

export interface ActivityStats {
  totalActivities: number;
  totalDistance: number; // meters
  totalDuration: number; // seconds
  totalElevationGain: number; // meters
  totalCalories: number;
  longestHike: number; // meters
  longestDuration: number; // seconds
}