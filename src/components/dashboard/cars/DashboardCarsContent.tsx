// src/components/dashboard/cars/DashboardCarsContent.tsx - Clean Version
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
import { carService } from "@/services/carService";
import { Car, CarFilters } from "@/lib/api";
import { CarData, CarFormData } from "../../types/car";
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

  // Transform Car API response to CarData
  const transformToCarData = (car: Car): CarData => {
    return {
      id: car.id,
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      image: car.mainImage?.path || car.image || "/cars/placeholder.jpg",
      mainImage: car.mainImage,
      images: car.images,
      seats: car.seats,
      doors: car.doors,
      transmission: car.transmission,
      fuelType: car.fuelType,
      available: car.available,
      rating: car.rating,
      totalBookings: car.totalBookings || 0,
      mileage: car.mileage,
      features: car.features || [],
      description: car.description,
      licensePlate: car.licensePlate,
      caution: car.caution,
      whatsappNumber: car.whatsappNumber,
      location: car.location,
      status: car.status,
      lastTechnicalVisit: car.lastTechnicalVisit,
      lastOilChange: car.lastOilChange,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
      createdBy: car.createdBy,
    };
  };

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
        const transformedCars = response.data.map(transformToCarData);
        setCars(transformedCars);
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
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const transformFormDataToAPI = (formData: CarFormData) => {
    return {
      ...formData,
      price: formData.dailyPrice,
    };
  };

  const handleAddCar = async (formData: CarFormData): Promise<void> => {
    try {
      const apiData = transformFormDataToAPI(formData);
      const response = await carService.createCar(apiData);

      if (response.success) {
        toast.success("Car created successfully");
        setIsAddCarDialogOpen(false);
        await fetchCars();
      } else {
        toast.error(response.message || "Failed to create car");
        throw new Error(response.message || "Failed to create car");
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

      const apiData = transformFormDataToAPI(formData);
      const response = await carService.updateCar(carToEdit.id, apiData);

      if (response.success) {
        toast.success("Car updated successfully");
        setIsEditCarDialogOpen(false);
        setCarToEdit(null);
        await fetchCars();
      } else {
        toast.error(response.message || "Failed to update car");
        throw new Error(response.message || "Failed to update car");
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
