// src/types/index.ts - Unified types for the entire application
export interface CarData {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
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

  // Image fields - database stored
  image?: string; // Fallback/computed field for display
  mainImage?: {
    dataUrl?: string;
    mimetype?: string;
    name?: string;
  };
  images?: Array<{
    dataUrl: string;
    name: string;
  }>;

  // Relations
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

// User/Customer types
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email?: string; // FIXED: Email is now optional
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  driverLicenseNumber?: string;
  // FIXED: Driver license image structure for BYTEA storage
  driverLicenseImage?: {
    dataUrl?: string;
    mimetype?: string;
    name?: string;
  };
  // FIXED: Also support legacy structure for backward compatibility
  driverLicenseImageData?: ArrayBuffer;
  driverLicenseImageMimetype?: string;
  driverLicenseImageName?: string;
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
  phoneFormatted?: string; // FIXED: Added formatted phone for display
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email?: string; // FIXED: Email is now optional
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  driverLicenseNumber?: string;
  driverLicenseImage?: File; // FIXED: Driver license is optional
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;
  status?: "active" | "inactive" | "blocked";
  notes?: string;
}

export interface UserFiltersType {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  tier?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

// Booking types
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
  customer?: UserData;
  vehicle?: CarData;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

// Constants
export const BRANDS = [
  "Cupra",
  "Dacia",
  "Hyundai",
  "KIA",
  "Mercedes",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "SEAT",
  "Volkswagen",
] as const;

export const TRANSMISSIONS = ["manual", "automatic"] as const;
export const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid"] as const;
export const SEAT_COUNTS = ["2", "4", "5", "7", "8"] as const;
export const DOOR_COUNTS = ["2", "3", "4", "5"] as const;

export const FEATURES = [
  "airConditioning",
  "bluetooth",
  "gps",
  "cruiseControl",
  "parkingSensors",
  "backupCamera",
  "leatherSeats",
  "keylessEntry",
  "electricWindows",
  "abs",
] as const;

export const VEHICLE_STATUS = ["active", "maintenance", "inactive"] as const;
export const USER_STATUS = ["active", "inactive", "blocked"] as const;
export const BOOKING_STATUS = [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
] as const;

// Form validation helpers
export const isValidLicensePlate = (plate: string): boolean => {
  const plateRegex = /^\d{5}[A-Z]$/;
  return plateRegex.test(plate.toUpperCase());
};

export const isValidWhatsAppNumber = (number: string): boolean => {
  const phoneRegex = /^0[67]\d{8}$/;
  return phoneRegex.test(number.replace(/\s/g, ""));
};

export const formatWhatsAppNumber = (number: string): string => {
  if (!number) return "";
  const cleaned = number.replace(/\s/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(
      2,
      4
    )} ${cleaned.substring(4, 6)} ${cleaned.substring(
      6,
      8
    )} ${cleaned.substring(8, 10)}`;
  }
  return number;
};

// Type guards
export const isCarData = (obj: any): obj is CarData => {
  return obj && typeof obj.id === "string" && typeof obj.name === "string";
};

export const isUser = (obj: any): obj is UserData => {
  return obj && typeof obj.id === "string" && typeof obj.email === "string";
};

export const isBooking = (obj: any): obj is Booking => {
  return (
    obj && typeof obj.id === "string" && typeof obj.bookingNumber === "string"
  );
};
