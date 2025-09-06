// src/services/userService.ts - FIXED: Updated for BYTEA storage and optional fields

import {
  ApiResponse,
  UserData,
  UserFormData,
  UserFiltersType,
} from "@/components/types";

class UserService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Get all users with filtering and pagination
  async getUsers(
    filters: UserFiltersType = {}
  ): Promise<ApiResponse<UserData[]>> {
    try {
      const queryParams = new URLSearchParams();

      // Handle all filter parameters
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
      const url = `${this.baseUrl}/customers?${queryParams.toString()}`;

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
      console.error("UserService.getUsers error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch users",
        data: [],
        total: 0,
      };
    }
  }

  // Get single user by ID
  async getUser(id: string): Promise<ApiResponse<UserData>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/customers/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch user");
      }

      return result;
    } catch (error) {
      console.error("UserService.getUser error:", error);
      throw error;
    }
  }

  // FIXED: Create new user with proper FormData handling
  async createUser(userData: UserFormData): Promise<ApiResponse<UserData>> {
    try {
      const formData = this.buildFormData(userData);
      const token = localStorage.getItem("token");

      console.log("Creating user with data:", userData);

      const response = await fetch(`${this.baseUrl}/customers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create user");
      }

      return result;
    } catch (error) {
      console.error("UserService.createUser error:", error);
      throw error;
    }
  }

  // FIXED: Update user with proper FormData handling
  async updateUser(
    id: string,
    userData: Partial<UserFormData>
  ): Promise<ApiResponse<UserData>> {
    try {
      const formData = this.buildFormData(userData);
      const token = localStorage.getItem("token");

      console.log("Updating user with data:", userData);

      const response = await fetch(`${this.baseUrl}/customers/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user");
      }

      return result;
    } catch (error) {
      console.error("UserService.updateUser error:", error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/customers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      return result;
    } catch (error) {
      console.error("UserService.deleteUser error:", error);
      throw error;
    }
  }

  // Update user status
  async updateUserStatus(
    id: string,
    status: "active" | "inactive" | "blocked"
  ): Promise<ApiResponse<UserData>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/customers/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user status");
      }

      return result;
    } catch (error) {
      console.error("UserService.updateUserStatus error:", error);
      throw error;
    }
  }

  // Upload driver license
  async uploadDriverLicense(
    id: string,
    file: File
  ): Promise<ApiResponse<UserData>> {
    try {
      const formData = new FormData();
      formData.append("driverLicenseImage", file);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${this.baseUrl}/customers/${id}/driver-license`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload driver license");
      }

      return result;
    } catch (error) {
      console.error("UserService.uploadDriverLicense error:", error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/customers/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch user stats");
      }

      return result;
    } catch (error) {
      console.error("UserService.getUserStats error:", error);
      throw error;
    }
  }

  // Search users
  async searchUsers(
    query: string,
    limit = 10,
    offset = 0
  ): Promise<ApiResponse<UserData[]>> {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(
        `${this.baseUrl}/customers/search?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to search users");
      }

      return result;
    } catch (error) {
      console.error("UserService.searchUsers error:", error);
      throw error;
    }
  }

  // FIXED: Helper method to build FormData from UserFormData with proper optional handling
  private buildFormData(userData: Partial<UserFormData>): FormData {
    const formData = new FormData();

    console.log("Building FormData from:", userData);

    // Add regular fields
    Object.entries(userData).forEach(([key, value]) => {
      if (key === "driverLicenseImage") {
        return; // Handle separately
      }

      if (key === "emergencyContact" && value && typeof value === "object") {
        // Backend expects JSON string for nested objects
        formData.append(key, JSON.stringify(value));
      } else if (key === "preferences" && value && typeof value === "object") {
        // Backend expects JSON string for nested objects
        formData.append(key, JSON.stringify(value));
      } else if (key === "email") {
        // FIXED: Handle optional email properly
        if (value && typeof value === "string" && value.trim() !== "") {
          formData.append(key, value.trim());
        }
        // Don't append empty or undefined email - let backend handle as null
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    // FIXED: Add driver license image only if provided
    if (
      userData.driverLicenseImage &&
      userData.driverLicenseImage instanceof File
    ) {
      formData.append("driverLicenseImage", userData.driverLicenseImage);
      console.log(
        "Added driver license image to FormData:",
        userData.driverLicenseImage.name
      );
    }

    // Debug log what's in FormData
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    return formData;
  }

  // FIXED: Transform backend response to frontend format with BYTEA handling
  transformUserResponse(backendUser: any): UserData {
    const transformed: UserData = {
      ...backendUser,
      // Ensure all required fields have default values
      country: backendUser.country || "MA",
      totalBookings: backendUser.totalBookings || 0,
      totalSpent: backendUser.totalSpent || 0,
      source: backendUser.source || "admin",
      referralCode: backendUser.referralCode || "",
      emailVerified: backendUser.emailVerified || false,
      phoneVerified: backendUser.phoneVerified || false,
      status: backendUser.status || "active",
    };

    // FIXED: Handle driver license image from BYTEA
    if (backendUser.driverLicenseImage?.dataUrl) {
      transformed.driverLicenseImage = {
        dataUrl: backendUser.driverLicenseImage.dataUrl,
        mimetype: backendUser.driverLicenseImage.mimetype,
        name: backendUser.driverLicenseImage.name || "driver-license",
      };
    }

    // FIXED: Add formatted phone number
    if (backendUser.phoneFormatted) {
      transformed.phoneFormatted = backendUser.phoneFormatted;
    } else if (backendUser.phone) {
      // Format phone number if not already formatted
      const cleaned = backendUser.phone.replace(/\s/g, "");
      if (
        cleaned.length === 10 &&
        (cleaned.startsWith("06") || cleaned.startsWith("07"))
      ) {
        transformed.phoneFormatted = `${cleaned.substring(
          0,
          2
        )} ${cleaned.substring(2, 4)} ${cleaned.substring(
          4,
          6
        )} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
      } else {
        transformed.phoneFormatted = backendUser.phone;
      }
    }

    return transformed;
  }

  // Get users with transformation
  async getUsersTransformed(
    filters: UserFiltersType = {}
  ): Promise<ApiResponse<UserData[]>> {
    const response = await this.getUsers(filters);
    if (response.data) {
      response.data = response.data.map((user) =>
        this.transformUserResponse(user)
      );
    }
    return response;
  }

  // Get user bookings
  async getUserBookings(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<any[]>> {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${this.baseUrl}/bookings/customer/${userId}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch user bookings");
      }

      return result;
    } catch (error) {
      console.error("UserService.getUserBookings error:", error);
      throw error;
    }
  }

  // FIXED: Helper to get driver license image URL
  getDriverLicenseImageUrl(user: UserData): string | null {
    if (user.driverLicenseImage?.dataUrl) {
      return user.driverLicenseImage.dataUrl;
    }
    return null;
  }

  // FIXED: Helper to format phone number for display
  formatPhoneForDisplay(phone: string): string {
    if (!phone) return "";
    const cleaned = phone.replace(/\s/g, "");
    if (
      cleaned.length === 10 &&
      (cleaned.startsWith("06") || cleaned.startsWith("07"))
    ) {
      return `${cleaned.substring(0, 2)} ${cleaned.substring(
        2,
        4
      )} ${cleaned.substring(4, 6)} ${cleaned.substring(
        6,
        8
      )} ${cleaned.substring(8, 10)}`;
    }
    return phone;
  }

  // FIXED: Helper to clean phone number for API
  cleanPhoneForApi(phone: string): string {
    return phone.replace(/\s/g, "");
  }
}

export const userService = new UserService();
