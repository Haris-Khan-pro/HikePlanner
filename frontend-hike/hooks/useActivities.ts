// hooks/useActivities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Activity {
  id: string;
  trailId?: string;
  trailName?: string;
  startTime: string;
  endTime: string;
  distance: number; // meters
  duration: number; // seconds
  elevationGain: number; // meters
  avgSpeed: number; // m/s
  maxSpeed: number; // m/s
  calories: number;
  path: { latitude: number; longitude: number }[];
}

// Mock data for now
const mockActivities: Activity[] = [
  {
    id: '1',
    trailName: 'Mountain Trail',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 82800000).toISOString(),
    distance: 5200,
    duration: 3600,
    elevationGain: 450,
    avgSpeed: 1.44,
    maxSpeed: 2.1,
    calories: 385,
    path: [],
  },
  {
    id: '2',
    trailName: 'Forest Path',
    startTime: new Date(Date.now() - 172800000).toISOString(),
    endTime: new Date(Date.now() - 169200000).toISOString(),
    distance: 3100,
    duration: 2400,
    elevationGain: 180,
    avgSpeed: 1.29,
    maxSpeed: 1.8,
    calories: 220,
    path: [],
  },
];

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      // TODO: Replace with real API call
      // const { api } = await import('@/lib/api');
      // return api.activities.getAll();
      return mockActivities;
    },
  });
};

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      // TODO: Replace with real API call
      // const { api } = await import('@/lib/api');
      // return api.activities.getById(id);
      return mockActivities.find(a => a.id === id);
    },
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Omit<Activity, 'id'>) => {
      // TODO: Replace with real API call
      // const { api } = await import('@/lib/api');
      // return api.activities.create(activity);
      console.log('Creating activity:', activity);
      return { id: Date.now().toString(), ...activity };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with real API call
      // const { api } = await import('@/lib/api');
      // return api.activities.delete(id);
      console.log('Deleting activity:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};