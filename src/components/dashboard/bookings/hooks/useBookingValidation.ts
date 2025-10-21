// src/components/dashboard/bookings/hooks/useBookingValidation.ts - REFACTORED: Remove 1-day minimum for admin
"use client";

import { useState, useCallback } from "react";
import {
  AdminBookingFormData,
  CarData,
  UserData,
  BookingData,
} from "@/components/types";
import { FormValidationState } from "@/components/types";

interface UseBookingValidationReturn {
  errors: FormValidationState;
  validateForm: (formData: AdminBookingFormData) => boolean;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

export const useBookingValidation = (
  cars: CarData[],
  users: UserData[],
  existingBookings: BookingData[]
): UseBookingValidationReturn => {
  const [errors, setErrors] = useState<FormValidationState>({});

  // --- Clear Specific Error ---
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // --- Clear All Errors ---
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // --- Validate Time Format (HH:MM) ---
  const isValidTimeFormat = useCallback((time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }, []);

  // --- Convert Time to Minutes ---
  const timeToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }, []);

  // --- Calculate Duration in Minutes ---
  const calculateDurationMinutes = useCallback(
    (
      pickupDate: string,
      returnDate: string,
      pickupTime: string,
      returnTime: string
    ): number => {
      try {
        const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
        const returnDateTime = new Date(`${returnDate}T${returnTime}:00`);

        const durationMs = returnDateTime.getTime() - pickupDateTime.getTime();
        return Math.floor(durationMs / (1000 * 60));
      } catch (error) {
        console.error("Error calculating duration:", error);
        return 0;
      }
    },
    []
  );

  // --- Main Validation Function ---
  const validateForm = useCallback(
    (formData: AdminBookingFormData): boolean => {
      const newErrors: FormValidationState = {};

      console.log("Validating admin booking form:", formData);

      // --- Required Field Validation ---
      if (!formData.customerId || formData.customerId.trim() === "") {
        newErrors.customerId = "Customer selection is required";
      }

      if (!formData.vehicleId || formData.vehicleId.trim() === "") {
        newErrors.vehicleId = "Vehicle selection is required";
      }

      if (!formData.pickupDate || formData.pickupDate.trim() === "") {
        newErrors.pickupDate = "Pickup date is required";
      }

      if (!formData.returnDate || formData.returnDate.trim() === "") {
        newErrors.returnDate = "Return date is required";
      }

      if (!formData.pickupTime || formData.pickupTime.trim() === "") {
        newErrors.pickupTime = "Pickup time is required";
      }

      if (!formData.returnTime || formData.returnTime.trim() === "") {
        newErrors.returnTime = "Return time is required";
      }

      if (!formData.pickupLocation || formData.pickupLocation.trim() === "") {
        newErrors.pickupLocation = "Pickup location is required";
      }

      if (!formData.returnLocation || formData.returnLocation.trim() === "") {
        newErrors.returnLocation = "Return location is required";
      }

      // --- Customer Validation ---
      if (formData.customerId) {
        const customer = users.find((user) => user.id === formData.customerId);
        if (!customer) {
          newErrors.customerId = "Selected customer not found";
        } else if (customer.status !== "active") {
          newErrors.customerId = "Selected customer is not active";
        }
      }

      // --- Vehicle Validation ---
      if (formData.vehicleId) {
        const vehicle = cars.find((car) => car.id === formData.vehicleId);
        if (!vehicle) {
          newErrors.vehicleId = "Selected vehicle not found";
        } else if (!vehicle.available) {
          newErrors.vehicleId = "Selected vehicle is not available";
        }
      }

      // --- Date Validation ---
      if (formData.pickupDate && formData.returnDate) {
        const pickupDate = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);

        // Return date must be same day or after pickup date
        if (returnDate < pickupDate) {
          newErrors.returnDate = "Return date cannot be before pickup date";
        }
      }

      // --- Time Format Validation ---
      if (formData.pickupTime && !isValidTimeFormat(formData.pickupTime)) {
        newErrors.pickupTime = "Invalid time format (use HH:MM, e.g., 08:00)";
      }

      if (formData.returnTime && !isValidTimeFormat(formData.returnTime)) {
        newErrors.returnTime = "Invalid time format (use HH:MM, e.g., 18:00)";
      }

      // --- Duration Validation (Admin: minimum 15 minutes) ---
      if (
        formData.pickupDate &&
        formData.returnDate &&
        formData.pickupTime &&
        formData.returnTime &&
        isValidTimeFormat(formData.pickupTime) &&
        isValidTimeFormat(formData.returnTime)
      ) {
        const durationMinutes = calculateDurationMinutes(
          formData.pickupDate,
          formData.returnDate,
          formData.pickupTime,
          formData.returnTime
        );

        console.log("Calculated duration:", durationMinutes, "minutes");

        // Check minimum duration (15 minutes)
        if (durationMinutes < 15) {
          newErrors.returnTime = "Minimum rental duration is 15 minutes";
        }

        // For same-day bookings, ensure return time is after pickup time
        if (formData.pickupDate === formData.returnDate) {
          const pickupMinutes = timeToMinutes(formData.pickupTime);
          const returnMinutes = timeToMinutes(formData.returnTime);

          if (returnMinutes <= pickupMinutes) {
            newErrors.returnTime =
              "Return time must be after pickup time for same-day bookings";
          }
        }
      }

      // --- Location Validation ---
      const validLocations = [
        "Tangier Airport",
        "Tangier City Center",
        "Tangier Port",
        "Hotel Pickup",
        "Custom Location",
      ];

      if (
        formData.pickupLocation &&
        !validLocations.includes(formData.pickupLocation)
      ) {
        newErrors.pickupLocation = "Invalid pickup location selected";
      }

      if (
        formData.returnLocation &&
        !validLocations.includes(formData.returnLocation)
      ) {
        newErrors.returnLocation = "Invalid return location selected";
      }

      // --- Availability Validation (optional - backend will do final check) ---
      // Note: We skip this for now since the backend has the authoritative availability check
      // The frontend preview will show availability status in real-time

      console.log("Validation errors:", newErrors);
      console.log("Form is valid:", Object.keys(newErrors).length === 0);

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [
      cars,
      users,
      existingBookings,
      isValidTimeFormat,
      timeToMinutes,
      calculateDurationMinutes,
    ]
  );

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors,
  };
};
