// src/components/dashboard/bookings/DashboardBookingsContent.tsx
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

// Import all booking components
import BookingStatsGrid from "./components/BookingStatsGrid";
import BookingFilters from "./components/BookingFilters";
import BookingsTable from "./components/BookingsTable";
import BookingDetailsModal from "./components/BookingDetailsModal";
import BookingCancelDialog from "./components/BookingCancelDialog";
import AddBookingForm from "./forms/AddBookingForm";

// Import types and hooks
import {
  BookingData,
  BookingFormData,
  CarData,
  UserData,
} from "./types/bookingTypes";
import { useBookingManager } from "./hooks/useBookingManager";
import { mockCars, mockUsers, mockBookings } from "./data/mockData";

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

  // Custom hook for booking management
  const {
    bookings,
    filteredBookings,
    addBooking,
    confirmBooking,
    cancelBooking,
    updateFilters,
    getBookingStats,
    isLoading,
    error,
  } = useBookingManager({
    initialBookings: mockBookings,
    searchTerm,
    selectedFilter,
  });

  // Update filters when search term or filter changes
  useEffect(() => {
    updateFilters(searchTerm, selectedFilter);
  }, [searchTerm, selectedFilter, updateFilters]);

  // Event handlers
  const handleAddBooking = async (formData: BookingFormData): Promise<void> => {
    try {
      await addBooking(formData, mockCars, mockUsers);
      setIsAddBookingOpen(false);
    } catch (error) {
      console.error("Error adding booking:", error);
      // You can add toast notification here
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
      await cancelBooking(bookingId);
      setBookingToCancel(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleViewDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
  };

  const handleInitiateCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
  };

  // Get statistics for the stats grid
  const stats = getBookingStats();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-gray-600">{error}</p>
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
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          Add New Booking
        </Button>
      </div>

      {/* Statistics Grid */}
      <BookingStatsGrid stats={stats} isLoading={isLoading} />

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>

            {/* Filter Buttons */}
            <BookingFilters
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              isLoading={isLoading}
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
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Add Booking Dialog */}
      <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
        <DialogContent className="w-[min(1400px,95vw)] sm:max-w-[min(1400px,95vw)] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              Create a new booking by selecting a customer and vehicle. Admin
              bookings are automatically confirmed.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-1">
            <AddBookingForm
              cars={mockCars}
              users={mockUsers}
              existingBookings={bookings}
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
        isLoading={isLoading}
      />

      {/* Cancel Booking Dialog */}
      <BookingCancelDialog
        bookingId={bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleCancelBooking}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardBookingsContent;
