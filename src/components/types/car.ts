// src/components/types/car.ts - Updated interface without model and location
export interface CarData {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  image: string;
  mainImage?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
    fullPath?: string;
  };
  images?: Array<{
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
    fullPath?: string;
  }>;
  seats: number;
  doors: number;
  transmission: string;
  fuelType: string;
  available: boolean;
  rating: number;
  totalBookings: number;
  mileage?: number;
  features: string[];
  description?: string;
  licensePlate: string;
  caution: number;
  whatsappNumber: string;
  status: "active" | "maintenance" | "inactive";
  lastTechnicalVisit?: string;
  lastOilChange?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CarFormData {
  brand: string;
  name: string;
  year: string;
  licensePlate: string;

  transmission: string;
  fuelType: string;
  seats: string;
  doors: string;
  mileage: string;

  dailyPrice: string;
  caution: string;

  whatsappNumber: string;

  lastTechnicalVisit: string;
  lastOilChange: string;

  features: string[];
  mainImage?: File;
  additionalImages: File[];

  description?: string;
}

export interface CarFilters {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string | string[];
  transmission?: string | string[];
  fuelType?: string | string[];
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  seats?: number | string[];
  status?: string;
  sort?: string;
}

// API Response structure
export interface CarApiResponse {
  success: boolean;
  message?: string;
  data?: CarData[];
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
}
