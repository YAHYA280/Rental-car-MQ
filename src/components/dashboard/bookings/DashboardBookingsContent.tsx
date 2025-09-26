// src/components/dashboard/bookings/DashboardBookingsContent.tsx - Updated with real backend
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";

// Import booking components
import BookingStatsGrid from "./components/BookingStatsGrid";
import BookingFilters from "./components/BookingFilters";
import BookingsTable from "./components/BookingsTable";
import BookingDetailsModal from "./components/BookingDetailsModal";
import BookingCancelDialog from "./components/BookingCancelDialog";
import AddBookingForm from "./forms/AddBookingForm";

// Import real types and hooks
import {
  BookingData,
  AdminBookingFormData,
  UserData,
  CarData,
} from "@/components/types";
import { useBookings } from "@/hooks/useBookings";
import { useUsers } from "@/hooks/useUsers";
import { useCars } from "@/hooks/useCars";

const DashboardBookingsContent = () => {
  const t = useTranslations("dashboard");

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // Backend hooks
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    stats,
    getBookings,
    createAdminBooking,
    confirmBooking,
    cancelBooking,
    markAsPickedUp,
    completeBooking,
  } = useBookings();

  const {
    users,
    loading: usersLoading,
    getUsers,
  } = useUsers({ status: "active" }); // Only get active users

  const {
    cars,
    loading: carsLoading,
    getCars,
  } = useCars({ status: "active", available: true }); // Only get available cars

  // Load initial data
  useEffect(() => {
    getUsers({ status: "active", limit: 1000 }); // Get all active users
    getCars({ status: "active", available: true, limit: 1000 }); // Get all available cars
  }, []);

  // Filter bookings based on search and filter
  const filteredBookings = React.useMemo(() => {
    let filtered = bookings;

    // Apply status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status === selectedFilter
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((booking) => {
        const customerName = booking.customer
          ? `${booking.customer.firstName} ${booking.customer.lastName}`.toLowerCase()
          : "";
        const vehicleName = booking.vehicle
          ? `${booking.vehicle.brand} ${booking.vehicle.name}`.toLowerCase()
          : "";

        return (
          booking.bookingNumber.toLowerCase().includes(searchLower) ||
          customerName.includes(searchLower) ||
          vehicleName.includes(searchLower) ||
          (booking.customer?.email &&
            booking.customer.email.toLowerCase().includes(searchLower)) ||
          (booking.customer?.phone &&
            booking.customer.phone.includes(searchTerm)) ||
          (booking.vehicle?.licensePlate &&
            booking.vehicle.licensePlate.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [bookings, searchTerm, selectedFilter]);

  // Update filters and reload data
  const handleFilterChange = (newFilter: string) => {
    setSelectedFilter(newFilter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Event handlers
  const handleAddBooking = async (
    formData: AdminBookingFormData
  ): Promise<void> => {
    try {
      const success = await createAdminBooking(formData);
      if (success) {
        setIsAddBookingOpen(false);
        // Data will be refreshed automatically by the hook
      }
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await confirmBooking(bookingId);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId, "Cancelled by admin");
      setBookingToCancel(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handlePickupBooking = async (bookingId: string) => {
    try {
      await markAsPickedUp(bookingId);
    } catch (error) {
      console.error("Error marking booking as picked up:", error);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await completeBooking(bookingId);
    } catch (error) {
      console.error("Error completing booking:", error);
    }
  };

  const handleViewDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
  };

  const handleInitiateCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
  };

  // Loading state
  if (bookingsLoading || usersLoading || carsLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("bookings.title")}
            </h1>
            <p className="text-gray-600">{t("bookings.subtitle")}</p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="h-16 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (bookingsError) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("bookings.title")}
            </h1>
            <p className="text-gray-600">{t("bookings.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Error Loading Bookings
            </h3>
            <p className="text-gray-600">{bookingsError}</p>
            <Button
              onClick={() => getBookings()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("bookings.title")}
          </h1>
          <p className="text-gray-600">{t("bookings.subtitle")}</p>
        </div>

        <Button
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700 flex items-center gap-2"
          onClick={() => setIsAddBookingOpen(true)}
          disabled={bookingsLoading}
        >
          <Plus className="h-4 w-4" />
          Add New Booking
        </Button>
      </div>

      {/* Statistics Grid */}
      <BookingStatsGrid stats={stats} isLoading={bookingsLoading} />

      {/* Search and Filters Section */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("common.searchBookings")}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
                disabled={bookingsLoading}
              />
            </div>

            {/* Filter Buttons */}
            <BookingFilters
              selectedFilter={selectedFilter}
              onFilterChange={handleFilterChange}
              isLoading={bookingsLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>
            {t("overview.recentBookings")} ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BookingsTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onConfirmBooking={handleConfirmBooking}
            onCancelBooking={handleInitiateCancelBooking}
            onPickupBooking={handlePickupBooking}
            onCompleteBooking={handleCompleteBooking}
            isLoading={bookingsLoading}
          />
        </CardContent>
      </Card>

      {/* Add Booking Dialog */}
      <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
        <DialogContent className="w-[min(1400px,95vw)] sm:max-w-[min(1400px,95vw)] max-h-[95vh] ">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              Create a new booking by selecting a customer and vehicle. Admin
              bookings are automatically confirmed.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-1">
            <AddBookingForm
              cars={cars}
              users={users}
              onSubmit={handleAddBooking}
              onClose={() => setIsAddBookingOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onConfirm={handleConfirmBooking}
        isLoading={bookingsLoading}
      />

      {/* Cancel Booking Dialog */}
      <BookingCancelDialog
        bookingId={bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleCancelBooking}
        isLoading={bookingsLoading}
      />
    </div>
  );
};

export default DashboardBookingsContent;
