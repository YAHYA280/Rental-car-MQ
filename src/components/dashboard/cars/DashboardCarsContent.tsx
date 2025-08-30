// src/components/dashboard/cars/DashboardCarsContent.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { vehiclesData } from "@/components/data/vehicles";
import AddCarForm from "./AddCarForm";
import EditCarForm from "./EditCarForm";
import CarStatsGrid from "./components/CarStatsGrid";
import CarFilters from "./components/CarFilters";
import CarsTable from "./components/CarsTable";
import CarDetailsModal from "./components/CarDetailsModal";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";

// Define proper types
interface CarData {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  seats: number;
  doors: number;
  transmission: string;
  fuelType: string;
  available: boolean;
  rating: number;
  bookings?: number;
  mileage?: number;
  features?: string[];
  description?: string;
  licensePlate?: string;
  caution?: number;
  whatsappNumber?: string;
  lastTechnicalVisit?: string;
  lastOilChange?: string;
}

export interface CarFormData {
  // Basic Info
  brand: string;
  name: string;
  model: string;
  year: string;
  licensePlate: string;

  // Technical Specs
  transmission: string;
  fuelType: string;
  seats: string;
  doors: string;
  mileage: string;

  // Pricing
  dailyPrice: string;
  caution: string;

  // Contact Information
  whatsappNumber: string;

  // Maintenance
  lastTechnicalVisit: string;
  lastOilChange: string;

  // Features and Images
  features: string[];
  mainImage?: File;
  additionalImages: File[];

  // Optional fields
  description?: string;
}

const DashboardCarsContent = () => {
  const t = useTranslations("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isEditCarDialogOpen, setIsEditCarDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [carToEdit, setCarToEdit] = useState<CarData | null>(null);

  // Mock data - using existing vehicles data
  const [cars, setCars] = useState<CarData[]>(
    vehiclesData.map((car) => ({
      ...car,
      licensePlate: `${
        Math.floor(Math.random() * 90000) + 10000
      }${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      caution: Math.floor(car.price * 2), // 2x daily rate as caution
      whatsappNumber: `+212${
        Math.floor(Math.random() * 900000000) + 600000000
      }`, // Random Moroccan WhatsApp number
      lastTechnicalVisit: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      lastOilChange: new Date(
        Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      features: ["airConditioning", "bluetooth", "gps", "abs"], // Sample features
    }))
  );

  // Filter cars based on search and filter criteria
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

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter((car) => car.id !== carId));
    setCarToDelete(null);
  };

  const handleViewCarDetails = (car: CarData) => {
    setSelectedCar(car);
  };

  const handleEditCar = (car: CarData) => {
    setCarToEdit(car);
    setIsEditCarDialogOpen(true);
  };

  // Fixed function to handle form submission
  const handleAddCar = async (formData: CarFormData): Promise<void> => {
    try {
      // Convert FormData to CarData
      const newCarData: CarData = {
        id: `car-${Date.now()}`,
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.dailyPrice),
        seats: parseInt(formData.seats),
        doors: parseInt(formData.doors),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        available: true,
        rating: 4.5, // Default rating
        bookings: 0,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        features: formData.features,
        description: formData.description,
        licensePlate: formData.licensePlate,
        caution: parseFloat(formData.caution),
        whatsappNumber: formData.whatsappNumber,
        lastTechnicalVisit: formData.lastTechnicalVisit,
        lastOilChange: formData.lastOilChange,
        // For now, use a placeholder image. In real implementation,
        // you would upload the file and get back a URL
        image: "/cars/placeholder/photo1.jpg",
      };

      setCars((prevCars) => [...prevCars, newCarData]);
      setIsAddCarDialogOpen(false);
      console.log("Car added successfully:", newCarData);
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const handleUpdateCar = async (formData: CarFormData): Promise<void> => {
    try {
      if (!carToEdit) return;

      const updatedCarData: CarData = {
        ...carToEdit,
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.dailyPrice),
        seats: parseInt(formData.seats),
        doors: parseInt(formData.doors),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        features: formData.features,
        description: formData.description,
        licensePlate: formData.licensePlate,
        caution: parseFloat(formData.caution),
        whatsappNumber: formData.whatsappNumber,
        lastTechnicalVisit: formData.lastTechnicalVisit,
        lastOilChange: formData.lastOilChange,
      };

      setCars((prevCars) =>
        prevCars.map((car) => (car.id === carToEdit.id ? updatedCarData : car))
      );

      setIsEditCarDialogOpen(false);
      setCarToEdit(null);
      console.log("Car updated successfully:", updatedCarData);
    } catch (error) {
      console.error("Error updating car:", error);
    }
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <CarFilters
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>
            {t("cars.fleetOverview")} ({filteredCars.length} cars)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CarsTable
            cars={filteredCars}
            onViewDetails={handleViewCarDetails}
            onEditCar={handleEditCar}
            onDeleteCar={setCarToDelete}
          />
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
