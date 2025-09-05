// src/lib/api.ts - Core API Service
import axios, { AxiosInstance, AxiosResponse } from "axios";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
  pagination?: {
    current: number;
    totalPages: number;
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

// Car Types
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  seats: number;
  doors: number;
  mileage?: number;
  licensePlate: string;
  whatsappNumber: string;
  caution: number;
  available: boolean;
  location: string;
  rating: number;
  totalBookings: number;
  description?: string;
  features: string[];
  mainImage?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  };
  images?: Array<{
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  }>;
  lastTechnicalVisit?: string;
  lastOilChange?: string;
  status: "active" | "maintenance" | "inactive";
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CarFormData {
  name: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  transmission: string;
  fuelType: string;
  seats: string;
  doors: string;
  mileage?: string;
  licensePlate: string;
  whatsappNumber: string;
  caution: string;
  location: string;
  description?: string;
  features: string[];
  lastTechnicalVisit?: string;
  lastOilChange?: string;
  mainImage?: File;
  additionalImages?: File[];
}

export interface CarFilters extends PaginationParams {
  brand?: string[];
  transmission?: string[];
  fuelType?: string[];
  available?: boolean;
  location?: string[];
  minPrice?: number;
  maxPrice?: number;
  seats?: string[];
  status?: string;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  driverLicenseNumber?: string;
  driverLicenseImage?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;
  status: "active" | "inactive" | "blocked";
  totalBookings: number;
  totalSpent: number;
  averageRating?: number;
  lastBookingDate?: string;
  source: string;
  referralCode: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  driverLicenseNumber?: string;
  driverLicenseImage?: File;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;
  notes?: string;
}

export interface UserFilters extends PaginationParams {
  status?: string[];
  source?: string[];
  tier?: string;
}

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.removeToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.api.get(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete(endpoint);
    return response.data;
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const response = await this.api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async putFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const response = await this.api.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
