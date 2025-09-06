// STEP 2A: Replace src/services/userService.ts

import {
  ApiResponse,
  User,
  UserFormData,
  UserFilters,
} from "@/components/types";

class UserService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Get all users with filtering and pagination
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<User[]>> {
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
  async getUser(id: string): Promise<ApiResponse<User>> {
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

  // Create new user
  async createUser(userData: UserFormData): Promise<ApiResponse<User>> {
    try {
      const formData = this.buildFormData(userData);
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseUrl}/customers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

  // Update user
  async updateUser(
    id: string,
    userData: Partial<UserFormData>
  ): Promise<ApiResponse<User>> {
    try {
      const formData = this.buildFormData(userData);
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseUrl}/customers/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
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
  ): Promise<ApiResponse<User>> {
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
  ): Promise<ApiResponse<User>> {
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
  ): Promise<ApiResponse<User[]>> {
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

  // Helper method to build FormData from UserFormData
  private buildFormData(userData: Partial<UserFormData>): FormData {
    const formData = new FormData();

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
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    // Add driver license image
    if (userData.driverLicenseImage) {
      formData.append("driverLicenseImage", userData.driverLicenseImage);
    }

    return formData;
  }

  // Transform backend response to frontend format
  transformUserResponse(backendUser: any): User {
    return {
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
  }

  // Get users with transformation
  async getUsersTransformed(
    filters: UserFilters = {}
  ): Promise<ApiResponse<User[]>> {
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
}

export const userService = new UserService();
