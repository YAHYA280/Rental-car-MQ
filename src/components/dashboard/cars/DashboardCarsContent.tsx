// src/components/dashboard/cars/DashboardCarsContent.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car,
  Users,
  Fuel,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { vehiclesData } from "@/components/data/vehicles";
import AddCarForm from "./AddCarForm";

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
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);

  // Mock data - using existing vehicles data
  const [cars, setCars] = useState<CarData[]>(
    vehiclesData.map((car) => ({
      ...car,
      licensePlate: `${
        Math.floor(Math.random() * 90000) + 10000
      }${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      caution: Math.floor(car.price * 2), // 2x daily rate as caution
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
      car.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "available" && car.available) ||
      (selectedFilter === "rented" && !car.available) ||
      car.fuelType.toLowerCase() === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800">
        {t("cars.statusBadges.available")}
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        {t("cars.statusBadges.rented")}
      </Badge>
    );
  };

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case "electric":
        return "⚡";
      case "hybrid":
        return "🔋";
      default:
        return "⛽";
    }
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter((car) => car.id !== carId));
    setCarToDelete(null);
  };

  const handleViewCarDetails = (car: CarData) => {
    setSelectedCar(car);
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
        lastTechnicalVisit: formData.lastTechnicalVisit,
        lastOilChange: formData.lastOilChange,
        // For now, use a placeholder image. In real implementation,
        // you would upload the file and get back a URL
        image: "/cars/placeholder/photo1.jpg",
      };

      // In a real application, you would:
      // 1. Upload the images to your storage service
      // 2. Get back the URLs
      // 3. Send the car data to your backend API
      // 4. Update the state with the response

      // For now, just add to local state
      setCars((prevCars) => [...prevCars, newCarData]);
      setIsAddCarDialogOpen(false);

      // Show success message (you might want to use a toast library)
      console.log("Car added successfully:", newCarData);
    } catch (error) {
      console.error("Error adding car:", error);
      // Handle error (show error message to user)
    }
  };

  const stats = [
    {
      title: t("stats.totalCars"),
      value: cars.length.toString(),
      icon: Car,
      color: "blue",
    },
    {
      title: t("stats.activeCars"),
      value: cars.filter((car) => car.available).length.toString(),
      icon: Car,
      color: "green",
    },
    {
      title: t("stats.rentedCars"),
      value: cars.filter((car) => !car.available).length.toString(),
      icon: Users,
      color: "red",
    },
    {
      title: t("stats.maintenanceDue"),
      value: "3",
      icon: Settings,
      color: "yellow",
    },
  ];

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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("cars.form.title")}</DialogTitle>
              <DialogDescription>
                {t("cars.form.description")}
              </DialogDescription>
            </DialogHeader>
            <AddCarForm
              onSubmit={handleAddCar}
              onClose={() => setIsAddCarDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="ml-4">
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                {t("cars.allCars")}
              </Button>
              <Button
                variant={selectedFilter === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("available")}
              >
                {t("cars.available")}
              </Button>
              <Button
                variant={selectedFilter === "rented" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("rented")}
              >
                {t("cars.rented")}
              </Button>
            </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("cars.table.car")}</TableHead>
                <TableHead>{t("cars.table.details")}</TableHead>
                <TableHead>{t("cars.table.pricing")}</TableHead>
                <TableHead>{t("cars.table.caution")}</TableHead>
                <TableHead>{t("cars.table.status")}</TableHead>
                <TableHead>{t("cars.table.lastTechnicalVisit")}</TableHead>
                <TableHead>{t("cars.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 relative rounded-lg overflow-hidden">
                        <Image
                          src={car.image}
                          alt={`${car.brand} ${car.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {car.brand} {car.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {car.model} {car.year}
                        </p>
                        <p className="text-xs text-gray-500">
                          {car.licensePlate}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        {car.seats} {t("cars.table.seats")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{getFuelIcon(car.fuelType)}</span>
                        {car.fuelType}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Settings className="h-4 w-4" />
                        {car.transmission}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-900">€{car.price}</p>
                    <p className="text-sm text-gray-600">
                      {t("cars.table.perDay")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-900">
                      €{car.caution}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("cars.table.deposit")}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(car.available)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600">
                      {car.lastTechnicalVisit
                        ? new Date(car.lastTechnicalVisit).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {t("common.actions")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewCarDetails(car)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("cars.actions.viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("cars.actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setCarToDelete(car.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("cars.actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Car Details Modal */}
      <Dialog
        open={selectedCar !== null}
        onOpenChange={() => setSelectedCar(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("cars.details.title")}</DialogTitle>
            <DialogDescription>
              {t("cars.details.description")}
            </DialogDescription>
          </DialogHeader>
          {selectedCar && (
            <div className="space-y-6">
              {/* Car Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedCar.image}
                    alt={`${selectedCar.brand} ${selectedCar.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedCar.brand} {selectedCar.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCar.model} {selectedCar.year}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedCar.licensePlate}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(selectedCar.available)}
                  </div>
                </div>
              </div>

              {/* Car Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("cars.details.basicInfo")}
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.seats")}:
                      </span>{" "}
                      {selectedCar.seats}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.doors")}:
                      </span>{" "}
                      {selectedCar.doors}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.transmission")}:
                      </span>{" "}
                      {selectedCar.transmission}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.fuelType")}:
                      </span>{" "}
                      {selectedCar.fuelType}
                    </p>
                    {selectedCar.mileage && (
                      <p>
                        <span className="text-gray-600">
                          {t("cars.details.mileage")}:
                        </span>{" "}
                        {selectedCar.mileage} km
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("cars.details.pricing")}
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.dailyPrice")}:
                      </span>{" "}
                      €{selectedCar.price}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.caution")}:
                      </span>{" "}
                      €{selectedCar.caution}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("cars.details.maintenance")}
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.lastTechnicalVisit")}:
                      </span>{" "}
                      {selectedCar.lastTechnicalVisit
                        ? new Date(
                            selectedCar.lastTechnicalVisit
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("cars.details.lastOilChange")}:
                      </span>{" "}
                      {selectedCar.lastOilChange
                        ? new Date(
                            selectedCar.lastOilChange
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("cars.details.features")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCar.features && selectedCar.features.length > 0 ? (
                      selectedCar.features.map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {t(`cars.form.features.${feature}`)}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No features listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCar(null)}>
              {t("cars.details.close")}
            </Button>
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700">
              {t("cars.details.edit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={carToDelete !== null}
        onOpenChange={() => setCarToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cars.deleteConfirmation.title")}</DialogTitle>
            <DialogDescription>
              {t("cars.deleteConfirmation.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCarToDelete(null)}>
              {t("cars.deleteConfirmation.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => carToDelete && handleDeleteCar(carToDelete)}
            >
              {t("cars.deleteConfirmation.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCarsContent;
