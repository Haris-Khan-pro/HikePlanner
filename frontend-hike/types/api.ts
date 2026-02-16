// types/api.ts

// Re-export types from lib/api.ts for centralized access
export type {
  Trail,
  Activity,
  ActivityStats,
  ActivityCreate,
  User,
  Review,
} from '@/lib/api';

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
}

// Query parameters
export interface TrailFilters {
  difficulty?: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  minDistance?: number;
  maxDistance?: number;
  minElevation?: number;
  maxElevation?: number;
  category?: 'featured' | 'popular' | 'nearby' | 'saved';
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface ActivityFilters {
  trailId?: string;
  startDate?: string;
  endDate?: string;
  minDistance?: number;
  maxDistance?: number;
  page?: number;
  limit?: number;
}