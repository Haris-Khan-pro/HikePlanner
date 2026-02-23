import { useAuth } from "@clerk/clerk-expo";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient, UserUpdateRequest } from "@/lib/api";

export const useUserProfile = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.getMe(user.id);
    },
    enabled: !!isSignedIn && !!user?.id,
    // If backend fails, the component can fall back to clerkUser data
    retry: 2,
  });
};

export const useUpdateUserProfile = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserUpdateRequest) => {
      if (!user?.id) throw new Error("User not authenticated");
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.updateMe(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
