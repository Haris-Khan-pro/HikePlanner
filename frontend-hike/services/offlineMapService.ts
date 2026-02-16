// services/offlineMapService.ts
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MapRegion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  zoomLevels: number[];
  downloadedAt: string;
  size: number; // in bytes
}

const STORAGE_KEY = '@offline_maps';

export class OfflineMapService {
  /**
   * Download map tiles for offline use
   * Note: This is a placeholder. Real implementation requires tile server integration
   */
  static async downloadMapRegion(region: Omit<MapRegion, 'id' | 'downloadedAt' | 'size'>): Promise<MapRegion> {
    try {
      // TODO: Implement actual tile downloading
      // This would involve:
      // 1. Calculate which tiles are needed for the region
      // 2. Download tiles from map provider (Google Maps, Mapbox, etc.)
      // 3. Store tiles in FileSystem
      // 4. Save metadata in AsyncStorage

      const mapRegion: MapRegion = {
        id: Date.now().toString(),
        ...region,
        downloadedAt: new Date().toISOString(),
        size: 0, // Would be calculated based on downloaded tiles
      };

      // Save region metadata
      const regions = await this.getDownloadedRegions();
      regions.push(mapRegion);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(regions));

      console.log('Map region download placeholder - implement with tile server');
      return mapRegion;
    } catch (error) {
      console.error('Error downloading map region:', error);
      throw error;
    }
  }

  /**
   * Get all downloaded map regions
   */
  static async getDownloadedRegions(): Promise<MapRegion[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading map regions:', error);
      return [];
    }
  }

  /**
   * Delete downloaded map region
   */
  static async deleteMapRegion(regionId: string): Promise<void> {
    try {
      const regions = await this.getDownloadedRegions();
      const filtered = regions.filter(r => r.id !== regionId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      // TODO: Delete actual tile files from FileSystem
      console.log('Map region deletion placeholder');
    } catch (error) {
      console.error('Error deleting map region:', error);
      throw error;
    }
  }

  /**
   * Check if a location is covered by downloaded maps
   */
  static async isLocationCovered(latitude: number, longitude: number): Promise<boolean> {
    try {
      const regions = await this.getDownloadedRegions();
      
      return regions.some(region => {
        const latInRange = Math.abs(latitude - region.latitude) <= region.latitudeDelta / 2;
        const lonInRange = Math.abs(longitude - region.longitude) <= region.longitudeDelta / 2;
        return latInRange && lonInRange;
      });
    } catch (error) {
      console.error('Error checking location coverage:', error);
      return false;
    }
  }

  /**
   * Calculate storage used by offline maps
   */
  static async getStorageUsed(): Promise<number> {
    try {
      const regions = await this.getDownloadedRegions();
      return regions.reduce((total, region) => total + region.size, 0);
    } catch (error) {
      console.error('Error calculating storage:', error);
      return 0;
    }
  }
}

export default OfflineMapService;