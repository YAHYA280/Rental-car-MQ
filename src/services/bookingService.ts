import { ApiResponse } from "@/components/types";

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

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  monthlyRevenue: number;
  revenueStats?: {
    total: number;
    monthly: number;
    average: number;
  };
  statusBreakdown?: {
    [key: string]: number;
  };
}

class BookingService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Enhanced error handling for API calls
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`Making API request to: ${url}`);
      console.log("Request options:", options);

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      console.log(`API Response status: ${response.status}`);

      // Handle different response types
      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        console.error("Non-JSON response:", textResult);
        result = {
          success: false,
          message: `Server returned non-JSON response: ${textResult.substring(
            0,
            200
          )}`,
          data: null,
        };
      }

      if (!response.ok) {
        console.error("API Error Response:", result);

        // Enhanced error message handling for booking conflicts
        let errorMessage =
          result?.message ||
          result?.error ||
          `HTTP ${response.status}: ${response.statusText}`;

        // Parse same-day conflict errors for better UI handling
        if (errorMessage.includes("Same-day conflicts:")) {
          errorMessage = this.parseSameDayConflictError(errorMessage);
        }

        throw new Error(errorMessage);
      }

      console.log("API Result:", result);
      return result;
    } catch (error) {
      console.error("API Request error:", error);

      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
          data: null as any,
        };
      }

      return {
        success: false,
        message: "Unknown error occurred",
        data: null as any,
      };
    }
  }

  // NEW: Parse same-day conflict errors for better UI display
  private parseSameDayConflictError(errorMessage: string): string {
    try {
      // Extract time and date information from backend error
      const timeMatch = errorMessage.match(
        /start after (\d{2}:\d{2}:\d{2}) on (\d{4}-\d{2}-\d{2})/
      );

      if (timeMatch) {
        const requiredTime = timeMatch[1].substring(0, 5); // Remove seconds
        const conflictDate = new Date(timeMatch[2]).toLocaleDateString();

        return `Vehicle is not available at that time. Please select ${requiredTime} or later on ${conflictDate}.`;
      }

      // Fallback to original message if parsing fails
      return errorMessage;
    } catch (error) {
      console.error("Error parsing same-day conflict:", error);
      return errorMessage;
    }
  }

  // UPDATED: Client-side validation before API call
  private validateBookingData(
    data: AdminBookingFormData | WebsiteBookingFormData
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // UPDATED: Validate minimum 2 days
    if (data.pickupDate && data.returnDate) {
      const pickupDate = new Date(data.pickupDate);
      const returnDate = new Date(data.returnDate);

      // Calculate days difference
      const diffTime = returnDate.getTime() - pickupDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 2) {
        errors.push("Minimum rental period is 2 days");
      }

      // Apply time logic if times are provided
      if (data.pickupTime && data.returnTime && diffDays >= 2) {
        const [pickupHour, pickupMin] = data.pickupTime.split(":").map(Number);
        const [returnHour, returnMin] = data.returnTime.split(":").map(Number);

        if (
          !isNaN(pickupHour) &&
          !isNaN(pickupMin) &&
          !isNaN(returnHour) &&
          !isNaN(returnMin)
        ) {
          const pickupMinutes = pickupHour * 60 + pickupMin;
          const returnMinutes = returnHour * 60 + returnMin;
          const timeDifference = returnMinutes - pickupMinutes;

          // Calculate final days with time logic
          let finalDays = diffDays;
          if (timeDifference > 60) {
            // More than 1 hour difference
            finalDays += 1;
          }

          const actualDays = Math.max(2, finalDays);

          if (actualDays < 2) {
            errors.push(
              "Rental period with time logic must be at least 2 days"
            );
          }
        }
      }
    }

    // Validate required fields
    if (!data.vehicleId) errors.push("Vehicle selection is required");
    if (!data.pickupDate) errors.push("Pickup date is required");
    if (!data.returnDate) errors.push("Return date is required");
    if (!data.pickupTime) errors.push("Pickup time is required");
    if (!data.returnTime) errors.push("Return time is required");
    if (!data.pickupLocation) errors.push("Pickup location is required");
    if (!data.returnLocation) errors.push("Return location is required");

    // Validate time format
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (data.pickupTime && !timePattern.test(data.pickupTime)) {
      errors.push("Invalid pickup time format");
    }
    if (data.returnTime && !timePattern.test(data.returnTime)) {
      errors.push("Invalid return time format");
    }

    // Validate dates
    if (data.pickupDate && data.returnDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pickup = new Date(data.pickupDate);
      const returnD = new Date(data.returnDate);

      if (pickup < today) {
        errors.push("Pickup date cannot be in the past");
      }

      if (returnD <= pickup) {
        errors.push("Return date must be after pickup date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

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

      return await this.makeRequest<BookingData[]>(url, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
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
    const token = localStorage.getItem("token");
    return await this.makeRequest<BookingData>(
      `${this.baseUrl}/bookings/${id}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  }

  // UPDATED: Create website booking with validation
  async createWebsiteBooking(
    bookingData: WebsiteBookingFormData
  ): Promise<ApiResponse<BookingData>> {
    console.log("Creating website booking with data:", bookingData);

    // Client-side validation
    const validation = this.validateBookingData(bookingData);
    if (!validation.isValid) {
      return {
        success: false,
        message: `Validation failed: ${validation.errors.join(", ")}`,
        data: null as any,
      };
    }

    return await this.makeRequest<BookingData>(
      `${this.baseUrl}/bookings/website`,
      {
        method: "POST",
        body: JSON.stringify(bookingData),
      }
    );
  }

  // UPDATED: Create admin booking with validation
  async createAdminBooking(
    bookingData: AdminBookingFormData
  ): Promise<ApiResponse<BookingData>> {
    const token = localStorage.getItem("token");
    console.log("Creating admin booking with data:", bookingData);

    // Client-side validation
    const validation = this.validateBookingData(bookingData);
    if (!validation.isValid) {
      return {
        success: false,
        message: `Validation failed: ${validation.errors.join(", ")}`,
        data: null as any,
      };
    }

    return await this.makeRequest<BookingData>(`${this.baseUrl}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  }

  // Update booking (Admin only)
  async updateBooking(
    id: string,
    bookingData: Partial<AdminBookingFormData>
  ): Promise<ApiResponse<BookingData>> {
    const token = localStorage.getItem("token");

    return await this.makeRequest<BookingData>(
      `${this.baseUrl}/bookings/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      }
    );
  }

  // Delete booking (Super-admin only)
  async deleteBooking(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");

    return await this.makeRequest<void>(`${this.baseUrl}/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Confirm booking (Admin only)
  async confirmBooking(id: string): Promise<ApiResponse<BookingData>> {
    const token = localStorage.getItem("token");

    return await this.makeRequest<BookingData>(
      `${this.baseUrl}/bookings/${id}/confirm`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Cancel booking (Admin only)
  async cancelBooking(
    id: string,
    reason?: string
  ): Promise<ApiResponse<BookingData>> {
    const token = localStorage.getItem("token");

    return await this.makeRequest<BookingData>(
      `${this.baseUrl}/bookings/${id}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cancellationReason: reason }),
      }
    );
  }

  // Mark booking as picked up (Admin only)
  async markAsPickedUp(id: string): Promise<ApiResponse<BookingData>> {
    const token = localStorage.getItem("token");

    return await this.makeRequest<BookingData>(
      `${this.baseUrl}/bookings/${id}/pickup`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Complete booking (Admin only)
  async completeBooking(id: string): Promise<ApiResponse<BookingData>> {
    const token = localStorage.getItem("token");

    return await this.makeRequest<BookingData>(
      `${this.baseUrl}/bookings/${id}/return`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Enhanced booking stats with fallback handling
  async getBookingStats(): Promise<ApiResponse<BookingStats>> {
    try {
      const token = localStorage.getItem("token");

      const response = await this.makeRequest<BookingStats>(
        `${this.baseUrl}/bookings/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.success || !response.data) {
        console.warn("Stats API failed, providing fallback stats");

        const bookingsResponse = await this.getBookings({ limit: 1000 });

        if (bookingsResponse.success && bookingsResponse.data) {
          const bookings = bookingsResponse.data;
          const fallbackStats = this.calculateFallbackStats(bookings);

          return {
            success: true,
            message: "Stats calculated from bookings data",
            data: fallbackStats,
          };
        }

        return {
          success: true,
          message: "Using default stats due to API unavailability",
          data: {
            totalBookings: 0,
            pendingBookings: 0,
            confirmedBookings: 0,
            activeBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0,
            totalRevenue: 0,
            averageBookingValue: 0,
            monthlyRevenue: 0,
          },
        };
      }

      return response;
    } catch (error) {
      console.error("BookingService.getBookingStats error:", error);

      return {
        success: true,
        message: "Using fallback stats due to error",
        data: {
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalRevenue: 0,
          averageBookingValue: 0,
          monthlyRevenue: 0,
        },
      };
    }
  }

  private calculateFallbackStats(bookings: BookingData[]): BookingStats {
    const stats: BookingStats = {
      totalBookings: bookings.length,
      pendingBookings: 0,
      confirmedBookings: 0,
      activeBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      averageBookingValue: 0,
      monthlyRevenue: 0,
    };

    let totalRevenue = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let monthlyRevenue = 0;

    bookings.forEach((booking) => {
      switch (booking.status) {
        case "pending":
          stats.pendingBookings++;
          break;
        case "confirmed":
          stats.confirmedBookings++;
          break;
        case "active":
          stats.activeBookings++;
          break;
        case "completed":
          stats.completedBookings++;
          break;
        case "cancelled":
          stats.cancelledBookings++;
          break;
      }

      if (booking.status === "completed" && booking.totalAmount) {
        totalRevenue += booking.totalAmount;

        const bookingDate = new Date(booking.createdAt);
        if (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        ) {
          monthlyRevenue += booking.totalAmount;
        }
      }
    });

    stats.totalRevenue = totalRevenue;
    stats.monthlyRevenue = monthlyRevenue;
    stats.averageBookingValue =
      stats.completedBookings > 0 ? totalRevenue / stats.completedBookings : 0;

    return stats;
  }

  async checkVehicleAvailability(
    vehicleId: string,
    pickupDate: string,
    returnDate: string
  ): Promise<ApiResponse<any>> {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({
      pickupDate,
      returnDate,
    });

    return await this.makeRequest<any>(
      `${this.baseUrl}/bookings/availability/${vehicleId}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async getCustomerBookings(
    customerId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<BookingData[]>> {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return await this.makeRequest<BookingData[]>(
      `${this.baseUrl}/bookings/customer/${customerId}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async getVehicleCalendar(
    vehicleId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const queryString = params.toString();
      const url = `${this.baseUrl}/bookings/calendar/${vehicleId}${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching vehicle calendar from:", url);

      const response = await this.makeRequest<any>(url, {
        method: "GET",
      });

      if (response.success) {
        console.log("Vehicle calendar data:", response.data);
        return response;
      }

      throw new Error(response.message || "Failed to fetch vehicle calendar");
    } catch (error) {
      console.error("BookingService.getVehicleCalendar error:", error);

      return {
        success: true,
        message: "Using fallback calendar data due to API error",
        data: {
          vehicleId,
          available: true,
          currentBooking: null,
          upcomingBooking: null,
          nextAvailableDate: null,
          blockedDates: [],
          bookedPeriods: [],
          searchPeriod: {
            startDate: startDate || new Date().toISOString().split("T")[0],
            endDate:
              endDate ||
              new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
          },
        },
      };
    }
  }
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

  validateBookingDates(
    pickupDate: string,
    returnDate: string
  ): { isValid: boolean; error?: string } {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();

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

    if (diffDays < 2) {
      return { isValid: false, error: "Minimum rental period is 2 days" };
    }

    return { isValid: true };
  }

  calculateRentalDays(
    pickupDate: string,
    returnDate: string,
    pickupTime?: string,
    returnTime?: string
  ): number {
    try {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
      let basicDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (pickupTime && returnTime) {
        const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
        const [returnHour, returnMin] = returnTime.split(":").map(Number);

        if (
          !isNaN(pickupHour) &&
          !isNaN(pickupMin) &&
          !isNaN(returnHour) &&
          !isNaN(returnMin)
        ) {
          const pickupMinutes = pickupHour * 60 + pickupMin;
          const returnMinutes = returnHour * 60 + returnMin;
          const timeDifference = returnMinutes - pickupMinutes;

          if (timeDifference > 60) {
            basicDays += 1;
          }
        }
      }

      return Math.max(2, basicDays);
    } catch (error) {
      console.error("Error calculating rental days:", error);
      return 2;
    }
  }
}

export const bookingService = new BookingService();
