// src/app/[locale]/vehicles/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleFilters from "@/components/vehicles/VehicleFilters";
import VehicleCard from "@/components/vehicles/VehicleCard";
import AnimatedContainer from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { vehiclesData } from "@/components/data/vehicles";
import {
  type VehicleFilters as Filters,
  type SearchParams,
} from "@/components/types/vehicle";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VehiclesPage = () => {
  const t = useTranslations("vehicles");
  const tFilters = useTranslations("filters");
  const searchParams = useSearchParams();

  // Extract search parameters from URL
  const initialSearchParams: SearchParams = {
    pickupLocation: searchParams.get("pickup") || "",
    dropoffLocation: searchParams.get("dropoff") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    pickupTime: searchParams.get("pickupTime") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    differentDropoff: searchParams.get("differentDropoff") === "true",
  };

  // State management
  const [filters, setFilters] = useState<Filters>({
    brand: [],
    category: [],
    transmission: [],
    fuelType: [],
    priceRange: [0, 300],
    seats: [],
    minRating: 0,
  });

  const [searchCriteria, setSearchCriteria] =
    useState<SearchParams>(initialSearchParams);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [showResults, setShowResults] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = vehiclesData.filter((vehicle) => {
      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(vehicle.brand)) {
        return false;
      }

      // Category filter
      if (
        filters.category.length > 0 &&
        !filters.category.includes(vehicle.category)
      ) {
        return false;
      }

      // Transmission filter
      if (
        filters.transmission.length > 0 &&
        !filters.transmission.includes(vehicle.transmission)
      ) {
        return false;
      }

      // Fuel type filter
      if (
        filters.fuelType.length > 0 &&
        !filters.fuelType.includes(vehicle.fuelType)
      ) {
        return false;
      }

      // Price range filter
      if (
        vehicle.price < filters.priceRange[0] ||
        vehicle.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Seats filter
      if (filters.seats.length > 0) {
        const seatMatch = filters.seats.some((seat) => {
          if (seat === "7+") return vehicle.seats >= 7;
          return vehicle.seats.toString() === seat;
        });
        if (!seatMatch) return false;
      }

      // Rating filter
      if (vehicle.rating < filters.minRating) {
        return false;
      }

      return true;
    });

    // Sort vehicles
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) =>
          `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`)
        );
        break;
      case "recommended":
      default:
        // Sort by a combination of rating and bookings
        filtered.sort((a, b) => {
          const scoreA = a.rating * 0.7 + ((a.bookings || 0) / 1000) * 0.3;
          const scoreB = b.rating * 0.7 + ((b.bookings || 0) / 1000) * 0.3;
          return scoreB - scoreA;
        });
        break;
    }

    return filtered;
  }, [filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / showResults);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * showResults,
    currentPage * showResults
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, showResults]);

  const handleClearFilters = () => {
    setFilters({
      brand: [],
      category: [],
      transmission: [],
      fuelType: [],
      priceRange: [0, 300],
      seats: [],
      minRating: 0,
    });
  };

  const handleFavorite = (vehicleId: string) => {
    setFavorites((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <AnimatedContainer direction="down" className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        {/* Filters */}
        <AnimatedContainer direction="down" delay={0.2}>
          <VehicleFilters
            filters={filters}
            onFiltersChange={setFilters}
            searchParams={searchCriteria}
            onSearchParamsChange={setSearchCriteria}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showResults={showResults}
            onShowResultsChange={setShowResults}
            totalResults={filteredVehicles.length}
            onClearFilters={handleClearFilters}
          />
        </AnimatedContainer>

        {/* Results */}
        <div className="mt-8">
          {paginatedVehicles.length > 0 ? (
            <>
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }`}
              >
                {paginatedVehicles.map((vehicle, index) => (
                  <AnimatedContainer
                    key={vehicle.id}
                    delay={index * 0.1}
                    className="h-full"
                  >
                    <VehicleCard
                      vehicle={vehicle}
                      viewMode={viewMode}
                      onFavorite={handleFavorite}
                      isFavorite={favorites.includes(vehicle.id)}
                    />
                  </AnimatedContainer>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <AnimatedContainer
                  direction="up"
                  delay={0.5}
                  className="mt-12 flex justify-center"
                >
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {tFilters("previous")}
                    </Button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              onClick={() => handlePageChange(pageNum)}
                              className="w-10 h-10 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2"
                    >
                      {tFilters("next")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </AnimatedContainer>
              )}

              {/* Results Summary */}
              <AnimatedContainer
                direction="up"
                delay={0.6}
                className="mt-8 text-center text-gray-600"
              >
                <p>
                  {tFilters("showingResults", {
                    start: (currentPage - 1) * showResults + 1,
                    end: Math.min(
                      currentPage * showResults,
                      filteredVehicles.length
                    ),
                    total: filteredVehicles.length,
                  })}
                </p>
              </AnimatedContainer>
            </>
          ) : (
            <AnimatedContainer direction="up" className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tFilters("noResults")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {tFilters("noResultsDescription")}
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white"
                >
                  {tFilters("clearFilters")}
                </Button>
              </div>
            </AnimatedContainer>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehiclesPage;
