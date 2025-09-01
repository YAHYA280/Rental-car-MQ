// src/components/dashboard/bookings/forms/sections/VehicleSelectionSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Users, Calendar, Phone, CreditCard } from "lucide-react";
import { CarData } from "../../types/bookingTypes";

interface VehicleSelectionSectionProps {
  cars: CarData[];
  selectedCarId: string;
  selectedCar: CarData | undefined;
  onCarChange: (carId: string) => void;
  error?: string;
}

const VehicleSelectionSection: React.FC<VehicleSelectionSectionProps> = ({
  cars,
  selectedCarId,
  selectedCar,
  onCarChange,
  error,
}) => {
  const t = useTranslations("dashboard");

  // Debug logging
  console.log("VehicleSelectionSection:", {
    carsCount: cars.length,
    selectedCarId,
    selectedCar,
    error,
  });

  // Get transmission icon
  const getTransmissionIcon = (transmission: string) => {
    return transmission === "Automatic" ? "🔄" : "⚙️";
  };

  // Get fuel type icon
  const getFuelIcon = (fuelType: string) => {
    switch (fuelType?.toLowerCase()) {
      case "electric":
        return "⚡";
      case "hybrid":
        return "🔋";
      default:
        return "⛽";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Selection
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="carId">Select Vehicle *</Label>
            <Select value={selectedCarId} onValueChange={onCarChange}>
              <SelectTrigger className={error ? "border-red-500" : ""}>
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                        <Car className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {car.brand} {car.name}
                          </p>
                          {car.available && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">
                              Available
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>€{car.price}/day</span>
                          <span>•</span>
                          <span>{car.licensePlate}</span>
                          <span>•</span>
                          <span>{car.year}</span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Show selected vehicle details */}
          {selectedCar && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Car className="h-4 w-4" />
                Selected Vehicle Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Vehicle:</span>
                    <span className="font-semibold text-blue-900">
                      {selectedCar.brand} {selectedCar.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Model:</span>
                    <span className="font-medium text-blue-800">
                      {selectedCar.model} ({selectedCar.year})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">
                      License Plate:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-blue-800 border-blue-300"
                    >
                      {selectedCar.licensePlate}
                    </Badge>
                  </div>
                </div>

                {/* Pricing & Contact */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Daily Rate:
                    </span>
                    <span className="font-bold text-blue-900">
                      €{selectedCar.price}/day
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Status:</span>
                    <Badge
                      className={
                        selectedCar.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedCar.available ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  {selectedCar.whatsappNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        WhatsApp:
                      </span>
                      <a
                        href={`https://wa.me/${selectedCar.whatsappNumber.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline text-sm font-medium"
                      >
                        {selectedCar.whatsappNumber}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Features */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-blue-700">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Vehicle Type
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-800">
                    <span>{getTransmissionIcon("Automatic")} Auto</span>
                    <span>{getFuelIcon("petrol")} Petrol</span>
                    <span>👥 5 seats</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available vehicles count */}
          {cars.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Car className="h-3 w-3" />
              {cars.length} vehicle{cars.length !== 1 ? "s" : ""} available for
              selection
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSelectionSection;
