// src/components/vehicles/VehicleStatsCard.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CarData } from "@/components/types";

interface VehicleStatsCardProps {
  vehicle: CarData;
}

const VehicleStatsCard: React.FC<VehicleStatsCardProps> = ({ vehicle }) => {
  const tVehicle = useTranslations("vehicleDetail");

  return (
    <Card className="border-0 shadow-xl">
      <CardContent className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">
          {tVehicle("vehicleStats")}
        </h3>
        <div className="space-y-4">
          {vehicle.mileage && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{tVehicle("mileage")}</span>
              <span className="font-semibold">
                {vehicle.mileage.toLocaleString()} km
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{tVehicle("availability")}</span>
            <Badge className="bg-green-100 text-green-800">
              {vehicle.available
                ? tVehicle("available")
                : tVehicle("unavailable")}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{tVehicle("totalBookings")}</span>
            <span className="font-semibold">{vehicle.totalBookings}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">License Plate</span>
            <span className="font-semibold">{vehicle.licensePlate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <Badge className="bg-blue-100 text-blue-800 capitalize">
              {vehicle.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleStatsCard;
