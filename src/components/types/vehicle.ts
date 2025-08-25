// src/components/types/vehicle.ts - Updated without category
export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number; // Price in euros
  model: string;
  year: number;
  transmission: "Manual" | "Automatic";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  seats: number;
  features: string[];
  rating: number;
  available: boolean;
  description: string;
  mileage?: number;
  doors: number;
  airConditioning: boolean;
  location: string;
  bookings?: number;
  images?: string[]; // Multiple images for detail view
}

export interface VehicleFilters {
  brand: string[];
  transmission: string[];
  fuelType: string[];
  priceRange: [number, number];
  seats: string[];
  minRating: number;
}

export interface SearchParams {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  differentDropoff?: boolean;
}

// Updated filter constants - new brands based on your car folders
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
];

export const TRANSMISSIONS = ["Manual", "Automatic"];
export const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];
export const SEAT_COUNTS = ["2", "4", "5", "7+"];
