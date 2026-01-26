import { HikePoint } from '@/types/recording';
import * as Location from 'expo-location';

export class LocationService {
  private static instance: LocationService;
  private locationSubscription: Location.LocationSubscription | null = null;
  private listeners: ((location: HikePoint) => void)[] = [];

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    return backgroundStatus === 'granted';
  }

  async getCurrentLocation(): Promise<HikePoint | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        elevation: location.coords.altitude || undefined,
        timestamp: new Date(location.timestamp),
        accuracy: location.coords.accuracy || undefined,
        speed: location.coords.speed || undefined,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  async startTracking(): Promise<void> {
    if (this.locationSubscription) {
      return; 
    }

    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000, 
        distanceInterval: 5, 
      },
      (location) => {
        const hikePoint: HikePoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          elevation: location.coords.altitude || undefined,
          timestamp: new Date(location.timestamp),
          accuracy: location.coords.accuracy || undefined,
          speed: location.coords.speed || undefined,
        };

        this.notifyListeners(hikePoint);
      }
    );
  }

  stopTracking(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  addListener(callback: (location: HikePoint) => void): void {
    this.listeners.push(callback);
  }

  removeListener(callback: (location: HikePoint) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(location: HikePoint): void {
    this.listeners.forEach(listener => listener(location));
  }

  calculateDistance(point1: HikePoint, point2: HikePoint): number {
    const R = 6371;
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.latitude)) * 
      Math.cos(this.toRad(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default LocationService.getInstance();