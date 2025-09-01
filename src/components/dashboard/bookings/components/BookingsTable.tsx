// src/components/dashboard/bookings/components/BookingsTable.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Check,
  X,
  Car,
  Phone,
  MapPin,
} from "lucide-react";
import {
  BookingData,
  BookingActionHandler,
  BookingSelectHandler,
} from "../types/bookingTypes";

interface BookingsTableProps {
  bookings: BookingData[];
  onViewDetails: BookingSelectHandler;
  onConfirmBooking: BookingActionHandler;
  onCancelBooking: BookingActionHandler;
  isLoading?: boolean;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  onViewDetails,
  onConfirmBooking,
  onCancelBooking,
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
      <div className="flex flex-col gap-1">
        <Badge className={statusClass}>{t(`bookings.${status}`)}</Badge>
        {source === "website" && (
          <Badge variant="outline" className="text-xs">
            Website
          </Badge>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No bookings found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("bookings.table.booking")}</TableHead>
            <TableHead>{t("bookings.table.customer")}</TableHead>
            <TableHead>{t("bookings.table.car")}</TableHead>
            <TableHead>WhatsApp Contact</TableHead>
            <TableHead>{t("bookings.table.dates")}</TableHead>
            <TableHead>{t("bookings.table.locations")}</TableHead>
            <TableHead>{t("bookings.table.amount")}</TableHead>
            <TableHead>{t("bookings.table.status")}</TableHead>
            <TableHead>{t("bookings.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Booking ID and Date */}
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">{booking.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  {booking.source === "admin" && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Admin Created
                    </Badge>
                  )}
                </div>
              </TableCell>

              {/* Customer Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-sm">
                    {booking.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.customer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.customer.phone}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Car Info */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.car.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      €{booking.dailyRate}/day • {booking.car.licensePlate}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* WhatsApp Contact */}
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`https://wa.me/${booking.car.whatsappNumber?.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {booking.car.whatsappNumber}
                  </a>
                </div>
              </TableCell>

              {/* Dates */}
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">
                    {new Date(booking.dates.pickup).toLocaleDateString()} -
                    {new Date(booking.dates.return).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    {booking.dates.pickupTime} - {booking.dates.returnTime}
                  </p>
                  <p className="text-gray-500">
                    {booking.days} {t("bookings.table.days")}
                  </p>
                </div>
              </TableCell>

              {/* Locations */}
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-24">
                      {booking.locations.pickup}
                    </span>
                  </div>
                  {booking.locations.pickup !== booking.locations.return && (
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-24">
                        {booking.locations.return}
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell>
                <p className="font-semibold text-gray-900">
                  €{booking.totalAmount.toLocaleString()}
                </p>
              </TableCell>

              {/* Status */}
              <TableCell>
                {getStatusBadge(booking.status, booking.source)}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("bookings.actions.viewDetails")}
                    </DropdownMenuItem>

                    {booking.status === "pending" && (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => onConfirmBooking(booking.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        {t("bookings.actions.confirmBooking")}
                      </DropdownMenuItem>
                    )}

                    {booking.status !== "cancelled" &&
                      booking.status !== "completed" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onCancelBooking(booking.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            {t("bookings.actions.cancelBooking")}
                          </DropdownMenuItem>
                        </>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
