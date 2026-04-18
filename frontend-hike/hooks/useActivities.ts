import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApiClient } from "@/lib/api";
import type { Activity, ActivityCreate } from "@/lib/api";

export type { Activity, ActivityCreate };

// Storage key for offline activities
const ACTIVITIES_STORAGE_KEY = "hiking_activities";

export const useActivities = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [localActivities, setLocalActivities] = useState<Activity[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Load local activities first (instant)
  useEffect(() => {
    const loadLocal = async () => {
      try {
        const stored = await AsyncStorage.getItem(ACTIVITIES_STORAGE_KEY);
        if (stored) {
          setLocalActivities(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load local activities:", error);
      } finally {
        setIsLoadingLocal(false);
      }
    };
    loadLocal();
  }, []);

  // Try to sync with API in background (doesn't block UI)
  const { data: apiActivities } = useQuery({
    queryKey: ["activities-api", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const token = await getToken();
        const activities = await createApiClient(token).activities.getAll(
          user.id,
        );
        // Save to local storage
        await AsyncStorage.setItem(
          ACTIVITIES_STORAGE_KEY,
          JSON.stringify(activities),
        );
        return activities;
      } catch {
        console.log("API sync failed, using local activities");
        return localActivities; // Fallback to local
      }
    },
    retry: 1,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: apiActivities || localActivities,
    isLoading: isLoadingLocal,
  };
};

export const useActivity = (id: string) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["activity", id],
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
      // Save to local storage immediately (offline first)
      const stored = await AsyncStorage.getItem(ACTIVITIES_STORAGE_KEY);
      const existingActivities = stored ? JSON.parse(stored) : [];

      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString(), // Temporary ID
        created_at: new Date().toISOString(),
      };

      const updatedActivities = [newActivity, ...existingActivities];
      await AsyncStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify(updatedActivities),
      );

      // Try to sync with API in background (doesn't block)
      try {
        const token = await getToken();
        await createApiClient(token).activities.create(activity);
        // Sync successful
        return newActivity;
      } catch {
        console.log(
          "API sync failed, activity saved locally. Will retry later.",
        );
        // Activity is already saved locally, don't throw
        return newActivity;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities-api"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      console.error("Save error:", error);
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
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};
