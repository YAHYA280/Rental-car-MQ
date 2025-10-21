// src/components/dashboard/bookings/forms/sections/LocationsSection.tsx - Updated with translations
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Plane,
  Building2,
  Anchor,
  Hotel,
  MapIcon,
  AlertCircle,
} from "lucide-react";
import { FormValidationState } from "@/components/types";

interface LocationsSectionProps {
  pickupLocation: string;
  returnLocation: string;
  onPickupLocationChange: (location: string) => void;
  onReturnLocationChange: (location: string) => void;
  errors: FormValidationState;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
  pickupLocation,
  returnLocation,
  onPickupLocationChange,
  onReturnLocationChange,
  errors,
}) => {
  const t = useTranslations("dashboard");

  // Debug logging
  console.log("LocationsSection:", {
    pickupLocation,
    returnLocation,
    errors,
  });

  // Location options with icons
  const locations = [
    {
      value: "Tangier Airport",
      label: t("bookings.form.locations.tangierAirport"),
      icon: Plane,
      description: t("bookings.form.locations.tangierAirportDesc"),
      popular: true,
    },
    {
      value: "Tangier City Center",
      label: t("bookings.form.locations.tangierCityCenter"),
      icon: Building2,
      description: t("bookings.form.locations.tangierCityCenterDesc"),
      popular: true,
    },
    {
      value: "Tangier Port",
      label: t("bookings.form.locations.tangierPort"),
      icon: Anchor,
      description: t("bookings.form.locations.tangierPortDesc"),
      popular: false,
    },
    {
      value: "Hotel Pickup",
      label: t("bookings.form.locations.hotelPickup"),
      icon: Hotel,
      description: t("bookings.form.locations.hotelPickupDesc"),
      popular: true,
    },
    {
      value: "Custom Location",
      label: t("bookings.form.locations.customLocation"),
      icon: MapIcon,
      description: t("bookings.form.locations.customLocationDesc"),
      popular: false,
    },
  ];

  // Get location details
  const getLocationDetails = (locationValue: string) => {
    return locations.find((loc) => loc.value === locationValue);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t("bookings.form.locations.title")}
        </h3>

        <div className="space-y-4">
          {/* Pickup Location */}
          <div>
            <Label htmlFor="pickupLocation">
              {t("bookings.form.locations.pickupLocation")} *
            </Label>
            <Select
              value={pickupLocation}
              onValueChange={onPickupLocationChange}
            >
              <SelectTrigger
                className={errors.pickupLocation ? "border-red-500" : ""}
              >
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue
                  placeholder={t(
                    "bookings.form.locations.selectPickupLocation"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    <div className="flex items-center gap-3 py-1">
                      <location.icon className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {location.label}
                          </span>
                          {location.popular && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              {t("bookings.form.locations.popular")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {location.description}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pickupLocation && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.pickupLocation}
              </p>
            )}
          </div>
          {/* Quick Action: Same as Pickup */}
          {pickupLocation && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onReturnLocationChange(pickupLocation)}
                className="text-xs"
              >
                {t("bookings.form.locations.useSameLocation")}
              </Button>
            </div>
          )}
          {/* Return Location */}
          <div>
            <Label htmlFor="returnLocation">
              {t("bookings.form.locations.returnLocation")} *
            </Label>
            <Select
              value={returnLocation}
              onValueChange={onReturnLocationChange}
            >
              <SelectTrigger
                className={errors.returnLocation ? "border-red-500" : ""}
              >
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue
                  placeholder={t(
                    "bookings.form.locations.selectReturnLocation"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    <div className="flex items-center gap-3 py-1">
                      <location.icon className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {location.label}
                          </span>
                          {location.popular && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              {t("bookings.form.locations.popular")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {location.description}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.returnLocation && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.returnLocation}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsSection;
