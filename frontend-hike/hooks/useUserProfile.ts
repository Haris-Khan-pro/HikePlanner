
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient, UserUpdateRequest } from "@/lib/api";

export const useUserProfile = () => {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.getMe();
    },
    enabled: !!isSignedIn,
    // If backend fails, the component can fall back to clerkUser data
    retry: 2,
  });
};

export const useUpdateUserProfile = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserUpdateRequest) => {
      const token = await getToken();
      const api = createApiClient(token);
      return api.users.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
