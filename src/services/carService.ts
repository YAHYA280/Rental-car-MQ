// src/services/carService.ts - Fixed Car API Service
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
    try {
      return await apiService.get("/vehicles", filters);
    } catch (error) {
      console.error("CarService.getCars error:", error);
      throw error;
    }
  }

  // Get single car by ID
  async getCar(id: string): Promise<ApiResponse<Car>> {
    try {
      return await apiService.get(`/vehicles/${id}`);
    } catch (error) {
      console.error("CarService.getCar error:", error);
      throw error;
    }
  }

  // Get available brands
  async getBrands(): Promise<ApiResponse<string[]>> {
    try {
      return await apiService.get("/vehicles/brands");
    } catch (error) {
      console.error("CarService.getBrands error:", error);
      // Return fallback brands if API fails
      return {
        success: true,
        data: [
          "Cupra",
          "Dacia",
          "Hyundai",
          "KIA",
          "Mercedes",
          "Opel",
          "Peugeot",
          "Porsche",
          "Renault",
          "SEAT",
          "Volkswagen",
        ],
      };
    }
  }

  // Create new car - This method is called from the form
  async createCar(formData: FormData): Promise<ApiResponse<Car>> {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/vehicles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("CarService.createCar error:", error);
      throw error;
    }
  }

  // Update car
  async updateCar(id: string, formData: FormData): Promise<ApiResponse<Car>> {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/vehicles/${id}`,
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
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("CarService.updateCar error:", error);
      throw error;
    }
  }

  // Delete car
  async deleteCar(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiService.delete(`/vehicles/${id}`);
    } catch (error) {
      console.error("CarService.deleteCar error:", error);
      throw error;
    }
  }

  // Upload car images
  async uploadCarImages(
    id: string,
    mainImage?: File,
    additionalImages?: File[]
  ): Promise<ApiResponse<Car>> {
    try {
      const formData = new FormData();

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      if (additionalImages && additionalImages.length > 0) {
        additionalImages.forEach((file) => {
          formData.append("additionalImages", file);
        });
      }

      return await apiService.putFormData(`/vehicles/${id}/images`, formData);
    } catch (error) {
      console.error("CarService.uploadCarImages error:", error);
      throw error;
    }
  }

  // Remove car image
  async removeCarImage(
    id: string,
    imageIndex: number
  ): Promise<ApiResponse<Car>> {
    try {
      return await apiService.delete(`/vehicles/${id}/images/${imageIndex}`);
    } catch (error) {
      console.error("CarService.removeCarImage error:", error);
      throw error;
    }
  }

  // Update car status
  async updateCarStatus(
    id: string,
    status: "active" | "maintenance" | "inactive"
  ): Promise<ApiResponse<Car>> {
    try {
      return await apiService.put(`/vehicles/${id}/status`, { status });
    } catch (error) {
      console.error("CarService.updateCarStatus error:", error);
      throw error;
    }
  }

  // Get car statistics
  async getCarStats(): Promise<ApiResponse<any>> {
    try {
      return await apiService.get("/vehicles/stats");
    } catch (error) {
      console.error("CarService.getCarStats error:", error);
      throw error;
    }
  }

  // Get available cars for date range
  async getAvailableCars(
    startDate: string,
    endDate: string,
    location?: string
  ): Promise<ApiResponse<Car[]>> {
    try {
      const params: any = { startDate, endDate };
      if (location) params.location = location;
      return await apiService.get("/vehicles/availability", params);
    } catch (error) {
      console.error("CarService.getAvailableCars error:", error);
      throw error;
    }
  }

  // Helper to get proper image URL
  private getImageUrl(car: any): string {
    if (car.mainImage?.fullPath) {
      return car.mainImage.fullPath;
    }
    if (car.mainImage?.path) {
      return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${
        car.mainImage.path
      }`;
    }
    if (car.image) {
      return car.image.startsWith("http")
        ? car.image
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${
            car.image
          }`;
    }
    return "/cars/placeholder.jpg";
  }

  // Helper to format WhatsApp number for display
  private formatWhatsAppNumber(number: string): string {
    if (!number) return "";

    // Remove any existing formatting
    const cleaned = number.replace(/\s/g, "");

    // Format as 06 XX XX XX XX if it's 10 digits
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 2)} ${cleaned.substring(
        2,
        4
      )} ${cleaned.substring(4, 6)} ${cleaned.substring(
        6,
        8
      )} ${cleaned.substring(8, 10)}`;
    }

    return number;
  }

  // Transform backend response to frontend format
  private transformCarResponse(backendCar: any): Car {
    return {
      ...backendCar,
      // Ensure image paths are properly formatted
      image: this.getImageUrl(backendCar),
      // Format WhatsApp number for display
      whatsappNumber: this.formatWhatsAppNumber(backendCar.whatsappNumber),
    };
  }

  // Get cars with transformation
  async getCarsTransformed(
    filters: CarFilters = {}
  ): Promise<ApiResponse<Car[]>> {
    try {
      const response = await this.getCars(filters);
      if (response.data) {
        response.data = response.data.map((car) =>
          this.transformCarResponse(car)
        );
      }
      return response;
    } catch (error) {
      console.error("CarService.getCarsTransformed error:", error);
      throw error;
    }
  }
}

export const carService = new CarService();
