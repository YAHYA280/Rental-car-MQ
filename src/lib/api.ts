// src/lib/api.ts - Updated API Service with unified types
import axios, { AxiosInstance, AxiosResponse } from "axios";

// Re-export types from unified location
export * from "@/components/types";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    pages: number;
    current: number;
    totalPages: number;
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  errors?: any[];
}

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
  source: "website" | "admin" | "referral" | "social" | "other";
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
  status?: "active" | "inactive" | "blocked";
  notes?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  tier?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  pickupAddress?: string;
  returnAddress?: string;
  dailyRate: number;
  totalDays: number;
  subtotal: number;
  discountAmount: number;
  discountType?: string;
  discountCode?: string;
  taxAmount: number;
  totalAmount: number;
  cautionAmount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  source: "website" | "admin" | "phone" | "mobile-app";
  paymentStatus: "pending" | "partial" | "paid" | "refunded";
  paymentMethod?: string;
  paidAmount: number;
  pickupCondition?: any;
  returnCondition?: any;
  additionalServices: string[];
  additionalServicesTotal: number;
  specialRequirements?: string;
  customerNotes?: string;
  adminNotes?: string;
  customerRating?: number;
  customerFeedback?: string;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  vehicle?: any; // Use CarData from unified types
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
        }

        // Return structured error response
        const errorResponse = {
          success: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          errors: error.response?.data?.errors || [],
        };

        return Promise.reject(errorResponse);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.api.get(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.api.post(url, data);
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.api.put(url, data);
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.api.delete(url);
  }

  // FormData methods
  async postFormData<T>(
    url: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    return this.api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async putFormData<T>(
    url: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    return this.api.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // File upload with progress
  async uploadFile<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    return this.api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.api.get("/health");
  }
}

export const apiService = new ApiService();

// Utility functions
export const formatApiError = (error: any): string => {
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err: any) => err.msg || err.message).join(", ");
  }
  return error.message || "An unexpected error occurred";
};

export const buildQueryString = (params: Record<string, any>): string => {
  const filteredParams = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return new URLSearchParams(filteredParams).toString();
};
