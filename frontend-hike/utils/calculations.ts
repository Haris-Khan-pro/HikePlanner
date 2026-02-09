// utils/calculations.ts

export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (
  coord1: Coordinate,
  coord2: Coordinate
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Calculate total distance from array of coordinates
 */
export const calculateTotalDistance = (path: Coordinate[]): number => {
  if (path.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < path.length; i++) {
    total += calculateDistance(path[i - 1], path[i]);
  }
  return total;
};

/**
 * Calculate elevation gain from elevation data
 */
export const calculateElevationGain = (elevations: number[]): number => {
  if (elevations.length < 2) return 0;

  let gain = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0) {
      gain += diff;
    }
  }
  return gain;
};

/**
 * Calculate calories burned based on distance, duration, and weight
 * Simple estimation: MET value * weight(kg) * duration(hours)
 */
export const calculateCalories = (
  distanceMeters: number,
  durationMinutes: number,
  weightKg: number = 70 // default average weight
): number => {
  const durationHours = durationMinutes / 60;
  const speedKmh = (distanceMeters / 1000) / durationHours;
  
  // MET values based on hiking speed
  let met = 3.5; // slow walking
  if (speedKmh > 5) met = 6.0; // moderate hiking
  if (speedKmh > 6) met = 7.5; // fast hiking
  
  return met * weightKg * durationHours;
};

/**
 * Calculate average speed in m/s
 */
export const calculateAvgSpeed = (
  distanceMeters: number,
  durationMinutes: number
): number => {
  if (durationMinutes === 0) return 0;
  return distanceMeters / (durationMinutes * 60);
};

/**
 * Calculate average pace in min/km
 */
export const calculatePace = (
  distanceMeters: number,
  durationMinutes: number
): number => {
  if (distanceMeters === 0) return 0;
  return durationMinutes / (distanceMeters / 1000);
};

/**
 * Smooth GPS path to remove noise
 */
export const smoothPath = (
  path: Coordinate[],
  windowSize: number = 5
): Coordinate[] => {
  if (path.length < windowSize) return path;

  const smoothed: Coordinate[] = [];
  
  for (let i = 0; i < path.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(path.length, i + Math.ceil(windowSize / 2));
    const window = path.slice(start, end);
    
    const avgLat = window.reduce((sum, p) => sum + p.latitude, 0) / window.length;
    const avgLng = window.reduce((sum, p) => sum + p.longitude, 0) / window.length;
    
    smoothed.push({ latitude: avgLat, longitude: avgLng });
  }
  
  return smoothed;
};