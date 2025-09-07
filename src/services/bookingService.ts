// src/services/bookingService.ts - Frontend booking service
import { ApiResponse } from "@/components/types";

// Booking types
export interface BookingData {
  id: string;
  bookingNumber: string;
  customerId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  source: "website" | "admin";
  createdAt: string;
  updatedAt: string;

  // Relations
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  vehicle?: {
    id: string;
    name: string;
    brand: string;
    year: number;
    licensePlate: string;
    whatsappNumber?: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  confirmedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

// Website booking form data (includes customer info)
export interface WebsiteBookingFormData {
  // Customer information
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;

  // Booking details
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
}

// Admin booking form data (uses existing customer)
export interface AdminBookingFormData {
  customerId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string | string[];
  source?: string | string[];
  customerId?: string;
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

class BookingService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Get all bookings with filtering and pagination (Admin only)
  async getBookings(
    filters: BookingFilters = {}
  ): Promise<ApiResponse<BookingData[]>> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "boolean") {
            queryParams.append(key, value.toString());
          } else if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const token = localStorage.getItem("token");
      const url = `${this.baseUrl}/bookings?${queryParams.toString()}`;

      console.log("Making API request to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("API Result:", result);

      return result;
    } catch (error) {
      console.error("BookingService.getBookings error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch bookings",
        data: [],
        total: 0,
      };
    }
  }

  // Get single booking by ID (Admin only)
  async getBooking(id: string): Promise<ApiResponse<BookingData>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/bookings/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.getBooking error:", error);
      throw error;
    }
  }

  // Create website booking (Public)
  async createWebsiteBooking(
    bookingData: WebsiteBookingFormData
  ): Promise<ApiResponse<BookingData>> {
    try {
      console.log("Creating website booking with data:", bookingData);

      const response = await fetch(`${this.baseUrl}/bookings/website`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.createWebsiteBooking error:", error);
      throw error;
    }
  }

  // Create admin booking (Admin only)
  async createAdminBooking(
    bookingData: AdminBookingFormData
  ): Promise<ApiResponse<BookingData>> {
    try {
      const token = localStorage.getItem("token");

      console.log("Creating admin booking with data:", bookingData);

      const response = await fetch(`${this.baseUrl}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.createAdminBooking error:", error);
      throw error;
    }
  }

  // Update booking (Admin only)
  async updateBooking(
    id: string,
    bookingData: Partial<AdminBookingFormData>
  ): Promise<ApiResponse<BookingData>> {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseUrl}/bookings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.updateBooking error:", error);
      throw error;
    }
  }

  // Delete booking (Super-admin only)
  async deleteBooking(id: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.deleteBooking error:", error);
      throw error;
    }
  }

  // Confirm booking (Admin only)
  async confirmBooking(id: string): Promise<ApiResponse<BookingData>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/bookings/${id}/confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to confirm booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.confirmBooking error:", error);
      throw error;
    }
  }

  // Cancel booking (Admin only)
  async cancelBooking(
    id: string,
    reason?: string
  ): Promise<ApiResponse<BookingData>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/bookings/${id}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancellationReason: reason }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.cancelBooking error:", error);
      throw error;
    }
  }

  // Mark booking as picked up (Admin only)
  async markAsPickedUp(id: string): Promise<ApiResponse<BookingData>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/bookings/${id}/pickup`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to mark booking as picked up"
        );
      }

      return result;
    } catch (error) {
      console.error("BookingService.markAsPickedUp error:", error);
      throw error;
    }
  }

  // Complete booking (Admin only)
  async completeBooking(id: string): Promise<ApiResponse<BookingData>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/bookings/${id}/return`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to complete booking");
      }

      return result;
    } catch (error) {
      console.error("BookingService.completeBooking error:", error);
      throw error;
    }
  }

  // Get booking statistics (Admin only)
  async getBookingStats(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/bookings/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch booking stats");
      }

      return result;
    } catch (error) {
      console.error("BookingService.getBookingStats error:", error);
      throw error;
    }
  }

  // Check vehicle availability (Admin only)
  async checkVehicleAvailability(
    vehicleId: string,
    pickupDate: string,
    returnDate: string
  ): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        pickupDate,
        returnDate,
      });

      const response = await fetch(
        `${this.baseUrl}/bookings/availability/${vehicleId}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to check availability");
      }

      return result;
    } catch (error) {
      console.error("BookingService.checkVehicleAvailability error:", error);
      throw error;
    }
  }

  // Get customer bookings (Admin only)
  async getCustomerBookings(
    customerId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<BookingData[]>> {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${this.baseUrl}/bookings/customer/${customerId}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch customer bookings");
      }

      return result;
    } catch (error) {
      console.error("BookingService.getCustomerBookings error:", error);
      throw error;
    }
  }

  // Helper to format booking data for display
  formatBookingForDisplay(booking: BookingData) {
    return {
      ...booking,
      customerName: booking.customer
        ? `${booking.customer.firstName} ${booking.customer.lastName}`
        : "Unknown Customer",
      vehicleName: booking.vehicle
        ? `${booking.vehicle.brand} ${booking.vehicle.name}`
        : "Unknown Vehicle",
      duration: `${booking.totalDays} day${booking.totalDays > 1 ? "s" : ""}`,
      formattedDates: {
        pickup: new Date(booking.pickupDate).toLocaleDateString(),
        return: new Date(booking.returnDate).toLocaleDateString(),
      },
    };
  }

  // Helper to validate booking dates
  validateBookingDates(
    pickupDate: string,
    returnDate: string
  ): { isValid: boolean; error?: string } {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();

    // Reset time to start of day for comparison
    today.setHours(0, 0, 0, 0);
    pickup.setHours(0, 0, 0, 0);
    returnD.setHours(0, 0, 0, 0);

    if (pickup < today) {
      return { isValid: false, error: "Pickup date cannot be in the past" };
    }

    if (returnD <= pickup) {
      return { isValid: false, error: "Return date must be after pickup date" };
    }

    const diffTime = returnD.getTime() - pickup.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return { isValid: false, error: "Minimum rental period is 1 day" };
    }

    return { isValid: true };
  }
}

export const bookingService = new BookingService();
