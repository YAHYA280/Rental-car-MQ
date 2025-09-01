// src/components/dashboard/bookings/hooks/useBookingManager.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import {
  BookingData,
  BookingFormData,
  BookingStats,
  CarData,
  UserData,
} from "../types/bookingTypes";

interface UseBookingManagerProps {
  initialBookings: BookingData[];
  searchTerm: string;
  selectedFilter: string;
}

interface UseBookingManagerReturn {
  bookings: BookingData[];
  filteredBookings: BookingData[];
  addBooking: (
    formData: BookingFormData,
    cars: CarData[],
    users: UserData[]
  ) => Promise<void>;
  confirmBooking: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  updateFilters: (searchTerm: string, filter: string) => void;
  getBookingStats: () => BookingStats;
  isLoading: boolean;
  error: string | null;
}

export const useBookingManager = ({
  initialBookings,
  searchTerm,
  selectedFilter,
}: UseBookingManagerProps): UseBookingManagerReturn => {
  // State management
  const [bookings, setBookings] = useState<BookingData[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utility function to calculate days
  const calculateDays = (pickupDate: string, returnDate: string): number => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  // Check vehicle availability for given period
  const isVehicleAvailable = useCallback(
    (
      carId: string,
      pickupDate: string,
      returnDate: string,
      excludeBookingId?: string
    ): boolean => {
      const conflictingBookings = bookings.filter(
        (booking) =>
          booking.id !== excludeBookingId &&
          booking.car.id === carId &&
          (booking.status === "confirmed" || booking.status === "active") &&
          !(
            new Date(returnDate) <= new Date(booking.dates.pickup) ||
            new Date(pickupDate) >= new Date(booking.dates.return)
          )
      );
      return conflictingBookings.length === 0;
    },
    [bookings]
  );

  // Add new booking
  const addBooking = useCallback(
    async (
      formData: BookingFormData,
      cars: CarData[],
      users: UserData[]
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Find selected customer and car
        const selectedCustomer = users.find(
          (user) => user.id === formData.customerId
        );
        const selectedCar = cars.find((car) => car.id === formData.carId);

        if (!selectedCustomer) {
          throw new Error("Selected customer not found");
        }

        if (!selectedCar) {
          throw new Error("Selected vehicle not found");
        }

        // Check vehicle availability
        if (
          !isVehicleAvailable(
            formData.carId,
            formData.pickupDate,
            formData.returnDate
          )
        ) {
          throw new Error("Vehicle is not available for the selected dates");
        }

        // Calculate booking details
        const days = calculateDays(formData.pickupDate, formData.returnDate);
        const totalAmount = selectedCar.price * days;

        // Generate new booking ID
        const newBookingId = `BK${String(bookings.length + 1).padStart(
          3,
          "0"
        )}`;

        // Create new booking
        const newBooking: BookingData = {
          id: newBookingId,
          customer: {
            id: selectedCustomer.id,
            name: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
            email: selectedCustomer.email,
            phone: selectedCustomer.phone,
          },
          car: {
            id: selectedCar.id,
            name: `${selectedCar.brand} ${selectedCar.name}`,
            brand: selectedCar.brand,
            model: selectedCar.model || selectedCar.name,
            year: selectedCar.year || 2024,
            image: "/cars/placeholder/photo1.jpg",
            whatsappNumber: selectedCar.whatsappNumber,
            licensePlate: selectedCar.licensePlate,
          },
          dates: {
            pickup: formData.pickupDate,
            return: formData.returnDate,
            pickupTime: formData.pickupTime,
            returnTime: formData.returnTime,
          },
          locations: {
            pickup: formData.pickupLocation,
            return: formData.returnLocation,
          },
          status: "confirmed", // Admin bookings are automatically confirmed
          totalAmount,
          dailyRate: selectedCar.price,
          days,
          createdAt: new Date().toISOString(),
          source: "admin",
          notes: formData.notes,
        };

        // Add to bookings list
        setBookings((prev) => [...prev, newBooking]);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create booking";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [bookings.length, isVehicleAvailable]
  );

  // Confirm booking
  const confirmBooking = useCallback(
    async (bookingId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
        if (bookingIndex === -1) {
          throw new Error("Booking not found");
        }

        const booking = bookings[bookingIndex];
        if (booking.status !== "pending") {
          throw new Error("Only pending bookings can be confirmed");
        }

        // Check if vehicle is still available
        if (
          !isVehicleAvailable(
            booking.car.id,
            booking.dates.pickup,
            booking.dates.return,
            bookingId
          )
        ) {
          throw new Error(
            "Vehicle is no longer available for the selected dates"
          );
        }

        // Update booking status
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "confirmed" as const } : b
          )
        );

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to confirm booking";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [bookings, isVehicleAvailable]
  );

  // Cancel booking
  const cancelBooking = useCallback(
    async (bookingId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
        if (bookingIndex === -1) {
          throw new Error("Booking not found");
        }

        const booking = bookings[bookingIndex];
        if (booking.status === "cancelled" || booking.status === "completed") {
          throw new Error("Booking cannot be cancelled");
        }

        // Update booking status
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" as const } : b
          )
        );

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to cancel booking";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [bookings]
  );

  // Update filters (placeholder for future use)
  const updateFilters = useCallback(
    (newSearchTerm: string, newFilter: string) => {
      // This function is called when filters change
      // Can be used for additional filter logic or API calls
      console.log("Filters updated:", {
        searchTerm: newSearchTerm,
        filter: newFilter,
      });
    },
    []
  );

  // Filter bookings based on search term and filter
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        booking.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.customer.phone.includes(searchTerm) ||
        booking.car.whatsappNumber?.includes(searchTerm) ||
        booking.car.licensePlate
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Status filter
      const matchesFilter =
        selectedFilter === "all" || booking.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, selectedFilter]);

  // Get booking statistics
  const getBookingStats = useCallback((): BookingStats => {
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter((b) => b.status === "active").length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    // Calculate monthly revenue from confirmed/active/completed bookings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = bookings
      .filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear &&
          (booking.status === "confirmed" ||
            booking.status === "active" ||
            booking.status === "completed")
        );
      })
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    return {
      totalBookings,
      activeBookings,
      pendingBookings,
      monthlyRevenue,
    };
  }, [bookings]);

  return {
    bookings,
    filteredBookings,
    addBooking,
    confirmBooking,
    cancelBooking,
    updateFilters,
    getBookingStats,
    isLoading,
    error,
  };
};
