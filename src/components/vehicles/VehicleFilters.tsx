// src/components/vehicles/VehicleFilters.tsx
"use client";

import React from "react";
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
import { SlidersHorizontal, Grid, List, X, Search } from "lucide-react";
import {
  VehicleFilters as Filters,
  SearchParams,
  BRANDS,
  CATEGORIES,
  TRANSMISSIONS,
  FUEL_TYPES,
  SEAT_COUNTS,
} from "@/components/types/vehicle";

interface VehicleFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
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

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const updateSearchParam = (key: keyof SearchParams, value: string) => {
    onSearchParamsChange({
      ...searchParams,
      [key]: value,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.brand.length > 0 ||
      filters.category.length > 0 ||
      filters.transmission.length > 0 ||
      filters.fuelType.length > 0 ||
      filters.seats.length > 0 ||
      filters.minRating > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 300
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Parameters from Hero Search */}
      {(searchParams.pickupLocation || searchParams.pickupDate) && (
        <Card className="bg-carbookers-red-50 border-carbookers-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-carbookers-red-800 flex items-center gap-2">
                <Search className="h-4 w-4" />
                {tFilters("searchCriteria")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchParamsChange({})}
                className="text-carbookers-red-600 hover:text-carbookers-red-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              {searchParams.pickupLocation && (
                <div>
                  <span className="text-gray-600">{tFilters("pickup")}:</span>
                  <p className="font-medium">{searchParams.pickupLocation}</p>
                </div>
              )}
              {searchParams.dropoffLocation && (
                <div>
                  <span className="text-gray-600">{tFilters("dropoff")}:</span>
                  <p className="font-medium">{searchParams.dropoffLocation}</p>
                </div>
              )}
              {searchParams.pickupDate && (
                <div>
                  <span className="text-gray-600">{tFilters("dates")}:</span>
                  <p className="font-medium">
                    {searchParams.pickupDate}
                    {searchParams.returnDate && ` - ${searchParams.returnDate}`}
                  </p>
                </div>
              )}
              {searchParams.pickupTime && (
                <div>
                  <span className="text-gray-600">{tFilters("time")}:</span>
                  <p className="font-medium">
                    {searchParams.pickupTime}
                    {searchParams.returnTime && ` - ${searchParams.returnTime}`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Filter Controls */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          {/* Top Row: Results count, View toggle, Sort, Show count */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {totalResults} {tFilters("resultsFound")}
              </span>

              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-carbookers-red-600 border-carbookers-red-200 hover:bg-carbookers-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  {tFilters("clearFilters")}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("list")}
                  className="rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={tFilters("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">
                    {tFilters("recommended")}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {tFilters("priceLowToHigh")}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {tFilters("priceHighToLow")}
                  </SelectItem>
                  <SelectItem value="rating">{tFilters("rating")}</SelectItem>
                  <SelectItem value="name">{tFilters("name")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Show Results Count */}
              <Select
                value={showResults.toString()}
                onValueChange={(value) => onShowResultsChange(Number(value))}
              >
                <SelectTrigger className="w-32">
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

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Brand Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {tFilters("brand")}
              </Label>
              <Select
                value={filters.brand[0] || "all"}
                onValueChange={(value) =>
                  updateFilter("brand", value === "all" ? [] : [value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={tFilters("allBrands")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tFilters("allBrands")}</SelectItem>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {tFilters("category")}
              </Label>
              <Select
                value={filters.category[0] || "all"}
                onValueChange={(value) =>
                  updateFilter("category", value === "all" ? [] : [value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={tFilters("allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {tFilters("allCategories")}
                  </SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {tFilters(`categories.${category.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {tFilters("transmission")}
              </Label>
              <Select
                value={filters.transmission[0] || "all"}
                onValueChange={(value) =>
                  updateFilter("transmission", value === "all" ? [] : [value])
                }
              >
                <SelectTrigger>
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
              <Label className="text-sm font-medium mb-2 block">
                {tFilters("fuelType")}
              </Label>
              <Select
                value={filters.fuelType[0] || "all"}
                onValueChange={(value) =>
                  updateFilter("fuelType", value === "all" ? [] : [value])
                }
              >
                <SelectTrigger>
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
              <Label className="text-sm font-medium mb-2 block">
                {tFilters("seats")}
              </Label>
              <Select
                value={filters.seats[0] || "all"}
                onValueChange={(value) =>
                  updateFilter("seats", value === "all" ? [] : [value])
                }
              >
                <SelectTrigger>
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
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {tFilters("priceRange")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0] || ""}
                  onChange={(e) =>
                    updateFilter("priceRange", [
                      Number(e.target.value) || 0,
                      filters.priceRange[1],
                    ])
                  }
                  className="text-sm"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={
                    filters.priceRange[1] === 300 ? "" : filters.priceRange[1]
                  }
                  onChange={(e) =>
                    updateFilter("priceRange", [
                      filters.priceRange[0],
                      Number(e.target.value) || 300,
                    ])
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleFilters;
