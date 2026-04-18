import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api';
import type { Review, ReviewCreate, ReviewUpdate } from '@/lib/api';

export type { Review, ReviewCreate, ReviewUpdate };

export const useReviews = (trailId: string) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['reviews', trailId],
    queryFn: async () => {
      const token = await getToken();
      const result = await createApiClient(token).reviews.getByTrail(trailId);
      return result.reviews;
    },
    enabled: !!trailId,
    retry: 1,
  });
};

export const useCreateReview = (trailId: string) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const token = await getToken();
      const payload: ReviewCreate = {
        trail_id: trailId,
        clerk_user_id: user.id,
        rating: data.rating,
        comment: data.comment,
        username: user.username ?? user.firstName ?? 'Hiker',
      };
      return createApiClient(token).reviews.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', trailId] });
    },
  });
};

export const useDeleteReview = (trailId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const token = await getToken();
      return createApiClient(token).reviews.delete(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', trailId] });
    },
  });
};