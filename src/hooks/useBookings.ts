// src/hooks/useBookings.ts - Booking Management Hook
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  bookingService,
  BookingData,
  AdminBookingFormData,
  WebsiteBookingFormData,
  BookingFilters,
} from "@/services/bookingService";
import { ApiResponse, BookingStats } from "@/components/types";

interface UseBookingsReturn {
  bookings: BookingData[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: any;
  stats: BookingStats | null;
  getBookings: (filters?: BookingFilters) => Promise<void>;
  createAdminBooking: (bookingData: AdminBookingFormData) => Promise<boolean>;
  createWebsiteBooking: (
    bookingData: WebsiteBookingFormData
  ) => Promise<boolean>;
  updateBooking: (
    id: string,
    bookingData: Partial<AdminBookingFormData>
  ) => Promise<boolean>;
  deleteBooking: (id: string) => Promise<boolean>;
  confirmBooking: (id: string) => Promise<boolean>;
  cancelBooking: (id: string, reason?: string) => Promise<boolean>;
  markAsPickedUp: (id: string) => Promise<boolean>;
  completeBooking: (id: string) => Promise<boolean>;
  checkVehicleAvailability: (
    vehicleId: string,
    pickupDate: string,
    returnDate: string
  ) => Promise<any>;
  getBookingStats: () => Promise<void>;
  refreshBookings: () => Promise<void>;
}

export const useBookings = (
  initialFilters: BookingFilters = {}
): UseBookingsReturn => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<any>(null);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [filters, setFilters] = useState<BookingFilters>(initialFilters);

  const getBookings = useCallback(
    async (newFilters?: BookingFilters) => {
      setLoading(true);
      setError(null);

      try {
        const filtersToUse = newFilters || filters;
        const response = await bookingService.getBookings(filtersToUse);

        if (response.success) {
          setBookings(response.data || []);
          setTotal(response.total || 0);
          setPagination(response.pagination || null);

          if (newFilters) {
            setFilters(newFilters);
          }
        } else {
          throw new Error(response.message || "Failed to fetch bookings");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch bookings";
        setError(errorMessage);
        console.error("Error fetching bookings:", err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const createAdminBooking = useCallback(
    async (bookingData: AdminBookingFormData): Promise<boolean> => {
      try {
        const response = await bookingService.createAdminBooking(bookingData);

        if (response.success) {
          toast.success(response.message || "Booking created successfully");
          await getBookings(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to create booking");
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create booking";
        toast.error(errorMessage);
        console.error("Error creating admin booking:", err);
        return false;
      }
    },
    [getBookings]
  );

  const createWebsiteBooking = useCallback(
    async (bookingData: WebsiteBookingFormData): Promise<boolean> => {
      try {
        const response = await bookingService.createWebsiteBooking(bookingData);

        if (response.success) {
          toast.success(
            response.message || "Booking request submitted successfully"
          );
          return true;
        } else {
          toast.error(response.message || "Failed to submit booking request");
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to submit booking request";
        toast.error(errorMessage);
        console.error("Error creating website booking:", err);
        return false;
      }
    },
    []
  );

  const updateBooking = useCallback(
    async (
      id: string,
      bookingData: Partial<AdminBookingFormData>
    ): Promise<boolean> => {
      try {
        const response = await bookingService.updateBooking(id, bookingData);

        if (response.success) {
          toast.success(response.message || "Booking updated successfully");
          await getBookings(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to update booking");
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update booking";
        toast.error(errorMessage);
        console.error("Error updating booking:", err);
        return false;
      }
    },
    [getBookings]
  );

  const deleteBooking = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await bookingService.deleteBooking(id);

        if (response.success) {
          toast.success(response.message || "Booking deleted successfully");
          await getBookings(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to delete booking");
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to delete booking";
        toast.error(errorMessage);
        console.error("Error deleting booking:", err);
        return false;
      }
    },
    [getBookings]
  );

  const confirmBooking = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await bookingService.confirmBooking(id);

        if (response.success) {
          toast.success("Booking confirmed successfully");
          await getBookings(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to confirm booking");
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to confirm booking";
        toast.error(errorMessage);
        console.error("Error confirming booking:", err);
        return false;
      }
    },
    [getBookings]
  );

  const cancelBooking = useCallback(
    async (id: string, reason?: string): Promise<boolean> => {
      try {
        const response = await bookingService.cancelBooking(id, reason);

        if (response.success) {
          toast.success("Booking cancelled successfully");
          await getBookings(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to cancel booking");
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to cancel booking";
        toast.error(errorMessage);
        console.error("Error cancelling booking:", err);
        return false;
      }
    },
    [getBookings]
  );

  const markAsPickedUp = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await bookingService.markAsPickedUp(id);

        if (response.success) {
          toast.success("Booking marked as picked up");
          await getBookings(); // Refresh the list
          return true;
        } else {
          toast.error(
            response.message || "Failed to mark booking as picked up"
          );
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to mark booking as picked up";
        toast.error(errorMessage);
        console.error("Error marking booking as picked up:", err);
        return false;
      }
    },
    [getBookings]
  );

  const completeBooking = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await bookingService.completeBooking(id);

        if (response.success) {
          toast.success("Booking completed successfully");
          await getBookings(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to complete booking");
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to complete booking";
        toast.error(errorMessage);
        console.error("Error completing booking:", err);
        return false;
      }
    },
    [getBookings]
  );

  const checkVehicleAvailability = useCallback(
    async (vehicleId: string, pickupDate: string, returnDate: string) => {
      try {
        const response = await bookingService.checkVehicleAvailability(
          vehicleId,
          pickupDate,
          returnDate
        );

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || "Failed to check availability");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to check availability";
        console.error("Error checking vehicle availability:", err);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const getBookingStats = useCallback(async () => {
    try {
      const response = await bookingService.getBookingStats();

      if (response.success && response.data) {
        // Transform backend stats to match frontend expectations
        const transformedStats: BookingStats = {
          totalBookings: response.data.overview?.totalBookings || 0,
          pendingBookings: response.data.overview?.pendingBookings || 0,
          confirmedBookings: response.data.overview?.confirmedBookings || 0,
          activeBookings: response.data.overview?.activeBookings || 0,
          completedBookings: response.data.overview?.completedBookings || 0,
          cancelledBookings: response.data.overview?.cancelledBookings || 0,
          totalRevenue: response.data.overview?.totalRevenue || 0,
          averageBookingValue: response.data.overview?.averageBookingValue || 0,
          monthlyRevenue: response.data.overview?.totalRevenue || 0, // Calculate current month revenue
        };

        setStats(transformedStats);
      } else {
        throw new Error(response.message || "Failed to fetch booking stats");
      }
    } catch (err: any) {
      console.error("Error fetching booking stats:", err);
      // Set default stats if error
      setStats({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        averageBookingValue: 0,
        monthlyRevenue: 0,
      });
    }
  }, []);

  const refreshBookings = useCallback(() => getBookings(), [getBookings]);

  // Initial load
  useEffect(() => {
    getBookings();
    getBookingStats();
  }, []);

  return {
    bookings,
    loading,
    error,
    total,
    pagination,
    stats,
    getBookings,
    createAdminBooking,
    createWebsiteBooking,
    updateBooking,
    deleteBooking,
    confirmBooking,
    cancelBooking,
    markAsPickedUp,
    completeBooking,
    checkVehicleAvailability,
    getBookingStats,
    refreshBookings,
  };
};
