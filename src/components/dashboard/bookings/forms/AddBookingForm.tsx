// src/components/dashboard/bookings/forms/AddBookingForm.tsx - Updated with translations
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

  // Form state - using AdminBookingFormData structure
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

  // Use validation hook (without existingBookings for now)
  const { errors, validateForm, clearError } = useBookingValidation(
    cars,
    users,
    [] // We'll handle availability check in the backend
  );

  // FIXED: Get selected entities properly
  const selectedCustomer = users.find(
    (user) => user.id === formData.customerId // Fixed: was using vehicleId
  );
  const selectedCar = cars.find((car) => car.id === formData.vehicleId);

  // Calculate booking details
  const calculateDays = (): number => {
    if (
      pickupDate &&
      returnDate &&
      formData.pickupTime &&
      formData.returnTime
    ) {
      // Calculate basic day difference
      const pickupDateObj = new Date(pickupDate.toDateString());
      const returnDateObj = new Date(returnDate.toDateString());
      const basicDays = Math.ceil(
        (returnDateObj.getTime() - pickupDateObj.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Apply your specific time logic
      const pickupTime = formData.pickupTime;
      const returnTime = formData.returnTime;

      // Convert times to minutes for easier comparison
      const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
      const [returnHour, returnMin] = returnTime.split(":").map(Number);

      const pickupMinutes = pickupHour * 60 + pickupMin;
      const returnMinutes = returnHour * 60 + returnMin;

      // Your logic: if return time is more than 1 hour after pickup time, add 1 day
      const timeDifference = returnMinutes - pickupMinutes;
      const oneHourInMinutes = 60;

      let rentalDays = basicDays;

      // If return time exceeds pickup time by more than 1 hour, add extra day
      if (timeDifference > oneHourInMinutes) {
        rentalDays += 1;
      }

      return Math.max(1, rentalDays);
    }
    return 0;
  };
  const days = calculateDays();
  const totalAmount = selectedCar ? selectedCar.price * days : 0;

  // Handle input changes
  const handleInputChange = (
    field: keyof AdminBookingFormData,
    value: string
  ) => {
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
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("bookings.form.title")}
        </h2>
        <p className="text-gray-600 text-sm">
          {t("bookings.form.description")}
        </p>
      </div>

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
              cars={cars.filter(
                (car) => car.available && car.status === "active"
              )}
              selectedCarId={formData.vehicleId}
              selectedCar={selectedCar}
              onCarChange={(carId) => handleInputChange("vehicleId", carId)}
              error={errors.vehicleId}
            />

            {/* Date and Time Selection - UPDATED: Pass selectedCarId */}
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

            {/* Admin Booking Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">
                {t("bookings.form.adminNotice.title")}
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("bookings.form.adminNotice.autoConfirmed")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    {t("bookings.form.adminNotice.noPaymentRequired")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("bookings.form.adminNotice.customerNotified")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("bookings.form.adminNotice.vehicleReserved")}</span>
                </li>
              </ul>
            </div>
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
