// src/hooks/useCars.ts - Cars Management Hook
import { useState, useEffect, useCallback } from "react";
import { Car, CarFormData, CarFilters } from "@/lib/api";
import { toast } from "sonner";
import { carService } from "@/services/carService";

interface UseCarsReturn {
  cars: Car[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: any;
  getCars: (filters?: CarFilters) => Promise<void>;
  createCar: (carData: CarFormData) => Promise<boolean>;
  updateCar: (id: string, carData: Partial<CarFormData>) => Promise<boolean>;
  deleteCar: (id: string) => Promise<boolean>;
  updateCarStatus: (
    id: string,
    status: "active" | "maintenance" | "inactive"
  ) => Promise<boolean>;
  refreshCars: () => Promise<void>;
}

export const useCars = (initialFilters: CarFilters = {}): UseCarsReturn => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<CarFilters>(initialFilters);

  const getCars = useCallback(
    async (newFilters?: CarFilters) => {
      setLoading(true);
      setError(null);

      try {
        const filtersToUse = newFilters || filters;
        const response = await carService.getCars(filtersToUse);

        setCars(response.data || []);
        setTotal(response.total || 0);
        setPagination(response.pagination || null);

        if (newFilters) {
          setFilters(newFilters);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch cars";
        setError(errorMessage);
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const createCar = useCallback(
    async (carData: CarFormData): Promise<boolean> => {
      try {
        const response = await carService.createCar(carData);

        if (response.success) {
          toast.success(response.message || "Car created successfully");
          await getCars(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to create car");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to create car";
        toast.error(errorMessage);
        console.error("Error creating car:", err);
        return false;
      }
    },
    [getCars]
  );

  const updateCar = useCallback(
    async (id: string, carData: Partial<CarFormData>): Promise<boolean> => {
      try {
        const response = await carService.updateCar(id, carData);

        if (response.success) {
          toast.success(response.message || "Car updated successfully");
          await getCars(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to update car");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to update car";
        toast.error(errorMessage);
        console.error("Error updating car:", err);
        return false;
      }
    },
    [getCars]
  );

  const deleteCar = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await carService.deleteCar(id);

        if (response.success) {
          toast.success(response.message || "Car deleted successfully");
          await getCars(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to delete car");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete car";
        toast.error(errorMessage);
        console.error("Error deleting car:", err);
        return false;
      }
    },
    [getCars]
  );

  const updateCarStatus = useCallback(
    async (
      id: string,
      status: "active" | "maintenance" | "inactive"
    ): Promise<boolean> => {
      try {
        const response = await carService.updateCarStatus(id, status);

        if (response.success) {
          toast.success(`Car status updated to ${status}`);
          await getCars(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to update car status");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to update car status";
        toast.error(errorMessage);
        console.error("Error updating car status:", err);
        return false;
      }
    },
    [getCars]
  );

  const refreshCars = useCallback(() => getCars(), [getCars]);

  // Initial load
  useEffect(() => {
    getCars();
  }, []);

  return {
    cars,
    loading,
    error,
    total,
    pagination,
    getCars,
    createCar,
    updateCar,
    deleteCar,
    updateCarStatus,
    refreshCars,
  };
};
