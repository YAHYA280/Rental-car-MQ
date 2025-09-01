// src/components/dashboard/bookings/types/bookingTypes.ts

export interface BookingData {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    image: string;
    whatsappNumber?: string;
    licensePlate?: string;
  };
  dates: {
    pickup: string;
    return: string;
    pickupTime: string;
    returnTime: string;
  };
  locations: {
    pickup: string;
    return: string;
  };
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalAmount: number;
  dailyRate: number;
  days: number;
  createdAt: string;
  source: "admin" | "website";
  notes?: string;
}

export interface BookingFormData {
  customerId: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  notes: string; // Changed from optional to required string
}

export interface CarData {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  available: boolean;
  licensePlate: string;
  whatsappNumber?: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

export interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  monthlyRevenue: number;
}

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
  formData: BookingFormData
) => Promise<void>;
export type BookingSelectHandler = (booking: BookingData) => void;
