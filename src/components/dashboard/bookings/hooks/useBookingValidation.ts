// src/components/dashboard/bookings/hooks/useBookingValidation.ts - FIXED
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

  // Clear specific error
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Check if vehicle is available for the given period
  const isVehicleAvailable = useCallback(
    (vehicleId: string, pickupDate: string, returnDate: string): boolean => {
      const conflictingBookings = existingBookings.filter(
        (booking) =>
          booking.vehicleId === vehicleId &&
          (booking.status === "confirmed" || booking.status === "active") &&
          !(
            new Date(returnDate) <= new Date(booking.pickupDate) ||
            new Date(pickupDate) >= new Date(booking.returnDate)
          )
      );
      return conflictingBookings.length === 0;
    },
    [existingBookings]
  );

  // Validate time format (HH:MM)
  const isValidTimeFormat = useCallback((time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }, []);

  // Calculate days between dates
  const calculateDays = useCallback(
    (pickupDate: string, returnDate: string): number => {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    },
    []
  );

  // Convert time string to minutes for comparison
  const timeToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }, []);

  // FIXED: Main validation function
  const validateForm = useCallback(
    (formData: AdminBookingFormData): boolean => {
      const newErrors: FormValidationState = {};

      console.log("Validating form data:", formData);

      // FIXED: Required field validation with proper checks
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

      // Customer validation
      if (formData.customerId) {
        const customer = users.find((user) => user.id === formData.customerId);
        if (!customer) {
          newErrors.customerId = "Selected customer not found";
        } else if (customer.status !== "active") {
          newErrors.customerId = "Selected customer is not active";
        }
      }

      // Vehicle validation
      if (formData.vehicleId) {
        const vehicle = cars.find((car) => car.id === formData.vehicleId);
        if (!vehicle) {
          newErrors.vehicleId = "Selected vehicle not found";
        } else if (!vehicle.available) {
          newErrors.vehicleId = "Selected vehicle is not available";
        }
      }

      // Date validation
      if (formData.pickupDate && formData.returnDate) {
        const pickupDate = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if return date is after pickup date
        if (returnDate <= pickupDate) {
          newErrors.returnDate = "Return date must be after pickup date";
        }

        // Check minimum rental period
        const days = calculateDays(formData.pickupDate, formData.returnDate);
        if (days < 1) {
          newErrors.returnDate = "Minimum 1 day rental period required";
        }

        // Check same-day booking time logic
        if (
          pickupDate.toDateString() === returnDate.toDateString() &&
          formData.pickupTime &&
          formData.returnTime
        ) {
          const pickupMinutes = timeToMinutes(formData.pickupTime);
          const returnMinutes = timeToMinutes(formData.returnTime);

          if (returnMinutes <= pickupMinutes) {
            newErrors.returnTime =
              "Return time must be after pickup time for same-day bookings";
          }
        }
      }

      // Time format validation
      if (formData.pickupTime && !isValidTimeFormat(formData.pickupTime)) {
        newErrors.pickupTime = "Invalid time format (use HH:MM)";
      }

      if (formData.returnTime && !isValidTimeFormat(formData.returnTime)) {
        newErrors.returnTime = "Invalid time format (use HH:MM)";
      }

      // Location validation
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

      // Availability validation - only if we have existing bookings data
      if (
        existingBookings.length > 0 &&
        formData.vehicleId &&
        formData.pickupDate &&
        formData.returnDate
      ) {
        if (
          !isVehicleAvailable(
            formData.vehicleId,
            formData.pickupDate,
            formData.returnDate
          )
        ) {
          const conflictingBookings = existingBookings.filter(
            (booking) =>
              booking.vehicleId === formData.vehicleId &&
              (booking.status === "confirmed" || booking.status === "active") &&
              !(
                new Date(formData.returnDate) <= new Date(booking.pickupDate) ||
                new Date(formData.pickupDate) >= new Date(booking.returnDate)
              )
          );

          const conflictDetails = conflictingBookings
            .map(
              (booking) =>
                `${booking.bookingNumber} (${new Date(
                  booking.pickupDate
                ).toLocaleDateString()} - ${new Date(
                  booking.returnDate
                ).toLocaleDateString()})`
            )
            .join(", ");

          newErrors.vehicleId = `Vehicle not available for selected dates. Conflicting bookings: ${conflictDetails}`;
        }
      }

      console.log("Validation errors:", newErrors);
      console.log("Form is valid:", Object.keys(newErrors).length === 0);

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [
      cars,
      users,
      existingBookings,
      isVehicleAvailable,
      isValidTimeFormat,
      calculateDays,
      timeToMinutes,
    ]
  );

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors,
  };
};
