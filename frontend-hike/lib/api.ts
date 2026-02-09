// lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://192.168.10.11:8000'  // Your local IP
  : 'https://your-production-url.com';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private async loadToken() {
    this.token = await AsyncStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Trail endpoints
  trails = {
    getAll: (filters?: { difficulty?: string; category?: string }) =>
      this.request<Trail[]>('/api/trails', {
        method: 'GET',
        // For now, return mock data until backend is ready
      }),
    
    getById: (id: string) =>
      this.request<Trail>(`/api/trails/${id}`),
    
    save: (id: string) =>
      this.request<void>(`/api/trails/${id}/save`, { method: 'POST' }),
    
    unsave: (id: string) =>
      this.request<void>(`/api/trails/${id}/save`, { method: 'DELETE' }),
    
    getSaved: () =>
      this.request<Trail[]>('/api/users/me/saved'),
    
    addReview: (id: string, review: { rating: number; comment: string }) =>
      this.request<Review>(`/api/trails/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(review),
      }),
  };

  // Activity endpoints
  activities = {
    create: (data: ActivityCreate) =>
      this.request<Activity>('/api/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getAll: () =>
      this.request<Activity[]>('/api/users/me/activities'),
    
    getById: (id: string) =>
      this.request<Activity>(`/api/activities/${id}`),
    
    delete: (id: string) =>
      this.request<void>(`/api/activities/${id}`, { method: 'DELETE' }),
  };

  // User endpoints
  users = {
    getMe: () =>
      this.request<User>('/api/users/me'),
    
    updateMe: (data: Partial<User>) =>
      this.request<User>('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // Chat endpoint (already exists in backend)
  chat = {
    send: (message: string) =>
      this.request<{ reply: string }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  };

  // GPX endpoints
  gpx = {
    export: (activityId: string) =>
      this.request<Blob>(`/api/gpx/export/${activityId}`),
    
    import: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return this.request<Activity>('/api/gpx/import', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set multipart headers
      });
    },
  };
}

export const api = new ApiClient(API_BASE_URL);

// Types (move to types/api.ts later)
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
  isSaved: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
}

export interface Activity {
  id: string;
  trailId?: string;
  userId: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
  elevationGain: number;
  gpxData?: string;
  path: { latitude: number; longitude: number }[];
  stats: ActivityStats;
}

export interface ActivityStats {
  avgSpeed: number;
  maxSpeed: number;
  avgPace: number;
  calories: number;
}

export interface ActivityCreate {
  trailId?: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
  elevationGain: number;
  gpxData?: string;
  path: { latitude: number; longitude: number }[];
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  profilePic?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  trailId: string;
  rating: number;
  comment: string;
  createdAt: string;
}