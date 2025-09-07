// src/types/index.ts - Updated types including booking system
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
  email?: string; // Email is optional
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  driverLicenseNumber?: string;
  // Driver license image structure for BYTEA storage
  driverLicenseImage?: {
    dataUrl?: string;
    mimetype?: string;
    name?: string;
  };
  // Also support legacy structure for backward compatibility
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
  phoneFormatted?: string; // Added formatted phone for display
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email?: string; // Email is optional
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  driverLicenseNumber?: string;
  driverLicenseImage?: File; // Driver license is optional
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

// Booking types - Updated for real backend integration
export interface BookingData {
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
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  source: "website" | "admin";
  createdAt: string;
  updatedAt: string;

  // Optional relations
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  vehicle?: {
    id: string;
    name: string;
    brand: string;
    year: number;
    licensePlate: string;
    whatsappNumber?: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  confirmedBy?: {
    id: string;
    name: string;
    email: string;
  };
  cancelledBy?: {
    id: string;
    name: string;
    email: string;
  };

  // Timestamps
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// Website booking form data (includes customer info)
export interface WebsiteBookingFormData {
  // Customer information
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;

  // Booking details
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
}

// Admin booking form data (uses existing customer)
export interface AdminBookingFormData {
  customerId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
}

// General booking form data (for validation and components)
export interface BookingFormData {
  customerId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  notes?: string; // Optional for flexibility
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string | string[];
  source?: string | string[];
  customerId?: string;
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

// Booking statistics
export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  monthlyRevenue: number;
}

// Booking-specific utility types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

// Utility type for form validation
export interface FormValidationState {
  [key: string]: string;
}

// Event handler types
export type BookingActionHandler = (bookingId: string) => void | Promise<void>;
export type BookingFormSubmitHandler = (
  formData: AdminBookingFormData
) => Promise<void>;
export type BookingSelectHandler = (booking: BookingData) => void;

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

export const BOOKING_SOURCES = ["website", "admin"] as const;

// Pickup/Return locations
export const PICKUP_LOCATIONS = [
  "Tangier Airport",
  "Tangier City Center",
  "Tangier Port",
  "Hotel Pickup",
  "Custom Location",
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

// Booking helpers
export const calculateBookingDays = (
  pickupDate: string,
  returnDate: string
): number => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};

export const calculateBookingTotal = (
  dailyRate: number,
  days: number
): number => {
  return dailyRate * days;
};

export const formatBookingStatus = (status: string): string => {
  const statusMap = {
    pending: "Pending Approval",
    confirmed: "Confirmed",
    active: "Vehicle Out",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
  );
};

// Type guards
export const isCarData = (obj: any): obj is CarData => {
  return obj && typeof obj.id === "string" && typeof obj.name === "string";
};

export const isUser = (obj: any): obj is UserData => {
  return obj && typeof obj.id === "string" && typeof obj.firstName === "string";
};

export const isBooking = (obj: any): obj is BookingData => {
  return (
    obj && typeof obj.id === "string" && typeof obj.bookingNumber === "string"
  );
};
