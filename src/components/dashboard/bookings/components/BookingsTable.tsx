// src/components/dashboard/bookings/components/BookingsTable.tsx - Updated with Contract Download
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
  Truck,
  CheckCircle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import {
  BookingData,
  getStatusColor,
  formatBookingStatus,
} from "@/components/types";

// Import the ContractDownload component
import ContractDownload from "../ContractDownload";

interface BookingsTableProps {
  bookings: BookingData[];
  onViewDetails: (booking: BookingData) => void;
  onConfirmBooking: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onPickupBooking?: (bookingId: string) => void;
  onCompleteBooking?: (bookingId: string) => void;
  isLoading?: boolean;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  onViewDetails,
  onConfirmBooking,
  onCancelBooking,
  onPickupBooking,
  onCompleteBooking,
  isLoading = false,
}) => {
  const t = useTranslations("dashboard");

  const getStatusBadge = (status: string, source: string) => {
    const statusClass = getStatusColor(status);
    const statusText = formatBookingStatus(status);

    return (
      <div className="flex flex-col gap-1">
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
            Admin
          </Badge>
        )}
      </div>
    );
  };

  const formatCustomerName = (booking: BookingData) => {
    if (booking.customer) {
      return `${booking.customer.firstName} ${booking.customer.lastName}`;
    }
    return "Unknown Customer";
  };

  const formatVehicleName = (booking: BookingData) => {
    if (booking.vehicle) {
      return `${booking.vehicle.brand} ${booking.vehicle.name}`;
    }
    return "Unknown Vehicle";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getWhatsAppNumber = (booking: BookingData) => {
    return booking.vehicle?.whatsappNumber || "+212612077309";
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
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
            <TableHead>Booking</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>WhatsApp Contact</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Locations</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contract</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Booking Number and Date */}
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">
                    {booking.bookingNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(booking.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.totalDays} day{booking.totalDays > 1 ? "s" : ""}
                  </p>
                </div>
              </TableCell>

              {/* Customer Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-sm">
                    {booking.customer?.firstName?.charAt(0) || "?"}
                    {booking.customer?.lastName?.charAt(0) || ""}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCustomerName(booking)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.customer?.phone || "No phone"}
                    </p>
                    {booking.customer?.email && (
                      <p className="text-xs text-gray-500 truncate max-w-32">
                        {booking.customer.email}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Vehicle Info */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatVehicleName(booking)}
                    </p>
                    <p className="text-sm text-gray-600">
                      €{booking.dailyRate}/day
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.vehicle?.licensePlate || "No plate"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* WhatsApp Contact */}
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`https://wa.me/${getWhatsAppNumber(booking).replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {getWhatsAppNumber(booking)}
                  </a>
                </div>
              </TableCell>

              {/* Dates */}
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-green-600" />
                    <span className="text-green-700 font-medium">
                      {formatDate(booking.pickupDate)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {booking.pickupTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-red-600" />
                    <span className="text-red-700 font-medium">
                      {formatDate(booking.returnDate)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {booking.returnTime}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Locations */}
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <MapPin className="h-3 w-3 text-green-600" />
                    <span className="truncate max-w-24">
                      {booking.pickupLocation}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-3 w-3 text-red-600" />
                    <span className="truncate max-w-24">
                      {booking.returnLocation}
                    </span>
                  </div>
                  {booking.pickupLocation !== booking.returnLocation && (
                    <p className="text-xs text-amber-600 mt-1">
                      Different locations
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">
                    €{booking.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    €{booking.dailyRate}/day
                  </p>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                {getStatusBadge(booking.status, booking.source)}
              </TableCell>

              {/* Contract Download Column - NEW */}
              <TableCell>
                <ContractDownload
                  bookingId={booking.id}
                  bookingNumber={booking.bookingNumber}
                  status={booking.status}
                />
              </TableCell>

              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* View Details - Always available */}
                    <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>

                    {/* Confirm Booking - Only for pending bookings */}
                    {booking.status === "pending" && (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => onConfirmBooking(booking.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Confirm Booking
                      </DropdownMenuItem>
                    )}

                    {/* Mark as Picked Up - Only for confirmed bookings */}
                    {booking.status === "confirmed" && onPickupBooking && (
                      <DropdownMenuItem
                        className="text-blue-600"
                        onClick={() => onPickupBooking(booking.id)}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Mark as Picked Up
                      </DropdownMenuItem>
                    )}

                    {/* Complete Booking - Only for active bookings */}
                    {booking.status === "active" && onCompleteBooking && (
                      <DropdownMenuItem
                        className="text-purple-600"
                        onClick={() => onCompleteBooking(booking.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Booking
                      </DropdownMenuItem>
                    )}

                    {/* Cancel Booking - For pending and confirmed bookings */}
                    {(booking.status === "pending" ||
                      booking.status === "confirmed") && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onCancelBooking(booking.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Download Contract - For confirmed/active bookings */}
                    {(booking.status === "confirmed" ||
                      booking.status === "active" ||
                      booking.status === "completed") && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <a
                            href={`${
                              process.env.NEXT_PUBLIC_API_URL ||
                              "http://localhost:5000/api"
                            }/bookings/${booking.id}/contract`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Download Contract
                          </a>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Contact Customer via WhatsApp */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://wa.me/${booking.customer?.phone?.replace(
                          /[^0-9]/g,
                          ""
                        )}?text=Hello ${formatCustomerName(
                          booking
                        )}, regarding your booking ${booking.bookingNumber}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Contact Customer
                      </a>
                    </DropdownMenuItem>
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
