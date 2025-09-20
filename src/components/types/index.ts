// src/types/index.ts - UPDATED: Added all new customer fields for passport, CIN, and enhanced information
export interface CarData {
  id: string;
  name: string;
  brand: string;
  year: number;
  model: string;
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
  available?: boolean | string; // Can be boolean or string from URL params
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

// UPDATED: Enhanced User/Customer types with all new fields
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email?: string; // Email is optional
  phone: string;

  // UPDATED: Enhanced personal information
  dateOfBirth?: string; // NEW: Date de naissance
  age?: number; // Computed field from dateOfBirth
  address?: string; // ENHANCED: Now supports up to 500 characters
  city?: string;
  postalCode?: string;
  country: string;

  // UPDATED: Enhanced driver license information
  driverLicenseNumber?: string; // ENHANCED: Now properly validated
  driverLicenseImage?: {
    dataUrl?: string;
    mimetype?: string;
    name?: string;
  };
  // Also support legacy structure for backward compatibility
  driverLicenseImageData?: ArrayBuffer;
  driverLicenseImageMimetype?: string;
  driverLicenseImageName?: string;

  // NEW: Passport information
  passportNumber?: string; // Numéro de passeport
  passportIssuedAt?: string; // Délivré à (city/country where issued)
  passportImage?: {
    dataUrl?: string;
    mimetype?: string;
    name?: string;
  };

  // NEW: CIN (Carte d'Identité Nationale) information
  cinNumber?: string; // Numéro CIN
  cinImage?: {
    dataUrl?: string;
    mimetype?: string;
    name?: string;
  };

  // Emergency contact and preferences
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;

  // Status and metrics
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

  // Timestamps and relations
  createdAt: string;
  updatedAt: string;
  phoneFormatted?: string; // Formatted phone for display
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };

  // NEW: Document completion tracking
  documentCompletion?: {
    hasDriverLicense: boolean;
    hasPassport: boolean;
    hasCin: boolean;
    hasDateOfBirth: boolean;
    hasAddress: boolean;
    completionScore: number; // 0-5 scale
  };
}

// UPDATED: Enhanced form data for customer creation/editing
export interface UserFormData {
  // Basic required information
  firstName: string;
  lastName: string;
  email?: string; // Email is optional
  phone: string;

  // NEW: Enhanced personal information
  dateOfBirth?: string; // Date de naissance
  address?: string; // Adresse complète (up to 500 chars)
  city?: string; // Ville
  postalCode?: string; // Code postal
  country?: string; // Pays

  // UPDATED: Enhanced document information
  driverLicenseNumber?: string; // Numéro de permis de conduire
  driverLicenseImage?: File; // Image du permis (optional)

  // NEW: Passport information
  passportNumber?: string; // Numéro de passeport
  passportIssuedAt?: string; // Délivré à
  passportImage?: File; // Image du passeport (optional)

  // NEW: CIN information
  cinNumber?: string; // Numéro CIN
  cinImage?: File; // Image de la CIN (optional)

  // Additional information
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;
  status?: "active" | "inactive" | "blocked";
  notes?: string;
}

// UPDATED: Enhanced filters with document status
export interface UserFiltersType {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  tier?: string;
  documentStatus?: "complete" | "incomplete" | "no-documents"; // NEW: Filter by document completion
  sort?: string;
  order?: "ASC" | "DESC";
}

// NEW: Document completion status interface
export interface DocumentCompletionStatus {
  hasDriverLicense: boolean;
  hasPassport: boolean;
  hasCin: boolean;
  hasDateOfBirth: boolean;
  hasAddress: boolean;
  completionScore: number;

  // Individual document details
  documents: {
    driverLicense: {
      hasNumber: boolean;
      hasImage: boolean;
      complete: boolean;
    };
    passport: {
      hasNumber: boolean;
      hasImage: boolean;
      hasIssuedAt: boolean;
      complete: boolean;
    };
    cin: {
      hasNumber: boolean;
      hasImage: boolean;
      complete: boolean;
    };
    personal: {
      hasDateOfBirth: boolean;
      hasAddress: boolean;
      hasAge: boolean;
    };
  };
}

// NEW: Document upload interfaces
export interface DocumentUploadData {
  driverLicenseImage?: File;
  passportImage?: File;
  cinImage?: File;
}

export interface SingleDocumentUpload {
  file: File;
  documentType: "driverLicense" | "passport" | "cin";
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
    // NEW: Include document information for contract generation
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    driverLicenseNumber?: string;
    passportNumber?: string;
    passportIssuedAt?: string;
    cinNumber?: string;
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
  notes?: string;
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

// NEW: Contract generation interfaces
export interface ContractData {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    driverLicenseNumber?: string;
    passportNumber?: string;
    passportIssuedAt?: string;
    cinNumber?: string;
  };
  vehicle: {
    brand: string;
    name: string;
    year: number;
    licensePlate: string;
  };
  booking: {
    bookingNumber: string;
    pickupDate: string;
    returnDate: string;
    pickupTime: string;
    returnTime: string;
    totalDays: number;
    totalAmount: number;
  };
}

export interface ContractValidation {
  isValid: boolean;
  missingFields: string[];
  completionScore: number;
  hasRequiredFields: boolean;
  hasAnyIdentityDocument: boolean;
  completionPercentage: number;
}

// Utility interfaces
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

export interface FormValidationState {
  [key: string]: string;
}

// Event handler types
export type BookingActionHandler = (bookingId: string) => void | Promise<void>;
export type BookingFormSubmitHandler = (
  formData: AdminBookingFormData
) => Promise<void>;
export type BookingSelectHandler = (booking: BookingData) => void;

// NEW: Document upload handler types
export type DocumentUploadHandler = (
  customerId: string,
  documentData: DocumentUploadData
) => Promise<void>;
export type SingleDocumentUploadHandler = (
  customerId: string,
  upload: SingleDocumentUpload
) => Promise<void>;

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

// NEW: Document type constants
export const DOCUMENT_TYPES = ["driverLicense", "passport", "cin"] as const;

export const DOCUMENT_STATUS_FILTERS = [
  "complete",
  "incomplete",
  "no-documents",
] as const;

// NEW: Country codes with French nationalities
export const COUNTRY_NATIONALITIES = {
  MA: "Marocaine",
  FR: "Française",
  ES: "Espagnole",
  DE: "Allemande",
  IT: "Italienne",
  GB: "Britannique",
  US: "Américaine",
  CA: "Canadienne",
  DZ: "Algérienne",
  TN: "Tunisienne",
  BE: "Belge",
  NL: "Néerlandaise",
  PT: "Portugaise",
} as const;

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

// Helper to convert string boolean to actual boolean
export const parseStringBoolean = (
  value: string | boolean | undefined
): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
};

// NEW: Document validation helpers
export const validatePassportNumber = (passportNumber: string): boolean => {
  // Basic validation - adjust based on your requirements
  return !!(passportNumber && passportNumber.trim().length >= 6);
};

export const validateCinNumber = (cinNumber: string): boolean => {
  // Basic validation for Moroccan CIN - adjust based on requirements
  return !!(cinNumber && /^[A-Z]{1,2}\d{6}$/.test(cinNumber.trim()));
};

export const validateDriverLicenseNumber = (licenseNumber: string): boolean => {
  // Basic validation - adjust based on your requirements
  return !!(licenseNumber && licenseNumber.trim().length >= 6);
};

// NEW: Age validation helper
export const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;
  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  } catch {
    return null;
  }
};

export const isValidAge = (dateOfBirth: string): boolean => {
  const age = calculateAge(dateOfBirth);
  return age !== null && age >= 18 && age <= 100;
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

// NEW: Document completion helpers
export const calculateDocumentCompletion = (user: UserData): number => {
  const fields = [
    user.firstName,
    user.lastName,
    user.phone,
    user.email,
    user.dateOfBirth,
    user.address,
    user.driverLicenseNumber,
    user.passportNumber,
    user.cinNumber,
    user.passportIssuedAt,
  ];

  const completedFields = fields.filter(
    (field) => field && field.toString().trim() !== ""
  ).length;

  return Math.round((completedFields / fields.length) * 100);
};

export const hasCompleteDocuments = (user: UserData): boolean => {
  return !!(
    user.firstName &&
    user.lastName &&
    user.phone &&
    user.dateOfBirth &&
    user.address &&
    (user.driverLicenseNumber || user.passportNumber || user.cinNumber)
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

export interface VehicleAvailabilityStatus {
  available: boolean;
  nextAvailableDate?: string;
  currentBooking?: {
    id: string;
    bookingNumber: string;
    pickupDate: string;
    returnDate: string;
    status: string;
    customerName: string;
  };
  upcomingBooking?: {
    id: string;
    bookingNumber: string;
    pickupDate: string;
    returnDate: string;
    status: string;
    customerName: string;
  };
}
