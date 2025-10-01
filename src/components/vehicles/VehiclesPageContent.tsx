// src/components/vehicles/VehiclesPageContent.tsx - Fixed to match VehicleFilters interface
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
import { CarData, CarFilters } from "@/components/types";
import { carService } from "@/services/carService";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

// FIXED: Interface to match VehicleFilters expected props
interface VehicleFiltersState {
  brand?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: string;
  available?: boolean;
  search?: string;
}

interface SearchParamsState {
  pickup?: string;
  dropoff?: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  differentDropoff?: boolean;
  driverAge?: string;
}

const VehiclesPageContent = () => {
  const t = useTranslations("vehicles");
  const tFilters = useTranslations("filters");
  const searchParams = useSearchParams();

  // Extract search parameters from URL
  const initialSearchParams: SearchParamsState = {
    pickup: searchParams.get("pickup") || "",
    dropoff: searchParams.get("dropoff") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    pickupTime: searchParams.get("pickupTime") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    differentDropoff: searchParams.get("differentDropoff") === "true",
    driverAge: searchParams.get("driverAge") || "",
  };

  // State management
  const [vehicles, setVehicles] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<any>(null);

  // FIXED: Updated filters state to match VehicleFilters interface
  const [filters, setFilters] = useState<VehicleFiltersState>({});

  const [searchCriteria, setSearchCriteria] =
    useState<SearchParamsState>(initialSearchParams);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showResults, setShowResults] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Parse initial filters from URL
  useEffect(() => {
    const urlFilters: VehicleFiltersState = {};

    if (searchParams.get("brand"))
      urlFilters.brand = searchParams.get("brand") || undefined;
    if (searchParams.get("transmission"))
      urlFilters.transmission = searchParams.get("transmission") || undefined;
    if (searchParams.get("fuelType"))
      urlFilters.fuelType = searchParams.get("fuelType") || undefined;
    if (searchParams.get("seats"))
      urlFilters.seats = searchParams.get("seats") || undefined; // Keep as string for frontend
    if (searchParams.get("minPrice"))
      urlFilters.minPrice =
        parseInt(searchParams.get("minPrice")!) || undefined;
    if (searchParams.get("maxPrice"))
      urlFilters.maxPrice =
        parseInt(searchParams.get("maxPrice")!) || undefined;
    if (searchParams.get("available"))
      urlFilters.available = searchParams.get("available") === "true";
    if (searchParams.get("search"))
      urlFilters.search = searchParams.get("search") || undefined;

    setFilters(urlFilters);

    // Set other URL parameters
    if (searchParams.get("sort")) setSortBy(searchParams.get("sort")!);
    if (searchParams.get("limit"))
      setShowResults(parseInt(searchParams.get("limit")!) || 12);
    if (searchParams.get("page"))
      setCurrentPage(parseInt(searchParams.get("page")!) || 1);
  }, [searchParams]);

  // Fetch vehicles from backend
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build API filters
      const apiFilters: CarFilters = {
        page: currentPage,
        limit: showResults,
        sort: sortBy,
      };

      // Add filters to API call - now properly matching the interface
      if (filters.brand) apiFilters.brand = filters.brand;
      if (filters.transmission) apiFilters.transmission = filters.transmission;
      if (filters.fuelType) apiFilters.fuelType = filters.fuelType;
      if (filters.seats) apiFilters.seats = parseInt(filters.seats); // Convert string to number
      if (filters.minPrice !== undefined)
        apiFilters.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined)
        apiFilters.maxPrice = filters.maxPrice;
      if (filters.available !== undefined)
        apiFilters.available = filters.available;
      if (filters.search) apiFilters.search = filters.search;

      console.log("Fetching vehicles with filters:", apiFilters);

      const response = await carService.getCars(apiFilters);

      if (response.success && response.data) {
        setVehicles(response.data);
        setTotal(response.total || response.data.length);
        setPagination(response.pagination || null);
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

  // FIXED: Clear filters function to match new interface
  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
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

  // FIXED: Handle filters change to match VehicleFilters interface
  const handleFiltersChange = (newFilters: VehicleFiltersState) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search params change
  const handleSearchParamsChange = (newParams: SearchParamsState) => {
    console.log("Search params changed:", newParams);
    setSearchCriteria(newParams);
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

        {/* Filters - FIXED: Now matches VehicleFilters interface */}
        <AnimatedContainer direction="down" delay={0.2}>
          <VehicleFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            searchParams={searchCriteria}
            onSearchParamsChange={handleSearchParamsChange}
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
