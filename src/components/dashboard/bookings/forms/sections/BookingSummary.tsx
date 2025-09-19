// src/components/dashboard/bookings/forms/sections/BookingSummary.tsx
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
  Star,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
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

  // Debug logging
  console.log("BookingSummary:", {
    customer,
    car,
    days,
    totalAmount,
    pickupTime,
    returnTime,
  });

  // Calculate breakdown
  const dailyRate = car.price;
  const subtotal = dailyRate * days;
  const discount = 0;
  const taxes = Math.round(subtotal * 0.1); // 10% tax example
  const finalTotal = subtotal - discount + taxes;
  const cautionAmount = Number(car.caution) || 0; // FIXED: Convert to number

  // Calculate time excess info
  const getTimeExcessInfo = () => {
    if (!pickupTime || !returnTime) return null;

    const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
    const [returnHour, returnMin] = returnTime.split(":").map(Number);

    const pickupMinutes = pickupHour * 60 + pickupMin;
    const returnMinutes = returnHour * 60 + returnMin;

    const timeDifference = returnMinutes - pickupMinutes;
    const oneHourInMinutes = 60;

    if (timeDifference > oneHourInMinutes) {
      const excessMinutes = timeDifference - oneHourInMinutes;
      const excessHours = Math.floor(excessMinutes / 60);
      const remainingMinutes = excessMinutes % 60;

      return {
        hasExcess: true,
        excessHours,
        excessMinutes: remainingMinutes,
        message: `+1 day added (${excessHours}h ${remainingMinutes}m beyond grace period)`,
      };
    }

    return { hasExcess: false };
  };

  const timeExcessInfo = getTimeExcessInfo();

  // Determine discount eligibility
  const isLongTerm = days >= 7;
  const isVeryLongTerm = days >= 30;

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
          <Receipt className="h-5 w-5" />
          Booking Summary
        </h3>

        <div className="space-y-4">
          {/* Customer Summary */}
          <div className="bg-white border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-blue-600" />
              Customer
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

          {/* Vehicle Summary */}
          <div className="bg-white border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <Car className="h-4 w-4 text-blue-600" />
              Vehicle
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
                    Available
                  </Badge>
                  <span className="text-xs text-blue-600 font-medium">
                    €{car.price}/day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Duration with Time Details */}
          <div className="bg-white border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-600" />
              Rental Duration
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Duration:</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {days} {days === 1 ? "Day" : "Days"}
                  </p>
                  {isLongTerm && (
                    <p className="text-xs text-green-600">
                      {isVeryLongTerm
                        ? "Monthly rate eligible"
                        : "Weekly rate eligible"}
                    </p>
                  )}
                </div>
              </div>

              {/* Time Details */}
              {pickupTime && returnTime && (
                <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span>Pickup Time:</span>
                    <span className="font-medium">{pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Time:</span>
                    <span className="font-medium">{returnTime}</span>
                  </div>
                  {pickupDate && returnDate && (
                    <>
                      <div className="flex justify-between">
                        <span>From:</span>
                        <span className="font-medium">{pickupDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>To:</span>
                        <span className="font-medium">{returnDate}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Time Policy Warning */}
              {timeExcessInfo?.hasExcess && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Time Policy Applied
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    {timeExcessInfo.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4 text-blue-600" />
              Price Breakdown
            </h4>

            <div className="space-y-2">
              {/* Daily Rate */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  Daily rate × {days} {days === 1 ? "day" : "days"}
                </span>
                <span className="font-medium">
                  €{dailyRate} × {days} = €{subtotal}
                </span>
              </div>

              {/* Time excess fee */}
              {timeExcessInfo?.hasExcess && (
                <div className="flex justify-between items-center text-sm text-amber-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Time excess (+1 day)
                  </span>
                  <span>€{dailyRate}</span>
                </div>
              )}

              {/* Discount (if applicable) */}
              {isLongTerm && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>
                    {isVeryLongTerm
                      ? "Monthly discount (15%)"
                      : "Weekly discount (10%)"}
                  </span>
                  <span>
                    -€
                    {isVeryLongTerm
                      ? Math.round(subtotal * 0.15)
                      : Math.round(subtotal * 0.1)}
                  </span>
                </div>
              )}

              {/* Taxes */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Taxes & fees (10%)</span>
                <span>+€{taxes}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 my-2"></div>

              {/* Rental Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Rental Total:
                </span>
                <span className="font-bold text-xl text-carbookers-red-600">
                  €{totalAmount}
                </span>
              </div>

              {/* Security Deposit/Caution - Separate section */}
              <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-amber-900 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Deposit:
                  </span>
                  <span className="font-bold text-xl text-amber-900">
                    €{cautionAmount}
                  </span>
                </div>
                <p className="text-xs text-amber-700">
                  Refundable deposit required at vehicle pickup. Covers
                  potential damages, fuel, and traffic violations.
                </p>
              </div>

              {/* Per day average */}
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                <span>Average per day:</span>
                <span>€{Math.round(totalAmount / days)}/day</span>
              </div>
            </div>
          </div>

          {/* Booking Features */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              Included Features
            </h4>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex items-center gap-2 text-xs text-green-800">
                <CheckCircle className="h-3 w-3" />
                <span>Comprehensive insurance coverage</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-800">
                <CheckCircle className="h-3 w-3" />
                <span>24/7 roadside assistance</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-800">
                <CheckCircle className="h-3 w-3" />
                <span>Fuel top-up service available</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-800">
                <CheckCircle className="h-3 w-3" />
                <span>Free cancellation up to 24h</span>
              </div>
            </div>
          </div>

          {/* Admin Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 text-sm">
                Admin Booking
              </span>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• This booking will be automatically confirmed</li>
              <li>• No payment processing required</li>
              <li>• Customer will be notified via email/WhatsApp</li>
              <li>• Vehicle will be reserved immediately</li>
              <li>• Security deposit must be paid at pickup</li>
            </ul>
          </div>

          {/* Time Policy Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-gray-600" />
              Time Policy
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 1-hour grace period after pickup time</li>
              <li>• Return beyond grace period = additional day charge</li>
              <li>• Business hours: 8:00 AM - 8:30 PM</li>
              <li>• Late returns subject to availability</li>
            </ul>
          </div>

          {/* Action Items */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              Next Steps
            </h4>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Confirm pickup/return locations and times</li>
              <li>• Verify customer driver's license validity</li>
              <li>• Prepare vehicle and documentation</li>
              <li>• Collect security deposit at pickup</li>
              <li>• Send confirmation details to customer</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
