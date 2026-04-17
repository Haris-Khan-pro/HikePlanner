import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api';
import type { Activity, ActivityCreate } from '@/lib/api';

export type { Activity, ActivityCreate };

export const useActivities = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const token = await getToken();
      return createApiClient(token).activities.getAll();
    },
    retry: 1,
  });
};

export const useActivity = (id: string) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      const token = await getToken();
      return createApiClient(token).activities.getById(id);
    },
    enabled: !!id,
  });
};

export const useCreateActivity = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activity: ActivityCreate) => {
      const token = await getToken();
      return createApiClient(token).activities.create(activity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useDeleteActivity = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return createApiClient(token).activities.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};