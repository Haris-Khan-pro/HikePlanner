const API_BASE_URL = __DEV__
  ? 'http://192.168.0.106:8000'  // ← CHANGE THIS to your machine's local IP (run: ipconfig on Windows / ifconfig on Mac)
  : 'https://your-production-url.com';

// ── Types ─────────────────────────────────────────────────

export interface Trail {
  id: string;
  name: string;
  location: string;
  distance: number;
  duration: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  elevation: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isFeatured: boolean;
  isPopular: boolean;
  isSaved?: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
}

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  username?: string;
  profile_image?: string;
  website?: string;
  about?: string;
  auth_provider: string;
  saved_trails: string[];
  completed_activities: number;
  total_distance_km: number;
  created_at: string;
  last_login?: string;
}

export interface ActivityCreate {
  trail_id?: string;
  trail_name?: string;
  start_time: string;
  end_time: string;
  distance: number;      // meters
  duration: number;      // seconds
  elevation_gain: number;
  avg_speed: number;     // m/s
  max_speed: number;     // m/s
  calories: number;
  path: { latitude: number; longitude: number }[];
}

export interface Activity extends ActivityCreate {
  id: string;
  clerk_user_id: string;
  created_at: string;
}

export type UserUpdateRequest = Partial<Pick<User, 'name' | 'username' | 'website' | 'about'>>;

// ── API Client ────────────────────────────────────────────

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string, token: string | null) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
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

  // Public — no auth needed
  trails = {
    getAll: (params?: { difficulty?: string; search?: string; featured?: boolean; popular?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.difficulty && params.difficulty !== 'All') query.set('difficulty', params.difficulty);
      if (params?.search) query.set('search', params.search);
      if (params?.featured !== undefined) query.set('featured', String(params.featured));
      if (params?.popular !== undefined) query.set('popular', String(params.popular));
      const qs = query.toString();
      return this.request<Trail[]>(`/api/trails${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => this.request<Trail>(`/api/trails/${id}`),
  };

  // Protected — require Clerk JWT
  users = {
    getMe: () => this.request<User>('/api/users/me'),
    updateMe: (data: UserUpdateRequest) =>
      this.request<User>('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),
    saveTrail: (trailId: string) =>
      this.request<{ message: string }>(`/api/users/me/saved-trails/${trailId}`, { method: 'POST' }),
    unsaveTrail: (trailId: string) =>
      this.request<{ message: string }>(`/api/users/me/saved-trails/${trailId}`, { method: 'DELETE' }),
    getSavedTrails: () =>
      this.request<{ saved_trails: string[] }>('/api/users/me/saved-trails'),
  };

  activities = {
    create: (data: ActivityCreate) =>
      this.request<{ message: string; activity_id: string }>('/api/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => this.request<Activity[]>('/api/activities'),
    getById: (id: string) => this.request<Activity>(`/api/activities/${id}`),
    delete: (id: string) =>
      this.request<{ message: string }>(`/api/activities/${id}`, { method: 'DELETE' }),
  };

  chat = {
    send: (message: string) =>
      this.request<{ reply: string }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  };
}

/**
 * createApiClient(token)
 * 
 * Call this in every hook after: const token = await getToken()
 * The token is a Clerk JWT that the backend verifies against Clerk's JWKS.
 */
export const createApiClient = (token: string | null = null) =>
  new ApiClient(API_BASE_URL, token);