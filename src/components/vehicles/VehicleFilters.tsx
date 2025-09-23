// src/components/vehicles/VehicleFilters.tsx - Fixed to work with backend
"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, List, X, Search } from "lucide-react";
import { carService } from "@/services/carService";

// Updated interface to match backend CarFilters structure
interface VehicleFiltersType {
  brand?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: string;
  available?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface SearchParams {
  pickup?: string;
  dropoff?: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  differentDropoff?: boolean;
  driverAge?: string;
}

interface VehicleFiltersProps {
  filters: VehicleFiltersType;
  onFiltersChange: (filters: VehicleFiltersType) => void;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showResults: number;
  onShowResultsChange: (count: number) => void;
  totalResults: number;
  onClearFilters: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onFiltersChange,
  searchParams,
  onSearchParamsChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  showResults,
  onShowResultsChange,
  totalResults,
  onClearFilters,
}) => {
  const t = useTranslations("vehicles");
  const tFilters = useTranslations("filters");
  const tCommon = useTranslations("common");

  // State for dynamic brands from backend
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // Backend constants that match your backend enums
  const TRANSMISSIONS = ["manual", "automatic"];
  const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid"];
  const SEAT_COUNTS = ["2", "4", "5", "7", "8"];

  // Sort options that match your backend
  const SORT_OPTIONS = [
    { value: "createdAt", label: tFilters("recommended") },
    { value: "price", label: tFilters("priceLowToHigh") },
    { value: "-price", label: tFilters("priceHighToLow") },
    { value: "-rating", label: tFilters("rating") },
    { value: "name", label: tFilters("name") },
    { value: "brand", label: tFilters("brand") },
  ];

  // Fetch available brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const response = await carService.getBrands();
        if (response.success && response.data) {
          setAvailableBrands(response.data);
        } else {
          console.warn("Failed to fetch brands, using fallback");
          setAvailableBrands([
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
          ]);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        // Fallback brands
        setAvailableBrands([
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
        ]);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  const updateFilter = (key: keyof VehicleFiltersType, value: any) => {
    const newFilters = { ...filters };

    if (value === "all" || value === "" || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    // Reset to first page when filters change
    newFilters.page = 1;

    onFiltersChange(newFilters);
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some((key) => {
      if (key === "page" || key === "limit" || key === "sort") return false;
      return filters[key as keyof VehicleFiltersType] !== undefined;
    });
  };

  const clearSearchParams = (): SearchParams => ({
    pickup: "",
    dropoff: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    differentDropoff: false,
    driverAge: "",
  });

  const handleSearchInput = (value: string) => {
    updateFilter("search", value || undefined);
  };

  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    const numValue = value ? Number(value) : undefined;
    if (type === "min") {
      updateFilter("minPrice", numValue);
    } else {
      updateFilter("maxPrice", numValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Filter Controls */}
      <Card className="border-gray-200">
        <CardContent className="p-4 lg:p-6">
          {/* Top Section: Results count and Clear Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm sm:text-base">
                {totalResults} {tFilters("resultsFound")}
              </span>

              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-carbookers-red-600 border-carbookers-red-200 hover:bg-carbookers-red-50 text-xs sm:text-sm"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {tFilters("clearFilters")}
                </Button>
              )}
            </div>

            {/* Display Controls - Mobile Optimized */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("grid")}
                  className="rounded-r-none p-2"
                  title={tFilters("gridView")}
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("list")}
                  className="rounded-l-none border-l p-2"
                  title={tFilters("listView")}
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              {/* Sort By - Responsive width */}
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-32 sm:w-48 text-xs sm:text-sm">
                  <SelectValue placeholder={tFilters("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Show Results Count */}
              <Select
                value={showResults.toString()}
                onValueChange={(value) => onShowResultsChange(Number(value))}
              >
                <SelectTrigger className="w-16 sm:w-20 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <Label className="text-xs sm:text-sm font-medium mb-2 block">
              {tFilters("searchVehicles")}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={
                  tFilters("searchPlaceholder") || "Search vehicles..."
                }
                value={filters.search || ""}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Controls - Mobile-First Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Brand Filter - Dynamic from backend */}
            <div>
              <Label className="text-xs sm:text-sm font-medium mb-2 block">
                {tFilters("brand")}
              </Label>
              <Select
                value={filters.brand || "all"}
                onValueChange={(value) => updateFilter("brand", value)}
                disabled={loadingBrands}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue
                    placeholder={
                      loadingBrands ? "Loading..." : tFilters("allBrands")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tFilters("allBrands")}</SelectItem>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission Filter */}
            <div>
              <Label className="text-xs sm:text-sm font-medium mb-2 block">
                {tFilters("transmission")}
              </Label>
              <Select
                value={filters.transmission || "all"}
                onValueChange={(value) => updateFilter("transmission", value)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder={tFilters("allTransmissions")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {tFilters("allTransmissions")}
                  </SelectItem>
                  {TRANSMISSIONS.map((transmission) => (
                    <SelectItem key={transmission} value={transmission}>
                      {tFilters(`transmissions.${transmission.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <Label className="text-xs sm:text-sm font-medium mb-2 block">
                {tFilters("fuelType")}
              </Label>
              <Select
                value={filters.fuelType || "all"}
                onValueChange={(value) => updateFilter("fuelType", value)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder={tFilters("allFuelTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {tFilters("allFuelTypes")}
                  </SelectItem>
                  {FUEL_TYPES.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {tFilters(`fuelTypes.${fuel.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seats Filter */}
            <div>
              <Label className="text-xs sm:text-sm font-medium mb-2 block">
                {tFilters("seats")}
              </Label>
              <Select
                value={filters.seats || "all"}
                onValueChange={(value) => updateFilter("seats", value)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder={tFilters("allSeats")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tFilters("allSeats")}</SelectItem>
                  {SEAT_COUNTS.map((seat) => (
                    <SelectItem key={seat} value={seat}>
                      {seat} {tFilters("seatsLabel")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Label className="text-xs sm:text-sm font-medium mb-2 block">
                {tFilters("priceRange")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder={tCommon("minimum")}
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handlePriceRangeChange("min", e.target.value)
                  }
                  className="text-xs sm:text-sm h-8 sm:h-9"
                />
                <span className="text-gray-400 text-xs sm:text-sm">-</span>
                <Input
                  type="number"
                  placeholder={tCommon("maximum")}
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handlePriceRangeChange("max", e.target.value)
                  }
                  className="text-xs sm:text-sm h-8 sm:h-9"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">€ {t("perDay")}</p>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="mt-4 flex items-center gap-4">
            <Label className="text-xs sm:text-sm font-medium">
              {tFilters("availability")}
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available-only"
                checked={filters.available === true}
                onChange={(e) =>
                  updateFilter("available", e.target.checked ? true : undefined)
                }
                className="w-4 h-4 text-carbookers-red-600 bg-gray-100 border-gray-300 rounded focus:ring-carbookers-red-500"
              />
              <label
                htmlFor="available-only"
                className="text-xs sm:text-sm text-gray-700 cursor-pointer"
              >
                {tFilters("availableOnly")}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleFilters;
