// src/components/types/vehicle.ts
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
  category: "Economy" | "Premium" | "Luxury" | "SUV" | "Electric" | "Family";
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
  category: string[];
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

// Filter constants
export const BRANDS = [
  "Ford",
  "Honda",
  "Toyota",
  "BMW",
  "Mercedes",
  "Audi",
  "Tesla",
  "Volkswagen",
  "Porsche",
  "Nissan",
];
export const CATEGORIES = [
  "Economy",
  "Premium",
  "Luxury",
  "SUV",
  "Electric",
  "Family",
];
export const TRANSMISSIONS = ["Manual", "Automatic"];
export const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];
export const SEAT_COUNTS = ["4", "5", "7+"];
