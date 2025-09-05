// src/services/carService.ts - Car API Service
import {
  apiService,
  Car,
  CarFormData,
  CarFilters,
  ApiResponse,
} from "@/lib/api";

class CarService {
  // Get all cars with filtering and pagination
  async getCars(filters: CarFilters = {}): Promise<ApiResponse<Car[]>> {
    return apiService.get("/vehicles", filters);
  }

  // Get single car by ID
  async getCar(id: string): Promise<ApiResponse<Car>> {
    return apiService.get(`/vehicles/${id}`);
  }

  // Create new car
  async createCar(carData: CarFormData): Promise<ApiResponse<Car>> {
    const formData = this.buildFormData(carData);
    return apiService.postFormData("/vehicles", formData);
  }

  // Update car
  async updateCar(
    id: string,
    carData: Partial<CarFormData>
  ): Promise<ApiResponse<Car>> {
    const formData = this.buildFormData(carData);
    return apiService.putFormData(`/vehicles/${id}`, formData);
  }

  // Delete car
  async deleteCar(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/vehicles/${id}`);
  }

  // Upload car images
  async uploadCarImages(
    id: string,
    mainImage?: File,
    additionalImages?: File[]
  ): Promise<ApiResponse<Car>> {
    const formData = new FormData();

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach((file) => {
        formData.append("additionalImages", file);
      });
    }

    return apiService.putFormData(`/vehicles/${id}/images`, formData);
  }

  // Remove car image
  async removeCarImage(
    id: string,
    imageIndex: number
  ): Promise<ApiResponse<Car>> {
    return apiService.delete(`/vehicles/${id}/images/${imageIndex}`);
  }

  // Update car status
  async updateCarStatus(
    id: string,
    status: "active" | "maintenance" | "inactive"
  ): Promise<ApiResponse<Car>> {
    return apiService.put(`/vehicles/${id}/status`, { status });
  }

  // Get car statistics
  async getCarStats(): Promise<ApiResponse<any>> {
    return apiService.get("/vehicles/stats");
  }

  // Get available cars for date range
  async getAvailableCars(
    startDate: string,
    endDate: string,
    location?: string
  ): Promise<ApiResponse<Car[]>> {
    const params: any = { startDate, endDate };
    if (location) params.location = location;
    return apiService.get("/vehicles/availability", params);
  }

  // Helper method to build FormData from CarFormData
  private buildFormData(carData: Partial<CarFormData>): FormData {
    const formData = new FormData();

    // Add regular fields
    Object.entries(carData).forEach(([key, value]) => {
      if (key === "mainImage" || key === "additionalImages") {
        return; // Handle these separately
      }

      if (key === "features" && Array.isArray(value)) {
        value.forEach((feature, index) => {
          formData.append(`features[${index}]`, feature);
        });
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    // Add main image
    if (carData.mainImage) {
      formData.append("mainImage", carData.mainImage);
    }

    // Add additional images
    if (carData.additionalImages && carData.additionalImages.length > 0) {
      carData.additionalImages.forEach((file) => {
        formData.append("additionalImages", file);
      });
    }

    return formData;
  }
}

export const carService = new CarService();
