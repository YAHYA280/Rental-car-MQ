// src/components/dashboard/bookings/forms/AddBookingForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  BookingFormData,
  CarData,
  UserData,
  BookingData,
} from "../types/bookingTypes";

// Import form sections
import CustomerSelectionSection from "./sections/CustomerSelectionSection";
import VehicleSelectionSection from "./sections/VehicleSelectionSection";
import DateTimeSection from "./sections/DateTimeSection";
import LocationsSection from "./sections/LocationsSection";
import NotesSection from "./sections/NotesSection";
import BookingSummary from "./sections/BookingSummary";

// Import validation hook
import { useBookingValidation } from "../hooks/useBookingValidation";

interface AddBookingFormProps {
  cars: CarData[];
  users: UserData[];
  existingBookings: BookingData[];
  onSubmit: (data: BookingFormData) => Promise<void>;
  onClose: () => void;
}

const AddBookingForm: React.FC<AddBookingFormProps> = ({
  cars,
  users,
  existingBookings,
  onSubmit,
  onClose,
}) => {
  const t = useTranslations("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    customerId: "",
    carId: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    pickupLocation: "",
    returnLocation: "",
    notes: "", // Ensure notes is always a string, not undefined
  });

  // Date states for calendar components
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();

  // Use validation hook
  const { errors, validateForm, clearError } = useBookingValidation(
    cars,
    users,
    existingBookings
  );

  // Get selected entities
  const selectedCustomer = users.find(
    (user) => user.id === formData.customerId
  );
  const selectedCar = cars.find((car) => car.id === formData.carId);

  // Calculate booking details
  const calculateDays = (): number => {
    if (pickupDate && returnDate) {
      const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
    return 0;
  };

  const days = calculateDays();
  const totalAmount = selectedCar ? selectedCar.price * days : 0;

  // Handle input changes
  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  // Handle date changes
  const handleDateChange = (
    date: Date | undefined,
    field: "pickup" | "return"
  ) => {
    if (date) {
      const dateString = date.toISOString().split("T")[0];
      if (field === "pickup") {
        setPickupDate(date);
        handleInputChange("pickupDate", dateString);
      } else {
        setReturnDate(date);
        handleInputChange("returnDate", dateString);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        customerId: "",
        carId: "",
        pickupDate: "",
        returnDate: "",
        pickupTime: "",
        returnTime: "",
        pickupLocation: "",
        returnLocation: "",
        notes: "", // Ensure notes is always a string
      });
      setPickupDate(undefined);
      setReturnDate(undefined);
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Customer Selection */}
          <CustomerSelectionSection
            users={users.filter((user) => user.status === "active")}
            selectedCustomerId={formData.customerId}
            selectedCustomer={selectedCustomer}
            onCustomerChange={(customerId) =>
              handleInputChange("customerId", customerId)
            }
            error={errors.customerId}
          />

          {/* Vehicle Selection */}
          <VehicleSelectionSection
            cars={cars.filter((car) => car.available)}
            selectedCarId={formData.carId}
            selectedCar={selectedCar}
            onCarChange={(carId) => handleInputChange("carId", carId)}
            error={errors.carId}
          />

          {/* Date and Time Selection */}
          <DateTimeSection
            pickupDate={pickupDate}
            returnDate={returnDate}
            pickupTime={formData.pickupTime}
            returnTime={formData.returnTime}
            onPickupDateChange={(date) => handleDateChange(date, "pickup")}
            onReturnDateChange={(date) => handleDateChange(date, "return")}
            onPickupTimeChange={(time) => handleInputChange("pickupTime", time)}
            onReturnTimeChange={(time) => handleInputChange("returnTime", time)}
            errors={errors}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Locations */}
          <LocationsSection
            pickupLocation={formData.pickupLocation}
            returnLocation={formData.returnLocation}
            onPickupLocationChange={(location) =>
              handleInputChange("pickupLocation", location)
            }
            onReturnLocationChange={(location) =>
              handleInputChange("returnLocation", location)
            }
            errors={errors}
          />

          {/* Booking Summary */}
          {selectedCustomer && selectedCar && days > 0 && (
            <BookingSummary
              customer={selectedCustomer}
              car={selectedCar}
              days={days}
              totalAmount={totalAmount}
            />
          )}

          {/* Notes Section */}
          <NotesSection
            notes={formData.notes || ""} // Ensure we pass a string, not undefined
            onNotesChange={(notes) => handleInputChange("notes", notes || "")}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
          disabled={
            isSubmitting || !selectedCar || !selectedCustomer || days < 1
          }
        >
          {isSubmitting ? "Creating Booking..." : "Create Booking"}
        </Button>
      </div>
    </form>
  );
};

export default AddBookingForm;
