// src/components/dashboard/bookings/forms/sections/BookingSummary.tsx - REFACTORED: Show lateness rule breakdown
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  User,
  Car,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Calculator,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
} from "lucide-react";
import { UserData, CarData } from "@/components/types";

interface BookingSummaryProps {
  customer: UserData;
  car: CarData;
  days: number;
  totalAmount: number;
  pickupTime?: string;
  returnTime?: string;
  pickupDate?: string;
  returnDate?: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  customer,
  car,
  days,
  totalAmount,
  pickupTime,
  returnTime,
  pickupDate,
  returnDate,
}) => {
  const t = useTranslations("dashboard");

  const dailyRate = car.price;
  const cautionAmount = Number(car.caution) || 0;

  // --- Calculate Lateness Info ---
  const getLatenessInfo = () => {
    if (!pickupTime || !returnTime || !pickupDate || !returnDate) {
      return null;
    }

    try {
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
      const returnDateTime = new Date(`${returnDate}T${returnTime}:00`);

      const totalMinutes = Math.floor(
        (returnDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60)
      );

      if (totalMinutes < 0) return null;

      const fullDays = Math.floor(totalMinutes / 1440);
      const latenessMinutes = totalMinutes - fullDays * 1440;
      const latenessFeeApplied = latenessMinutes >= 90;

      const latenessHours = Math.floor(latenessMinutes / 60);
      const latenessRemainingMinutes = latenessMinutes % 60;

      return {
        totalMinutes,
        durationHours: (totalMinutes / 60).toFixed(1),
        fullDays,
        latenessMinutes,
        latenessHours,
        latenessRemainingMinutes,
        latenessFeeApplied,
        chargedDays: days,
        isSubDay: totalMinutes < 1440,
      };
    } catch (error) {
      console.error("Error calculating lateness:", error);
      return null;
    }
  };

  const latenessInfo = getLatenessInfo();

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
          <Receipt className="h-5 w-5" />
          {t("bookings.summary.title")}
        </h3>

        <div className="space-y-4">
          {/* --- Customer Summary --- */}
          <div className="bg-white border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-blue-600" />
              {t("bookings.summary.customer")}
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-xs">
                {customer.firstName.charAt(0)}
                {customer.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="text-xs text-gray-500">{customer.email}</p>
                <p className="text-xs text-gray-500">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* --- Vehicle Summary --- */}
          <div className="bg-white border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <Car className="h-4 w-4 text-blue-600" />
              {t("bookings.summary.vehicle")}
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                <Car className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">
                  {car.brand} {car.name}
                </p>
                <p className="text-xs text-gray-500">
                  {car.model} • {car.year} • {car.licensePlate}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">
                    {t("bookings.summary.available")}
                  </Badge>
                  <span className="text-xs text-blue-600 font-medium">
                    €{car.price}/{t("bookings.summary.day")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Duration with Lateness Breakdown --- */}
          {latenessInfo && (
            <div className="bg-white border rounded-lg p-3">
              <div className="space-y-2">
                {/* Full Days */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Full 24h Blocks:
                  </span>
                  <span className="font-medium text-gray-900">
                    {latenessInfo.fullDays} day
                    {latenessInfo.fullDays !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Charged Days */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Charged Days:
                  </span>
                  <span className="font-bold text-xl text-blue-600">
                    {latenessInfo.chargedDays} day
                    {latenessInfo.chargedDays !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Time Details */}
              {pickupTime && returnTime && (
                <div className="text-xs text-gray-600 space-y-1 pt-2 mt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span>Pickup:</span>
                    <span className="font-medium">
                      {pickupDate} at {pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return:</span>
                    <span className="font-medium">
                      {returnDate} at {returnTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- Price Breakdown --- */}
          <div className="bg-gray-50 border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4 text-blue-600" />
              {t("bookings.summary.priceBreakdown")}
            </h4>

            <div className="space-y-2">
              {/* Daily Rate Calculation */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  Rental ({days} day{days !== 1 ? "s" : ""} × €{dailyRate}):
                </span>
                <span className="font-medium">€{totalAmount.toFixed(2)}</span>
              </div>

              {/* Show lateness fee if applied */}
              {latenessInfo?.latenessFeeApplied && (
                <div className="flex justify-between items-center text-sm text-amber-600">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Lateness fee (+1 day):
                  </span>
                  <span className="font-medium">€{dailyRate}</span>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-300 my-2"></div>

              {/* Rental Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  {t("bookings.summary.rentalTotal")}:
                </span>
                <span className="font-bold text-xl text-carbookers-red-600">
                  €{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default BookingSummary;
