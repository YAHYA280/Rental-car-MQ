// src/components/types/index.ts
export interface Car {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  model: string;
  year: number;
  transmission: "Manual" | "Automatic";
  fuelType: string;
  seats: number;
  features: string[];
  rating: number;
  available: boolean;
  category: string; // Made required instead of optional
  description?: string;
}

export interface BookingFormData {
  fullName: string;
  lastName: string;
  email: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  journeyDate: string;
  journeyTime: string;
  passengers: number;
  luggage: number;
  message?: string;
}
