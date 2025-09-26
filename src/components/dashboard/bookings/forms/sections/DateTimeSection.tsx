// src/components/dashboard/bookings/forms/sections/DateTimeSection.tsx - FIXED: Integrated vehicle calendar
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { DateRange } from "react-day-picker";

interface DateTimeSectionProps {
  pickupDate: Date | undefined;
  returnDate: Date | undefined;
  pickupTime: string;
  returnTime: string;
  selectedCarId: string; // NEW: Vehicle ID for calendar loading
  onPickupDateChange: (date: Date | undefined) => void;
  onReturnDateChange: (date: Date | undefined) => void;
  onPickupTimeChange: (time: string) => void;
  onReturnTimeChange: (time: string) => void;
  errors: FormValidationState;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  pickupDate,
  returnDate,
  pickupTime,
  returnTime,
  selectedCarId, // NEW
  onPickupDateChange,
  onReturnDateChange,
  onPickupTimeChange,
  onReturnTimeChange,
  errors,
}) => {
  const t = useTranslations("dashboard");

  // NEW: State for vehicle calendar
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [vehicleAvailability, setVehicleAvailability] = useState<{
    available: boolean;
    currentBooking?: any;
    upcomingBooking?: any;
    nextAvailableDate?: string;
  }>({ available: true });

  // NEW: Date range state for better UX
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (pickupDate && returnDate) {
      return {
        from: pickupDate,
        to: returnDate,
      };
    }
    return undefined;
  });

  // Debug logging
  console.log("DateTimeSection:", {
    pickupDate,
    returnDate,
    pickupTime,
    returnTime,
    selectedCarId,
    errors,
  });

  // Generate time slots
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  // NEW: Load vehicle calendar when vehicle is selected
  useEffect(() => {
    if (selectedCarId) {
      loadVehicleCalendar(selectedCarId);
    } else {
      // Clear calendar data when no vehicle selected
      setBlockedDates([]);
      setVehicleAvailability({ available: true });
    }
  }, [selectedCarId]);

  // NEW: Load vehicle calendar and blocked dates from backend
  const loadVehicleCalendar = async (vehicleId: string) => {
    try {
      setIsLoadingCalendar(true);

      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 90);

      console.log(`Loading calendar for vehicle: ${vehicleId}`);

      const response = await bookingService.getVehicleCalendar(
        vehicleId,
        format(today, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      if (response.success && response.data) {
        console.log("Calendar data loaded:", response.data);

        setBlockedDates(response.data.blockedDates || []);
        setVehicleAvailability({
          available: response.data.available,
          nextAvailableDate: response.data.nextAvailableDate,
          currentBooking: response.data.currentBooking,
          upcomingBooking: response.data.upcomingBooking,
        });

        // Show availability status
        if (!response.data.available && response.data.nextAvailableDate) {
          toast.info("Vehicle availability updated", {
            description: `Next available: ${format(
              new Date(response.data.nextAvailableDate),
              "MMM dd, yyyy"
            )}`,
          });
        } else if (response.data.available && response.data.upcomingBooking) {
          toast.info("Vehicle availability loaded", {
            description: `Available until ${format(
              new Date(response.data.upcomingBooking.pickupDate),
              "MMM dd"
            )}`,
          });
        }
      }
    } catch (error) {
      console.error("Error loading vehicle calendar:", error);
      toast.error("Failed to load vehicle availability", {
        description: "Some dates might not be accurate",
      });
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  // NEW: Check if a date is blocked
  const isDateBlocked = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.includes(dateStr);
  };

  // NEW: Enhanced date range selection with blocking validation
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setDateRange(undefined);
      onPickupDateChange(undefined);
      onReturnDateChange(undefined);
      return;
    }

    // If only 'from' date is selected, allow it
    if (range.from && !range.to) {
      // Check if pickup date is blocked
      if (isDateBlocked(range.from)) {
        toast.error("Selected pickup date is not available", {
          description: "Please choose an available date",
        });
        return;
      }

      setDateRange(range);
      onPickupDateChange(range.from);
      onReturnDateChange(undefined);
      return;
    }

    // Check if any date in the range is blocked
    if (range.from && range.to) {
      const currentDate = new Date(range.from);
      const endDate = new Date(range.to);

      let hasBlockedDate = false;
      let blockedDate = "";

      while (currentDate <= endDate) {
        if (isDateBlocked(currentDate)) {
          hasBlockedDate = true;
          blockedDate = format(currentDate, "MMM dd, yyyy");
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (hasBlockedDate) {
        toast.error(`${blockedDate} is not available`, {
          description: "Please select only available dates",
        });
        return;
      }
    }

    // If we get here, the selection is valid
    setDateRange(range);
    if (range.from) {
      onPickupDateChange(range.from);
    }
    if (range.to) {
      onReturnDateChange(range.to);

      toast.success("Dates selected successfully!", {
        duration: 2000,
      });
    }
  };

  // Calculate rental duration with time logic
  const calculateDuration = () => {
    if (pickupDate && returnDate && pickupTime && returnTime) {
      // Basic day calculation
      const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime());
      const basicDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Apply time logic
      const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
      const [returnHour, returnMin] = returnTime.split(":").map(Number);

      const pickupMinutes = pickupHour * 60 + pickupMin;
      const returnMinutes = returnHour * 60 + returnMin;

      // Your logic: if return time is more than 1 hour after pickup time, add 1 day
      const timeDifference = returnMinutes - pickupMinutes;
      const oneHourInMinutes = 60;

      let rentalDays = basicDays;

      if (timeDifference > oneHourInMinutes) {
        rentalDays += 1;
      }

      return Math.max(1, rentalDays);
    }
    return 0;
  };

  const duration = calculateDuration();

  // Check if same day booking
  const isSameDay =
    pickupDate &&
    returnDate &&
    pickupDate.toDateString() === returnDate.toDateString();

  // Get time excess info for display
  const getTimeExcessInfo = () => {
    if (!pickupTime || !returnTime) return null;

    const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
    const [returnHour, returnMin] = returnTime.split(":").map(Number);

    const pickupMinutes = pickupHour * 60 + pickupMin;
    const returnMinutes = returnHour * 60 + returnMin;

    const timeDifference = returnMinutes - pickupMinutes;
    const oneHourInMinutes = 60;

    if (timeDifference > oneHourInMinutes) {
      const excessMinutes = timeDifference - oneHourInMinutes;
      const excessHours = Math.floor(excessMinutes / 60);
      const remainingMinutes = excessMinutes % 60;

      return {
        hasExcess: true,
        excessHours,
        excessMinutes: remainingMinutes,
        message: `+1 day will be added (${excessHours}h ${remainingMinutes}m beyond grace period)`,
      };
    }

    return { hasExcess: false };
  };

  const timeExcessInfo = getTimeExcessInfo();

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Rental Period
        </h3>

        <div className="space-y-4">
          {/* NEW: Vehicle Availability Status */}
          {selectedCarId && (
            <div className="mb-4">
              {isLoadingCalendar ? (
                <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">
                    Loading vehicle availability...
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
                      : "Available Now"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Vehicle Not Available
                    </span>
                  </div>
                  {vehicleAvailability.nextAvailableDate && (
                    <span className="text-xs text-red-700">
                      Next available:{" "}
                      {format(
                        new Date(vehicleAvailability.nextAvailableDate),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Date Selection - ENHANCED */}
          <div>
            <Label>Select Rental Period *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !dateRange && "text-muted-foreground",
                    errors.pickupDate && "border-red-500",
                    isLoadingCalendar && "opacity-50"
                  )}
                  disabled={isLoadingCalendar || !selectedCarId}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isLoadingCalendar ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading calendar...
                    </span>
                  ) : dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} -{" "}
                      {format(dateRange.to, "MMM dd, yyyy")}
                      {duration > 0 && (
                        <span className="ml-auto text-xs text-gray-500">
                          {duration}d
                        </span>
                      )}
                    </>
                  ) : dateRange?.from ? (
                    format(dateRange.from, "MMM dd, yyyy")
                  ) : (
                    "Select pickup and return dates"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) {
                      return true;
                    }
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
                      cursor: "not-allowed",
                    },
                  }}
                  initialFocus
                  numberOfMonths={2}
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
                  {blockedDates.length > 0 && (
                    <p className="text-xs text-gray-600">
                      {blockedDates.length} blocked date
                      {blockedDates.length !== 1 ? "s" : ""} in this period
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {errors.pickupDate && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.pickupDate}
              </p>
            )}
            {errors.returnDate && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.returnDate}
              </p>
            )}
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Time */}
            <div>
              <Label htmlFor="pickupTime">Pickup Time *</Label>
              <Select value={pickupTime} onValueChange={onPickupTimeChange}>
                <SelectTrigger
                  className={errors.pickupTime ? "border-red-500" : ""}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select pickup time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pickupTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.pickupTime}
                </p>
              )}
            </div>

            {/* Return Time */}
            <div>
              <Label htmlFor="returnTime">Return Time *</Label>
              <Select value={returnTime} onValueChange={onReturnTimeChange}>
                <SelectTrigger
                  className={errors.returnTime ? "border-red-500" : ""}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select return time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.returnTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.returnTime}
                </p>
              )}
            </div>
          </div>

          {/* Duration Summary */}
          {duration > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Rental Duration
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-900">
                    {duration} {duration === 1 ? "Day" : "Days"}
                  </p>
                  {isSameDay && (
                    <p className="text-xs text-green-700">Same day rental</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Time Policy Warning */}
          {timeExcessInfo?.hasExcess && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Time Policy Applied</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                {timeExcessInfo.message}
              </p>
            </div>
          )}

          {/* Time Policy Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Time Policy:</p>
                <ul className="space-y-1">
                  <li>• 1-hour grace period after pickup time</li>
                  <li>• Return after grace period = +1 day charge</li>
                  <li>• Example: Pickup 10:00, Return 11:30+ = +1 day</li>
                </ul>
              </div>
            </div>
          </div>

          {/* No Vehicle Selected Warning */}
          {!selectedCarId && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Info className="h-4 w-4" />
                <span className="text-sm">
                  Please select a vehicle first to see availability
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
