// src/services/userService.ts - User API Service
import {
  apiService,
  User,
  UserFormData,
  UserFilters,
  ApiResponse,
} from "@/lib/api";

class UserService {
  // Get all users with filtering and pagination
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<User[]>> {
    return apiService.get("/customers", filters);
  }

  // Get single user by ID
  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiService.get(`/customers/${id}`);
  }

  // Create new user
  async createUser(userData: UserFormData): Promise<ApiResponse<User>> {
    const formData = this.buildFormData(userData);
    return apiService.postFormData("/customers", formData);
  }

  // Update user
  async updateUser(
    id: string,
    userData: Partial<UserFormData>
  ): Promise<ApiResponse<User>> {
    const formData = this.buildFormData(userData);
    return apiService.putFormData(`/customers/${id}`, formData);
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/customers/${id}`);
  }

  // Update user status
  async updateUserStatus(
    id: string,
    status: "active" | "inactive" | "blocked"
  ): Promise<ApiResponse<User>> {
    return apiService.put(`/customers/${id}/status`, { status });
  }

  // Upload driver license
  async uploadDriverLicense(
    id: string,
    file: File
  ): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append("driverLicenseImage", file);
    return apiService.putFormData(`/customers/${id}/driver-license`, formData);
  }

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<any>> {
    return apiService.get("/customers/stats");
  }

  // Search users
  async searchUsers(
    query: string,
    limit = 10,
    offset = 0
  ): Promise<ApiResponse<User[]>> {
    return apiService.get("/customers/search", { q: query, limit, offset });
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
        formData.append(key, JSON.stringify(value));
      } else if (key === "preferences" && value && typeof value === "object") {
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
}

export const userService = new UserService();
