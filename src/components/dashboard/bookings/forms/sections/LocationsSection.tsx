// src/components/dashboard/bookings/forms/sections/LocationsSection.tsx
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
  ArrowRight,
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
      label: "Tangier Airport",
      icon: Plane,
      description: "Ibn Battuta Airport (TNG)",
      popular: true,
    },
    {
      value: "Tangier City Center",
      label: "Tangier City Center",
      icon: Building2,
      description: "Downtown area",
      popular: true,
    },
    {
      value: "Tangier Port",
      label: "Tangier Port",
      icon: Anchor,
      description: "Ferry terminal",
      popular: false,
    },
    {
      value: "Hotel Pickup",
      label: "Hotel Pickup",
      icon: Hotel,
      description: "At your accommodation",
      popular: true,
    },
    {
      value: "Custom Location",
      label: "Custom Location",
      icon: MapIcon,
      description: "Specify during booking",
      popular: false,
    },
  ];

  // Get location details
  const getLocationDetails = (locationValue: string) => {
    return locations.find((loc) => loc.value === locationValue);
  };

  const pickupDetails = getLocationDetails(pickupLocation);
  const returnDetails = getLocationDetails(returnLocation);

  // Check if different locations
  const isDifferentLocation =
    pickupLocation && returnLocation && pickupLocation !== returnLocation;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Pickup & Return Locations
        </h3>

        <div className="space-y-4">
          {/* Pickup Location */}
          <div>
            <Label htmlFor="pickupLocation">Pickup Location *</Label>
            <Select
              value={pickupLocation}
              onValueChange={onPickupLocationChange}
            >
              <SelectTrigger
                className={errors.pickupLocation ? "border-red-500" : ""}
              >
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select pickup location" />
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
                              Popular
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
                Use same location for return
              </Button>
            </div>
          )}

          {/* Return Location */}
          <div>
            <Label htmlFor="returnLocation">Return Location *</Label>
            <Select
              value={returnLocation}
              onValueChange={onReturnLocationChange}
            >
              <SelectTrigger
                className={errors.returnLocation ? "border-red-500" : ""}
              >
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select return location" />
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
                              Popular
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
