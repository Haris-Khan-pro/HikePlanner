import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "@/lib/api";

export const useTrails = (filters?: {
  difficulty?: string;
  search?: string;
  category?: string;
}) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["trails", filters],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token);

      // Map category ID to API params
      const apiParams: {
        difficulty?: string;
        search?: string;
        featured?: boolean;
        popular?: boolean;
      } = {};
      if (filters?.difficulty) apiParams.difficulty = filters.difficulty;
      if (filters?.search) apiParams.search = filters.search;
      if (filters?.category === "2") apiParams.featured = true;
      if (filters?.category === "3") apiParams.popular = true;

      return api.trails.getAll(apiParams);
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useTrail = (id: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["trail", id],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token);
      return api.trails.getById(id);
    },
    enabled: !!id,
  });
};

// NOTE: saveTrail and unsaveTrail endpoints don't exist in the backend yet.
// These methods are commented out until backend implementation is complete.
// When implementing, create:
//   POST /api/users/{user_id}/saved-trails/{trail_id}
//   DELETE /api/users/{user_id}/saved-trails/{trail_id}
// And update the hooks below to use api.users.saveTrail() and api.users.unsaveTrail()

/*
export const useSaveTrail = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trailId: string) => {
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.saveTrail(trailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trails'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useUnsaveTrail = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trailId: string) => {
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.unsaveTrail(trailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trails'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};
*/
