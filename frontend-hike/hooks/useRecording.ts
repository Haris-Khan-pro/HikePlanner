// hooks/useRecording.ts
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import LocationService from '@/services/locationService';
import { calculateTotalDistance, calculateElevationGain, calculateCalories } from '@/utils/calculations';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  startTime: Date | null;
  duration: number; // in seconds
  distance: number; // in meters
  path: { latitude: number; longitude: number; elevation?: number }[];
  elevationGain: number;
  currentSpeed: number; // in m/s
  avgSpeed: number;
  maxSpeed: number;
  calories: number;
}

export const useRecording = () => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    startTime: null,
    duration: 0,
    distance: 0,
    path: [],
    elevationGain: 0,
    currentSpeed: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    calories: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      LocationService.stopTracking();
    };
  }, []);

  const startRecording = async () => {
    const hasPermission = await LocationService.requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Location permission is required to record activities.');
      return;
    }

    await LocationService.startTracking();
    
    setState(prev => ({
      ...prev,
      isRecording: true,
      isPaused: false,
      startTime: new Date(),
      path: [],
      distance: 0,
      duration: 0,
      elevationGain: 0,
    }));

    // Update duration every second
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (!prev.isPaused && prev.startTime) {
          return {
            ...prev,
            duration: Math.floor((Date.now() - prev.startTime.getTime()) / 1000),
          };
        }
        return prev;
      });
    }, 1000);

    // Listen to location updates
    LocationService.addListener((location) => {
      setState(prev => {
        const newPath = [
          ...prev.path,
          {
            latitude: location.latitude,
            longitude: location.longitude,
            elevation: location.elevation,
          },
        ];

        const distance = calculateTotalDistance(newPath);
        const elevations = newPath.map(p => p.elevation || 0).filter(e => e > 0);
        const elevationGain = calculateElevationGain(elevations);
        const durationMinutes = prev.duration / 60;
        const avgSpeed = durationMinutes > 0 ? distance / (durationMinutes * 60) : 0;
        const currentSpeed = location.speed || 0;
        const maxSpeed = Math.max(prev.maxSpeed, currentSpeed);
        const calories = calculateCalories(distance, durationMinutes);

        return {
          ...prev,
          path: newPath,
          distance,
          elevationGain,
          currentSpeed,
          avgSpeed,
          maxSpeed,
          calories,
        };
      });
    });
  };

  const pauseRecording = () => {
    setState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeRecording = () => {
    setState(prev => ({ ...prev, isPaused: false }));
  };

  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    LocationService.stopTracking();

    const finalState = state;
    
    setState({
      isRecording: false,
      isPaused: false,
      startTime: null,
      duration: 0,
      distance: 0,
      path: [],
      elevationGain: 0,
      currentSpeed: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      calories: 0,
    });

    return finalState;
  };

  return {
    ...state,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  };
};