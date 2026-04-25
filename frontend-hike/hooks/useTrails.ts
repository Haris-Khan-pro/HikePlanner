import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient, Trail as ApiTrail } from "@/lib/api";
import { Trail } from "@/types";

// Map backend Trail shape → local Trail shape
// lib/api.ts uses `review_count`; types/index.ts (and all components) use `reviews`
function mapApiTrail(t: ApiTrail): Trail {
  return {
    id: t.id,
    name: t.name,
    location: t.location,
    description: t.description,
    distance: t.distance,
    duration: t.duration,
    difficulty: t.difficulty,
    elevation: t.elevation,
    rating: t.rating,
    reviews: t.review_count,
    image: t.image ?? "",
    isFeatured: t.isFeatured,
    isPopular: t.isPopular,
    isSaved: t.isSaved ?? false,
    latitude: t.latitude,
    longitude: t.longitude,
    tags: t.tags,
  };
}

export const useTrails = (filters?: {
  difficulty?: string;
  search?: string;
  category?: string;
  featured?: boolean;
  popular?: boolean;
}) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["trails", filters],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token);

      const apiParams: {
        difficulty?: string;
        search?: string;
        featured?: boolean;
        popular?: boolean;
      } = {};
      if (filters?.difficulty) apiParams.difficulty = filters.difficulty;
      if (filters?.search) apiParams.search = filters.search;
      if (filters?.category === "2" || filters?.featured) apiParams.featured = true;
      if (filters?.category === "3" || filters?.popular) apiParams.popular = true;

      const raw = await api.trails.getAll(apiParams);
      return raw.map(mapApiTrail);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrail = (id: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["trail", id],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token);
      const raw = await api.trails.getById(id);
      return mapApiTrail(raw);
    },
    enabled: !!id,
  });
};

// Fixed: api.users.saveTrail requires (clerkUserId, trailId) — two args
export const useSaveTrail = () => {
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trailId: string) => {
      if (!userId) throw new Error("Not authenticated");
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.saveTrail(userId, trailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trails"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

export const useUnsaveTrail = () => {
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trailId: string) => {
      if (!userId) throw new Error("Not authenticated");
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.unsaveTrail(userId, trailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trails"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};