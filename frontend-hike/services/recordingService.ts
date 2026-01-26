import { HikePoint, HikeRecording, HikeStats } from '@/types/recording';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from './locationService';

const STORAGE_KEY = '@hike_recordings';

export class RecordingService {
  private static instance: RecordingService;
  private currentRecording: HikeRecording | null = null;

  private constructor() {}

  static getInstance(): RecordingService {
    if (!RecordingService.instance) {
      RecordingService.instance = new RecordingService();
    }
    return RecordingService.instance;
  }

  async startRecording(name?: string): Promise<HikeRecording> {
    const startLocation = await LocationService.getCurrentLocation();
    
    if (!startLocation) {
      throw new Error('Unable to get current location');
    }

    this.currentRecording = {
      id: Date.now().toString(),
      name: name || `Hike ${new Date().toLocaleDateString()}`,
      startTime: new Date(),
      isRecording: true,
      isPaused: false,
      points: [startLocation],
      photos: [],
      waypoints: [],
      stats: this.initializeStats(),
    };

    // Start location tracking
    await LocationService.startTracking();
    LocationService.addListener(this.handleLocationUpdate);

    return this.currentRecording;
  }

  pauseRecording(): void {
    if (this.currentRecording) {
      this.currentRecording.isPaused = true;
      LocationService.stopTracking();
    }
  }

  resumeRecording(): void {
    if (this.currentRecording) {
      this.currentRecording.isPaused = false;
      LocationService.startTracking();
    }
  }

  async stopRecording(): Promise<HikeRecording | null> {
    if (!this.currentRecording) return null;

    this.currentRecording.endTime = new Date();
    this.currentRecording.isRecording = false;
    
    LocationService.stopTracking();
    LocationService.removeListener(this.handleLocationUpdate);

    // Calculate final stats
    this.currentRecording.stats = this.calculateStats(this.currentRecording.points);

    // Save to storage
    await this.saveRecording(this.currentRecording);

    const completed = this.currentRecording;
    this.currentRecording = null;
    
    return completed;
  }

  getCurrentRecording(): HikeRecording | null {
    return this.currentRecording;
  }

  private handleLocationUpdate = (location: HikePoint): void => {
    if (this.currentRecording && !this.currentRecording.isPaused) {
      this.currentRecording.points.push(location);
      this.currentRecording.stats = this.calculateStats(this.currentRecording.points);
    }
  };

  private calculateStats(points: HikePoint[]): HikeStats {
    if (points.length === 0) {
      return this.initializeStats();
    }

    let totalDistance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;
    let maxElevation = points[0].elevation || 0;
    let minElevation = points[0].elevation || 0;
    let maxSpeed = 0;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      totalDistance += LocationService.calculateDistance(prev, curr);

      if (prev.elevation && curr.elevation) {
        const elevDiff = curr.elevation - prev.elevation;
        if (elevDiff > 0) {
          elevationGain += elevDiff;
        } else {
          elevationLoss += Math.abs(elevDiff);
        }
        
        maxElevation = Math.max(maxElevation, curr.elevation);
        minElevation = Math.min(minElevation, curr.elevation);
      }

      if (curr.speed) {
        maxSpeed = Math.max(maxSpeed, curr.speed * 3.6); 
      }
    }

    const duration = this.calculateDuration(points);
    const avgSpeed = duration > 0 ? (totalDistance / duration) * 3600 : 0; 
    const avgPace = avgSpeed > 0 ? 60 / avgSpeed : 0;

    return {
      distance: totalDistance,
      duration,
      elevationGain,
      elevationLoss,
      maxElevation,
      minElevation,
      avgSpeed,
      maxSpeed,
      avgPace,
    };
  }

  private calculateDuration(points: HikePoint[]): number {
    if (points.length < 2) return 0;
    const start = points[0].timestamp.getTime();
    const end = points[points.length - 1].timestamp.getTime();
    return (end - start) / 1000; 
  }

  private initializeStats(): HikeStats {
    return {
      distance: 0,
      duration: 0,
      elevationGain: 0,
      elevationLoss: 0,
      maxElevation: 0,
      minElevation: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      avgPace: 0,
    };
  }

  async saveRecording(recording: HikeRecording): Promise<void> {
    try {
      const existing = await this.getAllRecordings();
      existing.push(recording);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving recording:', error);
    }
  }

  async getAllRecordings(): Promise<HikeRecording[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading recordings:', error);
      return [];
    }
  }

  async deleteRecording(id: string): Promise<void> {
    try {
      const recordings = await this.getAllRecordings();
      const filtered = recordings.filter(r => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  }
}

export default RecordingService.getInstance();