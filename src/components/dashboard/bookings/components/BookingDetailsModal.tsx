// src/components/dashboard/bookings/components/BookingDetailsModal.tsx
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
import { BookingData, BookingActionHandler } from "../types/bookingTypes";

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
    const statusConfig = {
      confirmed: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const statusClass =
      statusConfig[status as keyof typeof statusConfig] ||
      "bg-gray-100 text-gray-800";

    return (
      <div className="flex gap-2">
        <Badge className={statusClass}>{t(`bookings.${status}`)}</Badge>
        {source === "website" && (
          <Badge variant="outline" className="text-xs">
            Website
          </Badge>
        )}
        {source === "admin" && (
          <Badge variant="outline" className="text-xs">
            Admin Created
          </Badge>
        )}
      </div>
    );
  };

  if (!booking) return null;

  return (
    <Dialog open={booking !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("bookings.details.title")}
          </DialogTitle>
          <DialogDescription>
            {t("bookings.details.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Booking ID and Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Booking {booking.id}
              </h3>
              <p className="text-gray-600">
                {t("bookings.details.createdOn")}{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
            {getStatusBadge(booking.status, booking.source)}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("bookings.details.customerInformation")}
              </h4>
              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold">
                    {booking.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Customer ID: {booking.customer.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {booking.customer.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      {booking.customer.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Car className="h-4 w-4" />
                {t("bookings.details.vehicleInformation")}
              </h4>
              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.car.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.car.model} {booking.car.year}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">License Plate:</span>
                    <span className="font-medium">
                      {booking.car.licensePlate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-medium">€{booking.dailyRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rental Days:</span>
                    <span className="font-medium">{booking.days} days</span>
                  </div>
                  {booking.car.whatsappNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">WhatsApp:</span>
                      <a
                        href={`https://wa.me/${booking.car.whatsappNumber?.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-medium"
                      >
                        {booking.car.whatsappNumber}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("bookings.details.rentalPeriod")}
              </h4>
              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pickup</p>
                    <p className="font-medium">
                      {new Date(booking.dates.pickup).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      at {booking.dates.pickupTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Return</p>
                    <p className="font-medium">
                      {new Date(booking.dates.return).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      at {booking.dates.returnTime}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{booking.days} day(s)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("bookings.details.locations")}
              </h4>
              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Pickup Location:
                    </span>
                  </div>
                  <p className="font-medium ml-4">{booking.locations.pickup}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Return Location:
                    </span>
                  </div>
                  <p className="font-medium ml-4">{booking.locations.return}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {booking.notes && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Internal Notes</h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            </div>
          )}

          {/* Total Amount Section */}
          <div className="border-t pt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    {t("bookings.details.totalAmount")}:
                  </span>
                  <p className="text-sm text-gray-600">
                    {booking.days} days × €{booking.dailyRate}
                  </p>
                </div>
                <span className="text-2xl font-bold text-carbookers-red-600">
                  €{booking.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("bookings.details.close")}
          </Button>

          {booking.status === "pending" && onConfirm && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onConfirm(booking.id)}
              disabled={isLoading}
            >
              {isLoading
                ? "Confirming..."
                : t("bookings.details.confirmBooking")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
