// src/components/dashboard/bookings/forms/sections/DateTimeSection.tsx - REFACTORED: Custom time input with full control
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  Loader2,
  Info,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FormValidationState } from "@/components/types";
import { bookingService } from "@/services/bookingService";
import { toast } from "sonner";

interface DateTimeSectionProps {
  pickupDate: Date | undefined;
  returnDate: Date | undefined;
  pickupTime: string;
  returnTime: string;
  selectedCarId: string;
  onPickupDateChange: (date: Date | undefined) => void;
  onReturnDateChange: (date: Date | undefined) => void;
  onPickupTimeChange: (time: string) => void;
  onReturnTimeChange: (time: string) => void;
  errors: FormValidationState;
}

// --- Pricing Preview Interface ---
interface PricingPreview {
  durationMinutes: number;
  durationHours: string;
  fullDays: number;
  latenessMinutes: number;
  chargedDays: number;
  latenessFeeApplied: boolean;
  dailyRate: number;
  totalAmount: number;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  pickupDate,
  returnDate,
  pickupTime,
  returnTime,
  selectedCarId,
  onPickupDateChange,
  onReturnDateChange,
  onPickupTimeChange,
  onReturnTimeChange,
  errors,
}) => {
  const t = useTranslations("dashboard");

  // --- State ---
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [vehicleAvailability, setVehicleAvailability] = useState<{
    available: boolean;
    currentBooking?: any;
    upcomingBooking?: any;
    nextAvailableDate?: string;
    nextAvailableTime?: string;
  }>({ available: true });
  const [pricingPreview, setPricingPreview] = useState<PricingPreview | null>(
    null
  );

  // --- Load Vehicle Calendar ---
  useEffect(() => {
    if (selectedCarId) {
      loadVehicleCalendar(selectedCarId);
    } else {
      setBlockedDates([]);
      setVehicleAvailability({ available: true });
    }
  }, [selectedCarId]);

  // --- Load Pricing Preview When Times Change ---
  useEffect(() => {
    if (pickupDate && returnDate && pickupTime && returnTime && selectedCarId) {
      loadPricingPreview();
    } else {
      setPricingPreview(null);
    }
  }, [pickupDate, returnDate, pickupTime, returnTime, selectedCarId]);

  // --- Load Vehicle Calendar ---
  const loadVehicleCalendar = async (vehicleId: string) => {
    try {
      setIsLoadingCalendar(true);

      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 90);

      const response = await bookingService.getVehicleCalendar(
        vehicleId,
        format(today, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      if (response.success && response.data) {
        setBlockedDates(response.data.blockedDates || []);
        setVehicleAvailability({
          available: response.data.available,
          nextAvailableDate: response.data.nextAvailableDate,
          nextAvailableTime: response.data.nextAvailableTime,
          currentBooking: response.data.currentBooking,
          upcomingBooking: response.data.upcomingBooking,
        });

        if (!response.data.available && response.data.nextAvailableDate) {
          const dateStr = format(
            new Date(response.data.nextAvailableDate),
            "MMM dd, yyyy"
          );
          const timeStr = response.data.nextAvailableTime || "any time";

          toast.info("Vehicle availability updated", {
            description: `Next available: ${dateStr} at ${timeStr}`,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Error loading vehicle calendar:", error);
      toast.error("Error loading availability", {
        description:
          "Could not load vehicle availability. Dates may not be accurate.",
      });
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  // --- Load Pricing Preview ---
  const loadPricingPreview = async () => {
    if (
      !pickupDate ||
      !returnDate ||
      !pickupTime ||
      !returnTime ||
      !selectedCarId
    ) {
      return;
    }

    try {
      setIsLoadingPreview(true);

      const pickupDateStr = format(pickupDate, "yyyy-MM-dd");
      const returnDateStr = format(returnDate, "yyyy-MM-dd");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/bookings/preview-availability/${selectedCarId}?pickupDate=${pickupDateStr}&returnDate=${returnDateStr}&pickupTime=${pickupTime}&returnTime=${returnTime}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data.pricing) {
        setPricingPreview(data.data.pricing);
      }
    } catch (error) {
      console.error("Error loading pricing preview:", error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // --- Validate Time Format (HH:MM) ---
  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // --- Format Time Input (auto-format as user types) ---
  const formatTimeInput = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format based on length
    if (digits.length === 0) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;

    // Limit to 4 digits (HH:MM)
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  // --- Handle Time Input Change ---
  const handleTimeInputChange = (
    value: string,
    setter: (time: string) => void
  ) => {
    const formatted = formatTimeInput(value);
    setter(formatted);
  };

  // --- Handle Time Input Blur (validation) ---
  const handleTimeInputBlur = (
    value: string,
    setter: (time: string) => void,
    fieldName: string
  ) => {
    if (!value) return;

    if (!validateTimeFormat(value)) {
      toast.error(`Invalid ${fieldName}`, {
        description: "Please enter time in HH:MM format (e.g., 08:00, 14:30)",
      });
      return;
    }

    // Validate hour and minute ranges
    const [hour, minute] = value.split(":").map(Number);

    if (hour > 23) {
      toast.error(`Invalid ${fieldName}`, {
        description: "Hour must be between 00 and 23",
      });
      setter("23:59");
      return;
    }

    if (minute > 59) {
      toast.error(`Invalid ${fieldName}`, {
        description: "Minute must be between 00 and 59",
      });
      const correctedTime = `${String(hour).padStart(2, "0")}:59`;
      setter(correctedTime);
      return;
    }

    // Format to ensure leading zeros
    const formattedTime = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    setter(formattedTime);
  };

  // --- Quick Time Presets ---
  const quickTimePresets = [
    { label: "00:00", value: "00:00" },
    { label: "06:00", value: "06:00" },
    { label: "08:00", value: "08:00" },
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "12:00", value: "12:00" },
    { label: "14:00", value: "14:00" },
    { label: "16:00", value: "16:00" },
    { label: "18:00", value: "18:00" },
    { label: "20:00", value: "20:00" },
    { label: "23:59", value: "23:59" },
  ];

  // --- Check if Date is Blocked ---
  const isDateBlocked = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.includes(dateStr);
  };

  // --- Date Change Handlers ---
  const handlePickupDateChange = (date: Date | undefined) => {
    onPickupDateChange(date);
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date && pickupDate) {
      // Check for blocked dates in range
      const currentDate = new Date(pickupDate);
      let hasBlockedDate = false;
      let blockedDate = "";

      while (currentDate <= date) {
        if (isDateBlocked(currentDate)) {
          hasBlockedDate = true;
          blockedDate = format(currentDate, "MMM dd, yyyy");
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (hasBlockedDate) {
        toast.error(`Date not available: ${blockedDate}`, {
          description: "Please select different dates.",
        });
        return;
      }
    }

    onReturnDateChange(date);
  };

  // --- Calculate Duration ---
  const getDurationInfo = () => {
    if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
      return null;
    }

    if (!pricingPreview) {
      return null;
    }

    const hours = parseFloat(pricingPreview.durationHours);
    const isSameDay = pickupDate.toDateString() === returnDate.toDateString();

    return {
      minutes: pricingPreview.durationMinutes,
      hours: hours,
      days: pricingPreview.fullDays,
      chargedDays: pricingPreview.chargedDays,
      isSameDay,
      isSubDay: hours < 24,
      latenessMinutes: pricingPreview.latenessMinutes,
      latenessFeeApplied: pricingPreview.latenessFeeApplied,
    };
  };

  const durationInfo = getDurationInfo();

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {t("bookings.form.dateTime.title")}
          <span className="text-sm font-normal text-green-600 bg-green-50 px-2 py-1 rounded">
            ✓ Any duration allowed
          </span>
        </h3>

        <div className="space-y-4">
          {/* --- Vehicle Availability Status --- */}
          {selectedCarId && (
            <div className="mb-4">
              {isLoadingCalendar ? (
                <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">
                    Loading availability...
                  </span>
                </div>
              ) : vehicleAvailability.available ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {vehicleAvailability.upcomingBooking
                      ? `Available until ${format(
                          new Date(
                            vehicleAvailability.upcomingBooking.pickupDate
                          ),
                          "MMM dd"
                        )}`
                      : "Vehicle available now"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Vehicle not available
                    </span>
                  </div>
                  {vehicleAvailability.nextAvailableDate && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <CalendarIcon className="h-3 w-3" />
                        <span className="font-medium">
                          Available from:{" "}
                          {format(
                            new Date(vehicleAvailability.nextAvailableDate),
                            "dd MMM yyyy"
                          )}
                        </span>
                      </div>
                      {vehicleAvailability.nextAvailableTime && (
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">
                            From: {vehicleAvailability.nextAvailableTime}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* --- Date Selection --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Date */}
            <div>
              <Label>Pickup Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !pickupDate && "text-muted-foreground",
                      errors.pickupDate && "border-red-500"
                    )}
                    disabled={isLoadingCalendar || !selectedCarId}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate
                      ? format(pickupDate, "PPP")
                      : "Select pickup date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={handlePickupDateChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return true;
                      return isDateBlocked(date);
                    }}
                    modifiers={{
                      booked: (date) => isDateBlocked(date),
                    }}
                    modifiersStyles={{
                      booked: {
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        textDecoration: "line-through",
                        opacity: 0.4,
                      },
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.pickupDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.pickupDate}
                </p>
              )}
            </div>

            {/* Return Date */}
            <div>
              <Label>Return Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !returnDate && "text-muted-foreground",
                      errors.returnDate && "border-red-500"
                    )}
                    disabled={
                      isLoadingCalendar || !selectedCarId || !pickupDate
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate
                      ? format(returnDate, "PPP")
                      : "Select return date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={handleReturnDateChange}
                    disabled={(date) => {
                      if (!pickupDate) return true;

                      const pickupUTC = new Date(
                        Date.UTC(
                          pickupDate.getFullYear(),
                          pickupDate.getMonth(),
                          pickupDate.getDate()
                        )
                      );
                      const dateUTC = new Date(
                        Date.UTC(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate()
                        )
                      );

                      // Allow same day
                      if (dateUTC < pickupUTC) return true;
                      return isDateBlocked(date);
                    }}
                    modifiers={{
                      booked: (date) => isDateBlocked(date),
                    }}
                    modifiersStyles={{
                      booked: {
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        textDecoration: "line-through",
                        opacity: 0.4,
                      },
                    }}
                    initialFocus
                  />

                  {/* Calendar Legend */}
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded opacity-40"></div>
                        <span>Booked</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {errors.returnDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.returnDate}
                </p>
              )}
            </div>
          </div>

          {/* --- Custom Time Input (Full Control) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Time */}
            <div>
              <Label htmlFor="pickupTime">Pickup Time (HH:MM) *</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="pickupTime"
                  type="text"
                  value={pickupTime}
                  onChange={(e) =>
                    handleTimeInputChange(e.target.value, onPickupTimeChange)
                  }
                  onBlur={(e) =>
                    handleTimeInputBlur(
                      e.target.value,
                      onPickupTimeChange,
                      "pickup time"
                    )
                  }
                  placeholder="08:00"
                  className={cn("pl-10", errors.pickupTime && "border-red-500")}
                  maxLength={5}
                />
              </div>
              {errors.pickupTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.pickupTime}
                </p>
              )}

              {/* Quick Presets */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Quick select:</p>
                <div className="flex flex-wrap gap-1">
                  {quickTimePresets.slice(0, 6).map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => onPickupTimeChange(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Return Time */}
            <div>
              <Label htmlFor="returnTime">Return Time (HH:MM) *</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="returnTime"
                  type="text"
                  value={returnTime}
                  onChange={(e) =>
                    handleTimeInputChange(e.target.value, onReturnTimeChange)
                  }
                  onBlur={(e) =>
                    handleTimeInputBlur(
                      e.target.value,
                      onReturnTimeChange,
                      "return time"
                    )
                  }
                  placeholder="18:00"
                  className={cn("pl-10", errors.returnTime && "border-red-500")}
                  maxLength={5}
                />
              </div>
              {errors.returnTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.returnTime}
                </p>
              )}

              {/* Quick Presets */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Quick select:</p>
                <div className="flex flex-wrap gap-1">
                  {quickTimePresets.slice(6).map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => onReturnTimeChange(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!selectedCarId && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Info className="h-4 w-4" />
                <span className="text-sm">
                  Select a vehicle first to see availability and pricing
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTimeSection;
