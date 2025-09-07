// src/components/vehicles/VehicleStatsCard.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CarData } from "@/components/types";
import { CheckCircle, XCircle, Gauge } from "lucide-react";

interface VehicleStatsCardProps {
  vehicle: CarData;
}

const VehicleStatsCard: React.FC<VehicleStatsCardProps> = ({ vehicle }) => {
  const tVehicle = useTranslations("vehicleDetail");

  return (
    <Card className="border-0 shadow-xl">
      <CardContent className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Vehicle Info
        </h3>

        <div className="space-y-4">
          {/* Availability Status */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              {vehicle.available ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              Availability
            </span>
            <Badge
              className={
                vehicle.available
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {vehicle.available ? "Available" : "Not Available"}
            </Badge>
          </div>

          {/* Mileage (only if available) */}
          {vehicle.mileage && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-600" />
                Mileage
              </span>
              <span className="font-semibold text-gray-900">
                {vehicle.mileage.toLocaleString()} km
              </span>
            </div>
          )}
        </div>

        {/* Additional availability info */}
        {!vehicle.available && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              This vehicle is currently booked or under maintenance
            </p>
          </div>
        )}

        {vehicle.available && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Ready to book for your dates
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleStatsCard;
