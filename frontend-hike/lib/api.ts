const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (typeof __DEV__ !== "undefined" && __DEV__
    ? "http://10.0.2.2:8000"      // Android emulator fallback
    : "https://your-production-url.com");

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Trail {
  id: string;
  name: string;
  location: string;
  description: string;
  distance: number;
  duration: number;
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert";
  elevation: number;
  rating: number;
  review_count: number;
  image?: string;
  isFeatured: boolean;
  isPopular: boolean;
  isSaved?: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
  created_at: string;
}

export interface User {
  id: string;
  clerk_user_id?: string;
  email: string;
  name?: string;
  username?: string;
  custom_username?: string;
  profile_image?: string;
  about?: string;
  website?: string;
  auth_provider: string;
  saved_trails: string[];
  completed_activities: number;
  total_distance_km: number;
  created_at: string;
  last_login?: string;
}

export interface GpsPoint {
  latitude: number;
  longitude: number;
}

export interface ActivityCreate {
  clerk_user_id: string;
  trail_id?: string;
  trail_name?: string;
  start_time: string;
  end_time: string;
  distance: number;
  duration: number;
  elevation_gain: number;
  avg_speed: number;
  max_speed: number;
  calories: number;
  path: GpsPoint[];
}

export interface Activity extends ActivityCreate {
  id: string;
  created_at: string;
}

export interface ActivityStats {
  total_activities: number;
  total_distance_km: number;
  total_duration_hours: number;
  total_calories: number;
  total_elevation_m: number;
}

export interface ReviewCreate {
  trail_id: string;
  clerk_user_id: string;
  rating: number;
  comment?: string;
  username?: string;
}

export interface Review extends ReviewCreate {
  id: string;
  created_at: string;
}

export interface ReviewUpdate {
  rating?: number;
  comment?: string;
}

export type UserUpdateRequest = Partial<{
  name: string;
  username: string;
  about: string;
  website: string;
  profile_image: string;
}>;

interface BackendUserUpdate {
  name?: string;
  first_name?: string;
  last_name?: string;
  custom_username?: string;
  about?: string;
  website?: string;
  profile_image?: string;
}

// ── API Client ─────────────────────────────────────────────────────────────────

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string, token: string | null) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {}),
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status}: ${body}`);
    }
    return response.json();
  }

  // ── Trails ─────────────────────────────────────────────────────────────────
  trails = {
    getAll: (params?: {
      difficulty?: string;
      search?: string;
      featured?: boolean;
      popular?: boolean;
    }) => {
      const query = new URLSearchParams();
      if (params?.difficulty && params.difficulty !== "All")
        query.set("difficulty", params.difficulty);
      if (params?.search) query.set("search", params.search);
      if (params?.featured !== undefined)
        query.set("featured", String(params.featured));
      if (params?.popular !== undefined)
        query.set("popular", String(params.popular));
      const qs = query.toString();
      return this.request<Trail[]>(`/api/trails${qs ? `?${qs}` : ""}`);
    },
    getById: (id: string) => this.request<Trail>(`/api/trails/${id}`),
  };

  // ── Users ──────────────────────────────────────────────────────────────────
  users = {
    getMe: (clerkUserId: string) =>
      this.request<User>(`/api/users/${clerkUserId}`),

    updateMe: (clerkUserId: string, data: UserUpdateRequest) => {
      const backendData: BackendUserUpdate = {};
      if (data.name) {
        const parts = data.name.trim().split(" ");
        backendData.name = data.name.trim();
        backendData.first_name = parts[0];
        backendData.last_name =
          parts.length > 1 ? parts.slice(1).join(" ") : undefined;
      }
      if (data.username) backendData.custom_username = data.username;
      if (data.about !== undefined) backendData.about = data.about;
      if (data.website !== undefined) backendData.website = data.website;
      if (data.profile_image !== undefined)
        backendData.profile_image = data.profile_image;
      return this.request<User>(`/api/users/${clerkUserId}`, {
        method: "PUT",
        body: JSON.stringify(backendData),
      });
    },

    saveTrail: (clerkUserId: string, trailId: string) =>
      this.request<{ message: string }>(
        `/api/users/${clerkUserId}/saved-trails/${trailId}`,
        { method: "POST" },
      ),

    unsaveTrail: (clerkUserId: string, trailId: string) =>
      this.request<{ message: string }>(
        `/api/users/${clerkUserId}/saved-trails/${trailId}`,
        { method: "DELETE" },
      ),
  };

  // ── Activities ─────────────────────────────────────────────────────────────
  activities = {
    create: (data: ActivityCreate) =>
      this.request<{ message: string; activity_id: string }>(
        "/api/activities",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      ),

    getAll: (clerkUserId: string) =>
      this.request<Activity[]>(`/api/activities?clerk_user_id=${clerkUserId}`),

    getById: (id: string) => this.request<Activity>(`/api/activities/${id}`),

    getStats: (clerkUserId: string) =>
      this.request<ActivityStats>(
        `/api/activities/stats?clerk_user_id=${clerkUserId}`,
      ),

    delete: (id: string) =>
      this.request<{ message: string }>(`/api/activities/${id}`, {
        method: "DELETE",
      }),
  };

  // ── Reviews ────────────────────────────────────────────────────────────────
  reviews = {
    getByTrail: (trailId: string) =>
      this.request<{ reviews: Review[]; total: number }>(
        `/api/reviews/trail/${trailId}`,
      ),

    getByUser: (clerkUserId: string) =>
      this.request<{ reviews: Review[]; total: number }>(
        `/api/reviews/user/${clerkUserId}`,
      ),

    create: (data: ReviewCreate) =>
      this.request<{ message: string; review_id: string }>("/api/reviews", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (reviewId: string, data: ReviewUpdate) =>
      this.request<{ message: string }>(`/api/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (reviewId: string) =>
      this.request<{ message: string }>(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      }),
  };

  // ── Chat ───────────────────────────────────────────────────────────────────
  chat = {
    send: (message: string) =>
      this.request<{ reply: string }>("/api/chat/", {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
  };
}

export const createApiClient = (token: string | null = null) =>
  new ApiClient(API_BASE_URL, token);

// Default instance without token
export const api = createApiClient();