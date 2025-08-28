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
  DialogTrigger,
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

const DashboardCarsContent = () => {
  const t = useTranslations("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);

  // Mock data - using existing vehicles data
  const [cars, setCars] = useState(vehiclesData);

  // Filter cars based on search and filter criteria
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());

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
        {t("cars.available")}
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">{t("cars.rented")}</Badge>
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
          <DialogTrigger asChild>
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("cars.addNew")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("cars.form.title")}</DialogTitle>
              <DialogDescription>
                {t("cars.form.description")}
              </DialogDescription>
            </DialogHeader>
            <AddCarForm onClose={() => setIsAddCarDialogOpen(false)} />
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
                <TableHead>{t("cars.table.price")}</TableHead>
                <TableHead>{t("cars.table.status")}</TableHead>
                <TableHead>{t("cars.table.bookings")}</TableHead>
                <TableHead>{t("cars.table.rating")}</TableHead>
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
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        {car.seats} seats
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
                  <TableCell>{getStatusBadge(car.available)}</TableCell>
                  <TableCell>
                    <p className="font-medium">{car.bookings || 0}</p>
                    <p className="text-sm text-gray-600">
                      {t("cars.table.total")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{car.rating}</span>
                    </div>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("cars.actions.view")}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={carToDelete !== null}
        onOpenChange={() => setCarToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the car
              from your fleet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCarToDelete(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => carToDelete && handleDeleteCar(carToDelete)}
            >
              {t("common.delete")} Car
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCarsContent;
