// frontend-hike/types/api.ts

export type {
  Trail,
  User,
  GpsPoint,
  Activity,
  ActivityCreate,
  ActivityStats,
  Review,
  ReviewCreate,
  ReviewUpdate,
  UserUpdateRequest,
} from "@/lib/api";

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

export interface TrailFilters {
  difficulty?: "Easy" | "Moderate" | "Hard" | "Expert";
  search?: string;
  featured?: boolean;
  popular?: boolean;
  tags?: string[];
}

export interface ActivityFilters {
  trailId?: string;
  startDate?: string;
  endDate?: string;
}