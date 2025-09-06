// src/components/vehicles/VehiclesPageContent.tsx - Fixed naming conflicts
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleFilters from "@/components/vehicles/VehicleFilters";
import VehicleCard from "@/components/vehicles/VehicleCard";
import AnimatedContainer from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { CarData, CarFilters } from "@/components/types"; // Updated imports
import { carService } from "@/services/carService"; // Added carService
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

// FIXED: Renamed interface to avoid conflict with component import
interface VehicleFiltersState {
  brand: string[];
  transmission: string[];
  fuelType: string[];
  priceRange: [number, number];
  seats: string[];
  minRating: number;
}

interface SearchParamsState {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  differentDropoff: boolean;
}

const VehiclesPageContent = () => {
  const t = useTranslations("vehicles");
  const tFilters = useTranslations("filters");
  const searchParams = useSearchParams();

  // Extract search parameters from URL
  const initialSearchParams: SearchParamsState = {
    pickupLocation: searchParams.get("pickup") || "",
    dropoffLocation: searchParams.get("dropoff") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    pickupTime: searchParams.get("pickupTime") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    differentDropoff: searchParams.get("differentDropoff") === "true",
  };

  // State management
  const [vehicles, setVehicles] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<VehicleFiltersState>({
    brand: [],
    transmission: [],
    fuelType: [],
    priceRange: [0, 1500],
    seats: [],
    minRating: 0,
  });

  const [searchCriteria, setSearchCriteria] =
    useState<SearchParamsState>(initialSearchParams);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [showResults, setShowResults] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch vehicles from backend
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build API filters
      const apiFilters: CarFilters = {
        page: currentPage,
        limit: showResults,
      };

      // Add filters to API call
      if (filters.brand.length > 0) {
        apiFilters.brand = filters.brand;
      }
      if (filters.transmission.length > 0) {
        apiFilters.transmission = filters.transmission;
      }
      if (filters.fuelType.length > 0) {
        apiFilters.fuelType = filters.fuelType;
      }
      if (filters.seats.length > 0) {
        apiFilters.seats = filters.seats;
      }
      if (filters.priceRange[0] > 0) {
        apiFilters.minPrice = filters.priceRange[0];
      }
      if (filters.priceRange[1] < 1500) {
        apiFilters.maxPrice = filters.priceRange[1];
      }

      // Add sorting
      switch (sortBy) {
        case "price-low":
          apiFilters.sort = "price";
          break;
        case "price-high":
          apiFilters.sort = "-price";
          break;
        case "rating":
          apiFilters.sort = "-rating";
          break;
        case "name":
          apiFilters.sort = "name";
          break;
        default:
          apiFilters.sort = "-rating"; // Default to highest rated
          break;
      }

      console.log("Fetching vehicles with filters:", apiFilters);

      const response = await carService.getCars(apiFilters);

      if (response.success && response.data) {
        setVehicles(response.data);
        setTotal(response.total || response.data.length);
        console.log(`Loaded ${response.data.length} vehicles`);
      } else {
        throw new Error(response.message || "Failed to fetch vehicles");
      }
    } catch (err: any) {
      console.error("Error fetching vehicles:", err);
      setError(err.message || "Failed to fetch vehicles");
      toast.error("Failed to load vehicles. Please try again.");
      setVehicles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, showResults, filters, sortBy]);

  // Fetch vehicles on component mount and when dependencies change
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, sortBy, showResults]);

  // Calculate pagination
  const totalPages = Math.ceil(total / showResults);

  const handleClearFilters = () => {
    setFilters({
      brand: [],
      transmission: [],
      fuelType: [],
      priceRange: [0, 1500],
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

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={fetchVehicles}
              className="bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            totalResults={total}
            onClearFilters={handleClearFilters}
          />
        </AnimatedContainer>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbookers-red-600" />
              <p className="text-gray-600">Loading vehicles...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="mt-8">
            {vehicles.length > 0 ? (
              <>
                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }`}
                >
                  {vehicles.map((vehicle, index) => (
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
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
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
                    Showing {(currentPage - 1) * showResults + 1} to{" "}
                    {Math.min(currentPage * showResults, total)} of {total}{" "}
                    vehicles
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
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleClearFilters}
                      className="bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white"
                    >
                      {tFilters("clearFilters")}
                    </Button>
                    <Button
                      onClick={fetchVehicles}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </AnimatedContainer>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VehiclesPageContent;
