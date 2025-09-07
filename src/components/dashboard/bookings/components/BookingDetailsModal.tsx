// src/components/dashboard/bookings/components/BookingDetailsModal.tsx - Updated with real backend data
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, Calendar, MapPin, Car, User } from "lucide-react";
import {
  BookingData,
  BookingActionHandler,
  formatBookingStatus,
  getStatusColor,
} from "@/components/types";

interface BookingDetailsModalProps {
  booking: BookingData | null;
  onClose: () => void;
  onConfirm?: BookingActionHandler;
  isLoading?: boolean;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const t = useTranslations("dashboard");

  const getStatusBadge = (status: string, source: string) => {
    const statusClass = getStatusColor(status);
    const statusText = formatBookingStatus(status);

    return (
      <div className="flex gap-2 flex-wrap">
        <Badge className={statusClass}>{statusText}</Badge>
        {source === "website" && (
          <Badge variant="outline" className="text-xs">
            Website
          </Badge>
        )}
        {source === "admin" && (
          <Badge
            variant="outline"
            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
          >
            Admin Created
          </Badge>
        )}
      </div>
    );
  };

  // Format customer name
  const getCustomerName = (booking: BookingData): string => {
    if (booking.customer) {
      return `${booking.customer.firstName} ${booking.customer.lastName}`;
    }
    return "Unknown Customer";
  };

  // Format vehicle name
  const getVehicleName = (booking: BookingData): string => {
    if (booking.vehicle) {
      return `${booking.vehicle.brand} ${booking.vehicle.name}`;
    }
    return "Unknown Vehicle";
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!booking) return null;

  return (
    <Dialog open={booking !== null} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-16px)] max-w-4xl h-[calc(100vh-32px)] max-h-[90vh] sm:w-[min(900px,95vw)] sm:max-w-[min(1200px,95vw)] sm:h-auto flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Booking Details
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            View complete booking information and manage booking status
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4 sm:space-y-6 py-4">
            {/* Header with Booking ID and Status */}
            <div className="flex flex-col items-start justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Booking {booking.bookingNumber}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Created on {formatDate(booking.createdAt)}
                </p>
              </div>
              {getStatusBadge(booking.status, booking.source)}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Customer Information */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Customer Information
                </h4>
                <div className="bg-white border-2 rounded-xl p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                      {booking.customer?.firstName?.charAt(0) || "?"}
                      {booking.customer?.lastName?.charAt(0) || ""}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">
                        {getCustomerName(booking)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Customer ID: {booking.customerId}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {booking.customer?.email && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm text-gray-600 block">
                            Email:
                          </span>
                          <span className="font-medium text-gray-900 break-all text-sm sm:text-base">
                            {booking.customer.email}
                          </span>
                        </div>
                      </div>
                    )}
                    {booking.customer?.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm text-gray-600 block">
                            Phone:
                          </span>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">
                            {booking.customer.phone}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                  Vehicle Information
                </h4>
                <div className="bg-white border-2 rounded-xl p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Car className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">
                        {getVehicleName(booking)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {booking.vehicle?.year || "Unknown Year"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs sm:text-sm text-gray-600 block">
                        License Plate:
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {booking.vehicle?.licensePlate || "N/A"}
                      </span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs sm:text-sm text-gray-600 block">
                        Daily Rate:
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        €{booking.dailyRate}
                      </span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs sm:text-sm text-gray-600 block">
                        Rental Days:
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {booking.totalDays} days
                      </span>
                    </div>
                    {booking.vehicle?.whatsappNumber && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <span className="text-xs sm:text-sm text-gray-600 block">
                          WhatsApp:
                        </span>
                        <a
                          href={`https://wa.me/${booking.vehicle.whatsappNumber.replace(
                            /[^0-9]/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base"
                        >
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                          {booking.vehicle.whatsappNumber}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Rental Period
                </h4>
                <div className="bg-white border-2 rounded-xl p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs sm:text-sm font-medium text-green-800">
                          Pickup
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        {formatDate(booking.pickupDate)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        at {booking.pickupTime}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs sm:text-sm font-medium text-red-800">
                          Return
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        {formatDate(booking.returnDate)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        at {booking.returnTime}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base">
                        Total Duration:
                      </span>
                      <span className="font-bold text-lg sm:text-xl text-blue-600">
                        {booking.totalDays} day(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  Locations
                </h4>
                <div className="bg-white border-2 rounded-xl p-4 sm:p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs sm:text-sm font-medium text-green-800">
                          Pickup Location
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {booking.pickupLocation}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs sm:text-sm font-medium text-red-800">
                          Return Location
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {booking.returnLocation}
                      </p>
                    </div>
                  </div>

                  {booking.pickupLocation !== booking.returnLocation && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs sm:text-sm text-amber-800 font-medium">
                        ⚠ Different pickup and return locations
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Amount Section */}
            <div className="border-t-2 pt-4 sm:pt-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
                  <div>
                    <span className="text-lg sm:text-xl font-semibold text-gray-900 block">
                      Total Amount
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {booking.totalDays} days × €{booking.dailyRate} per day
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl sm:text-4xl font-bold text-carbookers-red-600 block">
                      €{booking.totalAmount.toLocaleString()}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-500">
                      (€{Math.round(booking.totalAmount / booking.totalDays)}
                      /day avg)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t gap-3 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Close
          </Button>

          {booking.status === "pending" && onConfirm && (
            <Button
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              onClick={() => onConfirm(booking.id)}
              disabled={isLoading}
            >
              {isLoading ? "Confirming..." : "Confirm Booking"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
