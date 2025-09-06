// src/components/vehicles/VehicleInfoCard.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Car,
  Fuel,
  MapPin,
  Shield,
  Award,
  Clock,
  CheckCircle,
  Zap,
  Settings,
} from "lucide-react";
import { CarData } from "@/components/types";

interface VehicleInfoCardProps {
  vehicle: CarData;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ vehicle }) => {
  const tVehicle = useTranslations("vehicleDetail");
  const tFilters = useTranslations("filters");

  // Updated to handle backend fuel type format
  const getFuelIcon = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case "electric":
        return <Zap className="h-5 w-5" />;
      default:
        return <Fuel className="h-5 w-5" />;
    }
  };

  // Updated to handle backend transmission format
  const getTransmissionIcon = (transmission: string) => {
    return transmission.toLowerCase() === "manual" ? (
      <Settings className="h-5 w-5" />
    ) : (
      <Car className="h-5 w-5" />
    );
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-carbookers-red-600 text-white font-semibold">
              {vehicle.brand}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{vehicle.rating}</span>
              <span className="text-gray-500 text-sm">
                ({vehicle.totalBookings} {tVehicle("bookings")})
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {vehicle.brand} {vehicle.name}
          </h1>
          <p className="text-lg text-gray-600 mb-2">{vehicle.year}</p>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>Tangier</span> {/* Default location */}
          </div>
        </div>

        {/* Description */}
        {vehicle.description && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {vehicle.description}
            </p>
          </div>
        )}

        {/* Vehicle Specifications */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {tVehicle("specifications")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-carbookers-red-600" />
              <div>
                <div className="text-sm text-gray-600">{tVehicle("seats")}</div>
                <div className="font-semibold">{vehicle.seats}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-carbookers-red-600">
                {getTransmissionIcon(vehicle.transmission)}
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  {tVehicle("transmission")}
                </div>
                <div className="font-semibold">
                  {tFilters(
                    `transmissions.${vehicle.transmission.toLowerCase()}`
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-carbookers-red-600">
                {getFuelIcon(vehicle.fuelType)}
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  {tVehicle("fuelType")}
                </div>
                <div className="font-semibold">
                  {tFilters(`fuelTypes.${vehicle.fuelType.toLowerCase()}`)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Car className="h-5 w-5 text-carbookers-red-600" />
              <div>
                <div className="text-sm text-gray-600">{tVehicle("doors")}</div>
                <div className="font-semibold">{vehicle.doors}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {tVehicle("features")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicle.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  {tFilters(`vehicleFeatures.${feature}`) || feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-900">
                {tVehicle("insured")}
              </div>
              <div className="text-sm text-blue-700">
                {tVehicle("fullyCovered")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Award className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">
                {tVehicle("certified")}
              </div>
              <div className="text-sm text-green-700">
                {tVehicle("qualityGuarantee")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <Clock className="h-6 w-6 text-purple-600" />
            <div>
              <div className="font-semibold text-purple-900">
                {tVehicle("support")}
              </div>
              <div className="text-sm text-purple-700">
                {tVehicle("available247")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;
