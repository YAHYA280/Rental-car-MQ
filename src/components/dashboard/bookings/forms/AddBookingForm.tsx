// src/components/dashboard/bookings/forms/AddBookingForm.tsx - REFACTORED: Updated calculation logic
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AdminBookingFormData, CarData, UserData } from "@/components/types";

// Import form sections
import CustomerSelectionSection from "./sections/CustomerSelectionSection";
import VehicleSelectionSection from "./sections/VehicleSelectionSection";
import DateTimeSection from "./sections/DateTimeSection";
import LocationsSection from "./sections/LocationsSection";
import BookingSummary from "./sections/BookingSummary";

// Import validation hook
import { useBookingValidation } from "../hooks/useBookingValidation";

interface AddBookingFormProps {
  cars: CarData[];
  users: UserData[];
  onSubmit: (data: AdminBookingFormData) => Promise<void>;
  onClose: () => void;
}

const AddBookingForm: React.FC<AddBookingFormProps> = ({
  cars,
  users,
  onSubmit,
  onClose,
}) => {
  const t = useTranslations("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState<AdminBookingFormData>({
    customerId: "",
    vehicleId: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    pickupLocation: "",
    returnLocation: "",
  });

  // Date states for calendar components
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();

  // Use validation hook
  const { errors, validateForm, clearError } = useBookingValidation(
    cars,
    users,
    [] // We'll handle availability check in the backend
  );

  // --- Get Selected Entities ---
  const selectedCustomer = users.find(
    (user) => user.id === formData.customerId
  );
  const selectedCar = cars.find((car) => car.id === formData.vehicleId);

  // --- Calculate Charged Days (Frontend Preview - matches backend logic) ---
  const calculateChargedDays = (): number => {
    if (
      !pickupDate ||
      !returnDate ||
      !formData.pickupTime ||
      !formData.returnTime
    ) {
      return 0;
    }

    try {
      const pickupDateTime = new Date(
        `${formData.pickupDate}T${formData.pickupTime}:00`
      );
      const returnDateTime = new Date(
        `${formData.returnDate}T${formData.returnTime}:00`
      );

      // Total duration in minutes
      const totalMinutes = Math.floor(
        (returnDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60)
      );

      if (totalMinutes < 0) return 0;

      // Calculate full 24-hour blocks
      const fullDays = Math.floor(totalMinutes / 1440); // 1440 = 24 * 60

      // Calculate lateness (remainder beyond full days)
      const latenessMinutes = totalMinutes - fullDays * 1440;

      // Apply lateness rule: >= 90 minutes adds +1 day
      const chargedDays = fullDays + (latenessMinutes >= 90 ? 1 : 0);

      return Math.max(1, chargedDays); // Minimum 1 day charged
    } catch (error) {
      console.error("Error calculating charged days:", error);
      return 1;
    }
  };

  const chargedDays = calculateChargedDays();
  const totalAmount = selectedCar ? selectedCar.price * chargedDays : 0;

  // --- Handle Input Changes ---
  const handleInputChange = (
    field: keyof AdminBookingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  // --- Handle Date Changes ---
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

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting booking form:", formData);

    if (!validateForm(formData)) {
      console.log("Validation failed:", errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);

      // Reset form on success
      setFormData({
        customerId: "",
        vehicleId: "",
        pickupDate: "",
        returnDate: "",
        pickupTime: "",
        returnTime: "",
        pickupLocation: "",
        returnLocation: "",
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- Left Column --- */}
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
              cars={cars.filter(
                (car) => car.available && car.status === "active"
              )}
              selectedCarId={formData.vehicleId}
              selectedCar={selectedCar}
              onCarChange={(carId) => handleInputChange("vehicleId", carId)}
              error={errors.vehicleId}
            />

            {/* Date and Time Selection */}
            <DateTimeSection
              pickupDate={pickupDate}
              returnDate={returnDate}
              pickupTime={formData.pickupTime}
              returnTime={formData.returnTime}
              selectedCarId={formData.vehicleId}
              onPickupDateChange={(date) => handleDateChange(date, "pickup")}
              onReturnDateChange={(date) => handleDateChange(date, "return")}
              onPickupTimeChange={(time) =>
                handleInputChange("pickupTime", time)
              }
              onReturnTimeChange={(time) =>
                handleInputChange("returnTime", time)
              }
              errors={errors}
            />
          </div>

          {/* --- Right Column --- */}
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
            {selectedCustomer && selectedCar && chargedDays > 0 && (
              <BookingSummary
                customer={selectedCustomer}
                car={selectedCar}
                days={chargedDays}
                totalAmount={totalAmount}
                pickupTime={formData.pickupTime}
                returnTime={formData.returnTime}
                pickupDate={formData.pickupDate}
                returnDate={formData.returnDate}
              />
            )}

            {/* Progress Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                {t("bookings.form.progress.title")}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">
                    {t("bookings.form.progress.customer")}:
                  </span>
                  <span
                    className={`font-medium ${
                      selectedCustomer ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {selectedCustomer ? "✓" : "○"}{" "}
                    {selectedCustomer
                      ? t("bookings.form.progress.selected")
                      : t("bookings.form.progress.pending")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">
                    {t("bookings.form.progress.vehicle")}:
                  </span>
                  <span
                    className={`font-medium ${
                      selectedCar ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {selectedCar ? "✓" : "○"}{" "}
                    {selectedCar
                      ? t("bookings.form.progress.selected")
                      : t("bookings.form.progress.pending")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">
                    {t("bookings.form.progress.dates")}:
                  </span>
                  <span
                    className={`font-medium ${
                      pickupDate && returnDate
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {pickupDate && returnDate ? "✓" : "○"}{" "}
                    {pickupDate && returnDate
                      ? t("bookings.form.progress.selected")
                      : t("bookings.form.progress.pending")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">
                    {t("bookings.form.progress.locations")}:
                  </span>
                  <span
                    className={`font-medium ${
                      formData.pickupLocation && formData.returnLocation
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.pickupLocation && formData.returnLocation
                      ? "✓"
                      : "○"}{" "}
                    {formData.pickupLocation && formData.returnLocation
                      ? t("bookings.form.progress.selected")
                      : t("bookings.form.progress.pending")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Form Actions --- */}
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
              isSubmitting ||
              !selectedCar ||
              !selectedCustomer ||
              chargedDays < 1
            }
          >
            {isSubmitting
              ? t("bookings.form.creating")
              : t("bookings.form.createBooking")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBookingForm;
