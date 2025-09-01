// src/components/dashboard/bookings/hooks/useBookingValidation.ts
"use client";

import { useState, useCallback } from "react";
import {
  BookingFormData,
  CarData,
  UserData,
  BookingData,
  FormValidationState,
} from "../types/bookingTypes";

interface UseBookingValidationReturn {
  errors: FormValidationState;
  validateForm: (formData: BookingFormData) => boolean;
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
    (carId: string, pickupDate: string, returnDate: string): boolean => {
      const conflictingBookings = existingBookings.filter(
        (booking) =>
          booking.car.id === carId &&
          (booking.status === "confirmed" || booking.status === "active") &&
          !(
            new Date(returnDate) <= new Date(booking.dates.pickup) ||
            new Date(pickupDate) >= new Date(booking.dates.return)
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

  // Main validation function
  const validateForm = useCallback(
    (formData: BookingFormData): boolean => {
      const newErrors: FormValidationState = {};

      // Required field validation
      if (!formData.customerId?.trim()) {
        newErrors.customerId = "Customer selection is required";
      }

      if (!formData.carId?.trim()) {
        newErrors.carId = "Vehicle selection is required";
      }

      if (!formData.pickupDate?.trim()) {
        newErrors.pickupDate = "Pickup date is required";
      }

      if (!formData.returnDate?.trim()) {
        newErrors.returnDate = "Return date is required";
      }

      if (!formData.pickupTime?.trim()) {
        newErrors.pickupTime = "Pickup time is required";
      }

      if (!formData.returnTime?.trim()) {
        newErrors.returnTime = "Return time is required";
      }

      if (!formData.pickupLocation?.trim()) {
        newErrors.pickupLocation = "Pickup location is required";
      }

      if (!formData.returnLocation?.trim()) {
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
      if (formData.carId) {
        const vehicle = cars.find((car) => car.id === formData.carId);
        if (!vehicle) {
          newErrors.carId = "Selected vehicle not found";
        } else if (!vehicle.available) {
          newErrors.carId = "Selected vehicle is not available";
        }
      }

      // Date validation
      if (formData.pickupDate && formData.returnDate) {
        const pickupDate = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if pickup date is in the past
        if (pickupDate < today) {
          newErrors.pickupDate = "Pickup date cannot be in the past";
        }

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

      // Availability validation
      if (formData.carId && formData.pickupDate && formData.returnDate) {
        if (
          !isVehicleAvailable(
            formData.carId,
            formData.pickupDate,
            formData.returnDate
          )
        ) {
          const conflictingBookings = existingBookings.filter(
            (booking) =>
              booking.car.id === formData.carId &&
              (booking.status === "confirmed" || booking.status === "active") &&
              !(
                new Date(formData.returnDate) <=
                  new Date(booking.dates.pickup) ||
                new Date(formData.pickupDate) >= new Date(booking.dates.return)
              )
          );

          const conflictDetails = conflictingBookings
            .map(
              (booking) =>
                `${booking.id} (${new Date(
                  booking.dates.pickup
                ).toLocaleDateString()} - ${new Date(
                  booking.dates.return
                ).toLocaleDateString()})`
            )
            .join(", ");

          newErrors.carId = `Vehicle not available for selected dates. Conflicting bookings: ${conflictDetails}`;
        }
      }

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
