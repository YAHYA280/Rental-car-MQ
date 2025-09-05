// src/components/dashboard/cars/DashboardCarsContent.tsx - Updated with unified types
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Import unified types from single source
import { CarData, CarFormData, CarFilters } from "@/components/types";
import { carService } from "@/services/carService";

// Import components
import AddCarForm from "./AddCarForm";
import EditCarForm from "./EditCarForm";
import CarStatsGrid from "./components/CarStatsGrid";
import CarFiltersComponent from "./components/CarFilters";
import CarsTable from "./components/CarsTable";
import CarDetailsModal from "./components/CarDetailsModal";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";

const DashboardCarsContent = () => {
  const t = useTranslations("dashboard");

  // State management
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isEditCarDialogOpen, setIsEditCarDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [carToEdit, setCarToEdit] = useState<CarData | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [total, setTotal] = useState(0);

  // Fetch cars from API
  const fetchCars = async (filters: CarFilters = {}) => {
    try {
      setLoading(true);

      const apiFilters: CarFilters = {
        page: 1,
        limit: 25,
        search: searchTerm || undefined,
        ...filters,
      };

      if (selectedFilter !== "all") {
        if (selectedFilter === "available") {
          apiFilters.available = true;
        } else if (selectedFilter === "rented") {
          apiFilters.available = false;
        } else {
          apiFilters.fuelType = selectedFilter;
        }
      }

      const response = await carService.getCars(apiFilters);

      if (response.success && response.data) {
        setCars(response.data);
        setTotal(response.total || 0);
        setPagination(response.pagination);
      } else {
        toast.error("Failed to fetch cars");
        setCars([]);
      }
    } catch (error: any) {
      console.error("Error fetching cars:", error);
      toast.error(error.message || "Failed to fetch cars");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [searchTerm, selectedFilter]);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.whatsappNumber?.includes(searchTerm);

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "available" && car.available) ||
      (selectedFilter === "rented" && !car.available) ||
      car.fuelType.toLowerCase() === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDeleteCar = async (carId: string) => {
    try {
      const response = await carService.deleteCar(carId);

      if (response.success) {
        toast.success("Car deleted successfully");
        setCars(cars.filter((car) => car.id !== carId));
        setCarToDelete(null);
      } else {
        toast.error(response.message || "Failed to delete car");
      }
    } catch (error: any) {
      console.error("Error deleting car:", error);
      toast.error(error.message || "Failed to delete car");
    }
  };

  const handleViewCarDetails = (car: CarData) => {
    setSelectedCar(car);
  };

  const handleEditCar = (car: CarData) => {
    setCarToEdit(car);
    setIsEditCarDialogOpen(true);
  };

  // Transform form data to FormData for API
  const transformFormDataToAPI = (formData: CarFormData) => {
    const apiFormData = new FormData();

    // Add all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "mainImage" || key === "additionalImages") {
        return; // Handle these separately
      }

      if (key === "features" && Array.isArray(value)) {
        value.forEach((feature, index) => {
          apiFormData.append(`features[${index}]`, feature);
        });
      } else if (key === "dailyPrice") {
        // Map dailyPrice to price for backend
        apiFormData.append("price", value.toString());
      } else if (key === "whatsappNumber" && typeof value === "string") {
        // Clean WhatsApp number - remove spaces
        apiFormData.append(key, value.replace(/\s/g, ""));
      } else if (value !== undefined && value !== null && value !== "") {
        apiFormData.append(key, value.toString());
      }
    });

    // Add files properly
    if (formData.mainImage) {
      apiFormData.append("mainImage", formData.mainImage);
    }

    if (formData.additionalImages && formData.additionalImages.length > 0) {
      formData.additionalImages.forEach((file) => {
        apiFormData.append("additionalImages", file);
      });
    }

    return apiFormData;
  };

  const handleAddCar = async (formData: CarFormData): Promise<void> => {
    try {
      console.log("Submitting car data:", formData);

      // Transform to FormData for API
      const apiFormData = transformFormDataToAPI(formData);

      // Use direct fetch with proper headers
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/vehicles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: apiFormData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        if (response.status === 431) {
          throw new Error(
            "Request too large. Please use smaller image files (max 5MB each)."
          );
        }

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(
            errorJson.message || `HTTP error! status: ${response.status}`
          );
        } catch {
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Car created successfully");
        setIsAddCarDialogOpen(false);
        await fetchCars();
      } else {
        throw new Error(result.message || "Failed to create car");
      }
    } catch (error: any) {
      console.error("Error creating car:", error);
      toast.error(error.message || "Failed to create car");
      throw error;
    }
  };

  const handleUpdateCar = async (formData: CarFormData): Promise<void> => {
    try {
      if (!carToEdit) return;

      console.log("Updating car data:", formData);

      // Transform to FormData for API
      const apiFormData = transformFormDataToAPI(formData);

      // Use direct fetch with proper headers
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/vehicles/${carToEdit.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: apiFormData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update API Error Response:", errorText);

        if (response.status === 431) {
          throw new Error(
            "Request too large. Please use smaller image files (max 5MB each)."
          );
        }

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(
            errorJson.message || `HTTP error! status: ${response.status}`
          );
        } catch {
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Car updated successfully");
        setIsEditCarDialogOpen(false);
        setCarToEdit(null);
        await fetchCars();
      } else {
        throw new Error(result.message || "Failed to update car");
      }
    } catch (error: any) {
      console.error("Error updating car:", error);
      toast.error(error.message || "Failed to update car");
      throw error;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("cars.title")}
          </h1>
          <p className="text-gray-600">{t("cars.subtitle")}</p>
        </div>
        <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
          <Button
            className="bg-carbookers-red-600 hover:bg-carbookers-red-700 flex items-center gap-2"
            onClick={() => setIsAddCarDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t("cars.addNew")}
          </Button>
          <DialogContent className="w-[min(1400px,95vw)] sm:max-w-[min(1400px,95vw)] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("cars.form.title")}</DialogTitle>
              <DialogDescription>
                {t("cars.form.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-1">
              <AddCarForm
                onSubmit={handleAddCar}
                onClose={() => setIsAddCarDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <CarStatsGrid cars={cars} />

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("common.searchCars")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <CarFiltersComponent
              selectedFilter={selectedFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("cars.fleetOverview")} ({total || filteredCars.length} cars)
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbookers-red-600" />
                <p className="text-gray-600">Loading cars...</p>
              </div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No cars found</p>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          ) : (
            <CarsTable
              cars={filteredCars}
              onViewDetails={handleViewCarDetails}
              onEditCar={handleEditCar}
              onDeleteCar={setCarToDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Car Details Modal */}
      <CarDetailsModal
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
        onEdit={handleEditCar}
      />

      {/* Edit Car Modal */}
      <Dialog open={isEditCarDialogOpen} onOpenChange={setIsEditCarDialogOpen}>
        <DialogContent className="w-[min(1400px,95vw)] sm:max-w-[min(1400px,95vw)] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
            <DialogDescription>
              Update the vehicle information and details
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-1">
            {carToEdit && (
              <EditCarForm
                car={carToEdit}
                onSubmit={handleUpdateCar}
                onClose={() => {
                  setIsEditCarDialogOpen(false);
                  setCarToEdit(null);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={carToDelete !== null}
        onClose={() => setCarToDelete(null)}
        onConfirm={() => carToDelete && handleDeleteCar(carToDelete)}
      />
    </div>
  );
};

export default DashboardCarsContent;
