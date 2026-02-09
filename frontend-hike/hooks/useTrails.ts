// hooks/useTrails.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockTrails } from '@/types';

export const useTrails = (filters?: { difficulty?: string; category?: string }) => {
  return useQuery({
    queryKey: ['trails', filters],
    queryFn: async () => {
      // TODO: Replace with real API call when backend is ready
      // const { api } = await import('@/lib/api');
      // return api.trails.getAll(filters);
      
      // For now, use mock data
      let trails = mockTrails;
      
      if (filters?.difficulty && filters.difficulty !== 'All') {
        trails = trails.filter(t => t.difficulty === filters.difficulty);
      }
      
      if (filters?.category) {
        if (filters.category === '2') trails = trails.filter(t => t.isFeatured);
        if (filters.category === '3') trails = trails.filter(t => t.isPopular);
        if (filters.category === '5') trails = trails.filter(t => t.isSaved);
      }
      
      return trails;
    },
  });
};

export const useTrail = (id: string) => {
  return useQuery({
    queryKey: ['trail', id],
    queryFn: async () => {
      // TODO: Replace with real API call
      // const { api } = await import('@/lib/api');
      // return api.trails.getById(id);
      return mockTrails.find(t => t.id === id);
    },
  });
};

export const useSaveTrail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (trailId: string) => {
      // TODO: Replace with real API call
      // const { api } = await import('@/lib/api');
      // return api.trails.save(trailId);
      console.log('Saving trail:', trailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trails'] });
    },
  });
};

export const useUnsaveTrail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (trailId: string) => {
      // TODO: Replace with real API call
      // const { api } = await import('@/lib/api');
      // return api.trails.unsave(trailId);
      console.log('Unsaving trail:', trailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trails'] });
    },
  });
};