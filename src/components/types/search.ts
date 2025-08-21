import { Car } from "./index";

// src/components/types/search.ts
export interface SearchFormData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  differentDropoff: boolean;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
}

export interface SearchFilters {
  priceRange: [number, number];
  carType: string[];
  transmission: string[];
  fuelType: string[];
  features: string[];
}

export interface SearchResults {
  cars: Car[];
  totalCount: number;
  filters: SearchFilters;
}

// Re-export the Car interface
export type { Car } from "./index";
