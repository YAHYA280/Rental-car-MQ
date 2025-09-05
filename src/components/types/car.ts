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
