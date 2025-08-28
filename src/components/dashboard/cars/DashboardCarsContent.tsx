"use client";

import React, { useState } from "react";
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
      <Badge className="bg-green-100 text-green-800">Available</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Rented</Badge>
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
      title: "Total Cars",
      value: cars.length.toString(),
      icon: Car,
      color: "blue",
    },
    {
      title: "Available",
      value: cars.filter((car) => car.available).length.toString(),
      icon: Car,
      color: "green",
    },
    {
      title: "Currently Rented",
      value: cars.filter((car) => !car.available).length.toString(),
      icon: Users,
      color: "red",
    },
    {
      title: "Maintenance Due",
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
          <h1 className="text-3xl font-bold text-gray-900">Cars Management</h1>
          <p className="text-gray-600">
            Manage your rental fleet and vehicle information
          </p>
        </div>
        <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Car
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
              <DialogDescription>
                Add a new vehicle to your rental fleet. Fill in all the required
                information.
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
                placeholder="Search cars by name, brand, or model..."
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
                All Cars
              </Button>
              <Button
                variant={selectedFilter === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("available")}
              >
                Available
              </Button>
              <Button
                variant={selectedFilter === "rented" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("rented")}
              >
                Rented
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Fleet Overview ({filteredCars.length} cars)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
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
                    <p className="text-sm text-gray-600">per day</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(car.available)}</TableCell>
                  <TableCell>
                    <p className="font-medium">{car.bookings || 0}</p>
                    <p className="text-sm text-gray-600">total</p>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Car
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setCarToDelete(car.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Car
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => carToDelete && handleDeleteCar(carToDelete)}
            >
              Delete Car
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCarsContent;
