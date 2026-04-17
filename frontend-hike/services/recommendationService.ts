// frontend-hike/services/recommendationService.ts
// Handles all API calls related to personalized recommendations

import { createApiClient } from "@/lib/api";

export interface RecommendedTrail {
  id: string;
  name: string;
  location: string;
  distance: number;
  duration: number;
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert";
  elevation: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isFeatured: boolean;
  isPopular: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
  recommendation_score: number;
  recommendation_normalized: number;
  recommendation_label: string;
  recommendation_stars: number;
}

export interface TrendingLocation {
  location: string;
  avg_rating: number;
  post_count: number;
  label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
}

export interface RecommendationResponse {
  user_id: string;
  total: number;
  recommendations: RecommendedTrail[];
}

/**
 * Fetches personalized trail recommendations for the current user.
 * @param clerkUserId - The Clerk user ID from useUser()
 * @param token - The Clerk JWT token from getToken()
 * @param topN - Number of recommendations (default 5)
 */
export async function fetchRecommendations(
  clerkUserId: string,
  token: string | null,
  topN: number = 5
): Promise<RecommendationResponse> {
  const api = createApiClient(token);
  const response = await fetch(
    `${(api as any).baseUrl}/api/recommendations/${clerkUserId}?top_n=${topN}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch recommendations: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches trending hiking locations based on social media sentiment.
 */
export async function fetchTrendingLocations(
  token: string | null
): Promise<TrendingLocation[]> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.106:8000"}/api/recommendations/trending/locations`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch trending locations: ${response.status}`);
  }

  const data = await response.json();
  return data.trending || [];
}