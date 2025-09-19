// src/components/dashboard/cars/components/form/TechnicalSpecsSection.tsx - Complete Enhanced Version
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Settings, Users, Car } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TechnicalSpecsSectionProps {
  formData: {
    transmission: string;
    fuelType: string;
    seats: string;
    doors: string;
    mileage: string;
  };
  errors: Record<string, string>;
  touchedFields?: Set<string>;
  onInputChange: (field: string, value: string) => void;
}

const TechnicalSpecsSection: React.FC<TechnicalSpecsSectionProps> = ({
  formData,
  errors,
  touchedFields = new Set(),
  onInputChange,
}) => {
  const t = useTranslations("dashboard");

  const transmissionTypes = ["manual", "automatic"];
  const fuelTypes = ["petrol", "diesel", "electric", "hybrid"];
  const seatOptions = ["2", "4", "5", "7", "8"];
  const doorOptions = ["2", "3", "4", "5"];

  // Handle mileage input (numbers only with formatting)
  const handleMileageChange = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Limit to reasonable mileage (999,999 km max)
    if (cleaned.length <= 6) {
      onInputChange("mileage", cleaned);
    }
  };

  // Format mileage for display with commas
  const formatMileageDisplay = (value: string) => {
    if (!value) return "";
    return parseInt(value).toLocaleString();
  };

  // Check if field has error and should show it
  const shouldShowError = (field: string) => {
    return errors[field] && touchedFields.has(field);
  };

  // Get error styling
  const getFieldClass = (field: string) => {
    return shouldShowError(field)
      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
      : "";
  };

  // Get fuel type icon
  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case "electric":
        return "⚡";
      case "hybrid":
        return "🔋";
      case "diesel":
        return "⛽";
      case "petrol":
        return "⛽";
      default:
        return "🚗";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t("cars.form.sections.technicalSpecs")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-error="transmission">
            <Label htmlFor="transmission" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              {t("cars.form.transmission")} *
              {shouldShowError("transmission") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>Transmission Error:</strong>
                      <p className="mt-1">{errors.transmission}</p>
                      <p className="mt-2 text-gray-600">
                        Select either Manual or Automatic transmission type
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Select
              value={formData.transmission}
              onValueChange={(value) => onInputChange("transmission", value)}
            >
              <SelectTrigger className={getFieldClass("transmission")}>
                <SelectValue
                  placeholder={t("cars.form.placeholders.selectTransmission")}
                />
              </SelectTrigger>
              <SelectContent>
                {transmissionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t(`cars.form.transmissions.${type}`)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {shouldShowError("transmission") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.transmission}
              </p>
            )}
          </div>

          <div data-error="fuelType">
            <Label htmlFor="fuelType" className="flex items-center gap-2">
              <span>⛽</span>
              {t("cars.form.fuelType")} *
              {shouldShowError("fuelType") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>Fuel Type Error:</strong>
                      <p className="mt-1">{errors.fuelType}</p>
                      <p className="mt-2 text-gray-600">
                        Select the vehicle's fuel type: Petrol, Diesel,
                        Electric, or Hybrid
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Select
              value={formData.fuelType}
              onValueChange={(value) => onInputChange("fuelType", value)}
            >
              <SelectTrigger className={getFieldClass("fuelType")}>
                <SelectValue
                  placeholder={t("cars.form.placeholders.selectFuelType")}
                />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <span>{getFuelIcon(type)}</span>
                      {t(`cars.form.fuelTypes.${type}`)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {shouldShowError("fuelType") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fuelType}
              </p>
            )}
          </div>

          <div data-error="seats">
            <Label htmlFor="seats" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("cars.form.seats")} *
              {shouldShowError("seats") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>Seats Error:</strong>
                      <p className="mt-1">{errors.seats}</p>
                      <p className="mt-2 text-gray-600">
                        Select the number of passenger seats (2-8)
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Select
              value={formData.seats}
              onValueChange={(value) => onInputChange("seats", value)}
            >
              <SelectTrigger className={getFieldClass("seats")}>
                <SelectValue
                  placeholder={t("cars.form.placeholders.selectSeats")}
                />
              </SelectTrigger>
              <SelectContent>
                {seatOptions.map((seats) => (
                  <SelectItem key={seats} value={seats}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {seats} {t("cars.form.seatsLabel")}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {shouldShowError("seats") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.seats}
              </p>
            )}
          </div>

          <div data-error="doors">
            <Label htmlFor="doors" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              {t("cars.form.doors")} *
              {shouldShowError("doors") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>Doors Error:</strong>
                      <p className="mt-1">{errors.doors}</p>
                      <p className="mt-2 text-gray-600">
                        Select the number of doors (2-5)
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Select
              value={formData.doors}
              onValueChange={(value) => onInputChange("doors", value)}
            >
              <SelectTrigger className={getFieldClass("doors")}>
                <SelectValue
                  placeholder={t("cars.form.placeholders.selectDoors")}
                />
              </SelectTrigger>
              <SelectContent>
                {doorOptions.map((doors) => (
                  <SelectItem key={doors} value={doors}>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      {doors} {t("cars.form.doorsLabel")}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {shouldShowError("doors") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.doors}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="mileage" className="flex items-center gap-2">
              <span>🚗</span>
              {t("cars.form.mileage")} (km)
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Optional
              </span>
            </Label>
            <Input
              id="mileage"
              name="mileage"
              type="text"
              value={
                formData.mileage ? formatMileageDisplay(formData.mileage) : ""
              }
              onChange={(e) => handleMileageChange(e.target.value)}
              placeholder="15,000"
              className="text-right"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Optional - Current odometer reading
              </p>
              {formData.mileage && (
                <p className="text-xs text-gray-600">
                  {formatMileageDisplay(formData.mileage)} km
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSpecsSection;
