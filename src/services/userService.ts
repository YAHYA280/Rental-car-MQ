import {
  ApiResponse,
  UserData,
  UserFormData,
  UserFiltersType,
  DocumentUploadData,
  SingleDocumentUpload,
  DocumentCompletionStatus,
  ContractValidation,
  parseStringBoolean,
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

      // Handle all filter parameters including document status filter
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

  // UPDATED: Create new user with simplified document support
  async createUser(userData: UserFormData): Promise<ApiResponse<UserData>> {
    try {
      const formData = this.buildSimplifiedFormData(userData);
      const token = localStorage.getItem("token");

      console.log("Creating user with simplified data:", userData);

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

  // UPDATED: Update user with simplified document support
  async updateUser(
    id: string,
    userData: Partial<UserFormData>
  ): Promise<ApiResponse<UserData>> {
    try {
      const formData = this.buildSimplifiedFormData(userData);
      const token = localStorage.getItem("token");

      console.log("Updating user with simplified data:", userData);

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

  // LEGACY: Upload driver license only (backward compatibility)
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

  // Upload passport document
  async uploadPassport(id: string, file: File): Promise<ApiResponse<UserData>> {
    try {
      const formData = new FormData();
      formData.append("passportImage", file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/customers/${id}/passport`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload passport");
      }

      return result;
    } catch (error) {
      console.error("UserService.uploadPassport error:", error);
      throw error;
    }
  }

  // Upload CIN document
  async uploadCin(id: string, file: File): Promise<ApiResponse<UserData>> {
    try {
      const formData = new FormData();
      formData.append("cinImage", file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/customers/${id}/cin`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload CIN");
      }

      return result;
    } catch (error) {
      console.error("UserService.uploadCin error:", error);
      throw error;
    }
  }

  // Upload multiple documents at once
  async uploadMultipleDocuments(
    id: string,
    documents: DocumentUploadData
  ): Promise<ApiResponse<UserData>> {
    try {
      const formData = new FormData();

      // Add all provided documents
      if (documents.driverLicenseImage) {
        formData.append("driverLicenseImage", documents.driverLicenseImage);
      }
      if (documents.passportImage) {
        formData.append("passportImage", documents.passportImage);
      }
      if (documents.cinImage) {
        formData.append("cinImage", documents.cinImage);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${this.baseUrl}/customers/${id}/documents`,
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
        throw new Error(result.message || "Failed to upload documents");
      }

      return result;
    } catch (error) {
      console.error("UserService.uploadMultipleDocuments error:", error);
      throw error;
    }
  }

  // Upload single document by type
  async uploadSingleDocument(
    id: string,
    upload: SingleDocumentUpload
  ): Promise<ApiResponse<UserData>> {
    switch (upload.documentType) {
      case "driverLicense":
        return this.uploadDriverLicense(id, upload.file);
      case "passport":
        return this.uploadPassport(id, upload.file);
      case "cin":
        return this.uploadCin(id, upload.file);
      default:
        throw new Error(`Unsupported document type: ${upload.documentType}`);
    }
  }

  // Get document completion status
  async getDocumentStatus(
    id: string
  ): Promise<ApiResponse<DocumentCompletionStatus>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${this.baseUrl}/customers/${id}/documents/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch document status");
      }

      return result;
    } catch (error) {
      console.error("UserService.getDocumentStatus error:", error);
      throw error;
    }
  }

  // Remove specific document
  async removeDocument(
    id: string,
    documentType: "driverLicense" | "passport" | "cin"
  ): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${this.baseUrl}/customers/${id}/documents/${documentType}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove document");
      }

      return result;
    } catch (error) {
      console.error("UserService.removeDocument error:", error);
      throw error;
    }
  }

  // Get users with incomplete documents
  async getUsersWithIncompleteDocuments(
    page = 1,
    limit = 25
  ): Promise<ApiResponse<UserData[]>> {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${this.baseUrl}/customers/filter/incomplete-documents?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch incomplete users");
      }

      return result;
    } catch (error) {
      console.error(
        "UserService.getUsersWithIncompleteDocuments error:",
        error
      );
      throw error;
    }
  }

  // Bulk update customer documents
  async bulkUpdateDocuments(
    updates: Array<{ id: string; [key: string]: any }>
  ): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/customers/bulk/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customers: updates }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to bulk update documents");
      }

      return result;
    } catch (error) {
      console.error("UserService.bulkUpdateDocuments error:", error);
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

  // UPDATED: Simplified FormData builder with new structure
  private buildSimplifiedFormData(userData: Partial<UserFormData>): FormData {
    const formData = new FormData();

    console.log("Building simplified FormData from:", userData);

    // Add regular fields (removed city, postalCode, notes, referralCode, emergencyContact)
    Object.entries(userData).forEach(([key, value]) => {
      // Skip file fields - handle separately
      if (["driverLicenseImage", "passportImage", "cinImage"].includes(key)) {
        return;
      }

      if (key === "preferences" && value && typeof value === "object") {
        // Backend expects JSON string for nested objects
        formData.append(key, JSON.stringify(value));
      } else if (key === "email") {
        // Handle optional email properly
        if (value && typeof value === "string" && value.trim() !== "") {
          formData.append(key, value.trim());
        }
        // Don't append empty or undefined email - let backend handle as null
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    // Add all document images if provided
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

    if (userData.passportImage && userData.passportImage instanceof File) {
      formData.append("passportImage", userData.passportImage);
      console.log(
        "Added passport image to FormData:",
        userData.passportImage.name
      );
    }

    if (userData.cinImage && userData.cinImage instanceof File) {
      formData.append("cinImage", userData.cinImage);
      console.log("Added CIN image to FormData:", userData.cinImage.name);
    }

    // Debug log what's in FormData
    console.log("Simplified FormData entries:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    return formData;
  }

  // UPDATED: Transform backend response with simplified structure
  transformUserResponse(backendUser: any): UserData {
    const transformed: UserData = {
      ...backendUser,
      // Ensure all required fields have default values
      country: backendUser.country || "MA",
      totalBookings: backendUser.totalBookings || 0,
      totalSpent: backendUser.totalSpent || 0,
      source: backendUser.source || "admin",
      emailVerified: backendUser.emailVerified || false,
      phoneVerified: backendUser.phoneVerified || false,
      status: backendUser.status || "active",
    };

    // Handle driver license image from BYTEA
    if (backendUser.driverLicenseImage?.dataUrl) {
      transformed.driverLicenseImage = {
        dataUrl: backendUser.driverLicenseImage.dataUrl,
        mimetype: backendUser.driverLicenseImage.mimetype,
        name: backendUser.driverLicenseImage.name || "permis-conduire",
      };
    }

    // Handle passport image from BYTEA
    if (backendUser.passportImage?.dataUrl) {
      transformed.passportImage = {
        dataUrl: backendUser.passportImage.dataUrl,
        mimetype: backendUser.passportImage.mimetype,
        name: backendUser.passportImage.name || "passeport",
      };
    }

    // Handle CIN image from BYTEA
    if (backendUser.cinImage?.dataUrl) {
      transformed.cinImage = {
        dataUrl: backendUser.cinImage.dataUrl,
        mimetype: backendUser.cinImage.mimetype,
        name: backendUser.cinImage.name || "cin",
      };
    }

    // Add formatted phone number
    if (backendUser.phoneFormatted) {
      transformed.phoneFormatted = backendUser.phoneFormatted;
    } else if (backendUser.phone) {
      transformed.phoneFormatted = this.formatPhoneForDisplay(
        backendUser.phone
      );
    }

    // Add document completion status if available
    if (backendUser.documentCompletion) {
      transformed.documentCompletion = backendUser.documentCompletion;
    }

    // Add calculated age if dateOfBirth is available
    if (backendUser.dateOfBirth) {
      transformed.age = this.calculateAge(backendUser.dateOfBirth) ?? undefined;
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

  // Helper to get driver license image URL
  getDriverLicenseImageUrl(user: UserData): string | null {
    if (user.driverLicenseImage?.dataUrl) {
      return user.driverLicenseImage.dataUrl;
    }
    return null;
  }

  // Helper to get passport image URL
  getPassportImageUrl(user: UserData): string | null {
    if (user.passportImage?.dataUrl) {
      return user.passportImage.dataUrl;
    }
    return null;
  }

  // Helper to get CIN image URL
  getCinImageUrl(user: UserData): string | null {
    if (user.cinImage?.dataUrl) {
      return user.cinImage.dataUrl;
    }
    return null;
  }

  // Helper to format phone number for display
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

  // Helper to clean phone number for API
  cleanPhoneForApi(phone: string): string {
    return phone.replace(/\s/g, "");
  }

  // Calculate age from date of birth
  calculateAge(dateOfBirth: string): number | null {
    if (!dateOfBirth) return null;
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  }

  // UPDATED: Check if user has complete documentation for contracts (simplified)
  hasCompleteDocuments(user: UserData): boolean {
    return !!(
      user.firstName &&
      user.lastName &&
      user.phone &&
      user.dateOfBirth &&
      user.address &&
      (user.driverLicenseNumber || user.passportNumber || user.cinNumber)
    );
  }

  // UPDATED: Get missing information for contract generation (simplified)
  getMissingInfoForContract(user: UserData): ContractValidation {
    const requiredFields = ["firstName", "lastName", "phone"];
    const missingFields: string[] = [];

    // Check basic required fields
    requiredFields.forEach((field) => {
      if (!user[field as keyof UserData]) {
        missingFields.push(field);
      }
    });

    // Check for important contract fields
    if (!user.dateOfBirth) missingFields.push("dateOfBirth");
    if (!user.address) missingFields.push("address");

    // Check for at least one identity document
    const hasIdentityDoc = !!(
      user.passportNumber ||
      user.cinNumber ||
      user.driverLicenseNumber
    );

    if (!hasIdentityDoc) {
      missingFields.push("identity_document");
    }

    // UPDATED: Simplified field counting for completion percentage
    const allFields = [
      user.firstName,
      user.lastName,
      user.phone,
      user.email,
      user.dateOfBirth,
      user.address, // Single address field
      user.driverLicenseNumber,
      user.passportNumber,
      user.cinNumber,
      user.passportIssuedAt,
    ];

    const completedFields = allFields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;

    const completionPercentage = Math.round(
      (completedFields / allFields.length) * 100
    );

    return {
      isValid: missingFields.length === 0,
      missingFields,
      completionScore: completedFields,
      hasRequiredFields: requiredFields.every(
        (field) => user[field as keyof UserData]
      ),
      hasAnyIdentityDocument: hasIdentityDoc,
      completionPercentage,
    };
  }
}

export const userService = new UserService();
