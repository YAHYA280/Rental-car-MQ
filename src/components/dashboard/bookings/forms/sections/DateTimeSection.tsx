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

  // State for vehicle calendar
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [vehicleAvailability, setVehicleAvailability] = useState<{
    available: boolean;
    currentBooking?: any;
    upcomingBooking?: any;
    nextAvailableDate?: string;
    nextAvailableTime?: string;
  }>({ available: true });

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

  // Load vehicle calendar when vehicle is selected
  useEffect(() => {
    if (selectedCarId) {
      loadVehicleCalendar(selectedCarId);
    } else {
      setBlockedDates([]);
      setVehicleAvailability({ available: true });
    }
  }, [selectedCarId]);

  // Load vehicle calendar and blocked dates from backend
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
          toast.info(t("bookings.form.dateTime.vehicleAvailabilityUpdated"), {
            description: `${t(
              "bookings.form.dateTime.nextAvailable"
            )}: ${format(
              new Date(response.data.nextAvailableDate),
              "MMM dd, yyyy"
            )}`,
          });
        }
      }
    } catch (error) {
      console.error("Error loading vehicle calendar:", error);
      toast.error(t("bookings.form.dateTime.errorLoadingAvailability"), {
        description: t("bookings.form.dateTime.datesNotAccurate"),
      });
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  // Check if a date is blocked
  const isDateBlocked = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.includes(dateStr);
  };

  // FIXED: Simple date change handlers
  const handlePickupDateChange = (date: Date | undefined) => {
    onPickupDateChange(date);

    // If we have both dates, validate minimum 2 days
    if (date && returnDate) {
      const pickupUTC = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      const returnUTC = new Date(
        Date.UTC(
          returnDate.getFullYear(),
          returnDate.getMonth(),
          returnDate.getDate()
        )
      );
      const diffDays = Math.ceil(
        (returnUTC.getTime() - pickupUTC.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 1) {
        toast.error(t("bookings.form.dateTime.minimumRentalError"), {
          description: t("bookings.form.dateTime.minimumRentalDesc"),
          duration: 4000,
        });
      }
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date && pickupDate) {
      // Check minimum 2 days
      const pickupUTC = new Date(
        Date.UTC(
          pickupDate.getFullYear(),
          pickupDate.getMonth(),
          pickupDate.getDate()
        )
      );
      const returnUTC = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      const diffDays = Math.ceil(
        (returnUTC.getTime() - pickupUTC.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 1) {
        toast.error(t("bookings.form.dateTime.minimumRentalError"), {
          description: t("bookings.form.dateTime.minimumRentalDesc"),
          duration: 4000,
        });
        return;
      }

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
        toast.error(
          t("bookings.form.dateTime.dateNotAvailable", { date: blockedDate }),
          {
            description: t("bookings.form.dateTime.selectAvailableDates"),
          }
        );
        return;
      }

      // Success message
      toast.success(
        t("bookings.form.dateTime.daysSelectedSuccess", { days: diffDays }),
        {
          description: `${t("bookings.form.dateTime.fromTo", {
            from: format(pickupDate, "MMM dd"),
            to: format(date, "MMM dd"),
          })}`,
          duration: 2000,
        }
      );
    }

    onReturnDateChange(date);
  };

  // FIXED: Proper rental duration calculation
  const calculateDuration = (): number => {
    if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
      return 0;
    }

    try {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);

      // Basic day calculation
      const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If same day, calculate based on hours
      if (diffDays === 0 && pickupTime && returnTime) {
        const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
        const [returnHour, returnMin] = returnTime.split(":").map(Number);

        if (!isNaN(pickupHour) && !isNaN(returnHour)) {
          const pickupMinutes = pickupHour * 60 + pickupMin;
          const returnMinutes = returnHour * 60 + returnMin;
          const hoursDiff = (returnMinutes - pickupMinutes) / 60;

          return 1; // Same day rental = 1 day
        }
      }

      // For multi-day rentals, apply time logic
      if (pickupTime && returnTime && diffDays > 0) {
        const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
        const [returnHour, returnMin] = returnTime.split(":").map(Number);

        if (!isNaN(pickupHour) && !isNaN(returnHour)) {
          const timeDifference =
            returnHour * 60 + returnMin - (pickupHour * 60 + pickupMin);

          if (timeDifference > 60) {
            // More than 1 hour later
            diffDays += 1;
          }
        }
      }

      return Math.max(1, diffDays); // Minimum 1 day
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 1;
    }
  };

  const duration = calculateDuration();
  const meetsMinimumDays = duration >= 1;

  // Check if same day booking
  const isSameDay =
    pickupDate &&
    returnDate &&
    pickupDate.toDateString() === returnDate.toDateString();

  // Get time excess info
  const getTimeExcessInfo = () => {
    if (!pickupTime || !returnTime) return null;

    try {
      const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
      const [returnHour, returnMin] = returnTime.split(":").map(Number);

      if (
        isNaN(pickupHour) ||
        isNaN(pickupMin) ||
        isNaN(returnHour) ||
        isNaN(returnMin)
      ) {
        return null;
      }

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
          message: t("bookings.form.dateTime.timeExcessMessage", {
            hours: excessHours,
            minutes: remainingMinutes,
          }),
        };
      }

      return { hasExcess: false };
    } catch (error) {
      return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {t("bookings.form.dateTime.title")}
          <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {t("bookings.form.dateTime.minimumDays")}
          </span>
        </h3>

        <div className="space-y-4">
          {/* Vehicle Availability Status */}
          {selectedCarId && (
            <div className="mb-4">
              {isLoadingCalendar ? (
                <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">
                    {t("bookings.form.dateTime.loadingAvailability")}
                  </span>
                </div>
              ) : vehicleAvailability.available ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {vehicleAvailability.upcomingBooking
                      ? t("bookings.form.dateTime.availableUntil", {
                          date: format(
                            new Date(
                              vehicleAvailability.upcomingBooking.pickupDate
                            ),
                            "MMM dd"
                          ),
                        })
                      : t("bookings.form.dateTime.availableNow")}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {t("bookings.form.dateTime.vehicleNotAvailable")}
                    </span>
                  </div>
                  {vehicleAvailability.nextAvailableDate && (
                    <span className="text-xs text-red-700">
                      {t("bookings.form.dateTime.nextAvailable")}:{" "}
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

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Date */}
            <div>
              <Label>{t("bookings.form.dateTime.pickupDate")} *</Label>
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
                      : t("bookings.form.dateTime.selectPickupDate")}
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
              <Label>{t("bookings.form.dateTime.returnDate")} *</Label>
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
                      : t("bookings.form.dateTime.selectReturnDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={handleReturnDateChange}
                    disabled={(date) => {
                      if (!pickupDate) return true;

                      // Must be at least 2 days after pickup
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
                      const diffDays = Math.ceil(
                        (dateUTC.getTime() - pickupUTC.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );

                      if (diffDays < 1) return true;
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
                        <span>{t("bookings.form.dateTime.available")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded opacity-40"></div>
                        <span>{t("bookings.form.dateTime.booked")}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <div className="flex items-center gap-1 text-blue-800">
                        <CalendarIcon className="h-3 w-3" />
                        <span className="text-xs font-medium">
                          {t("bookings.form.dateTime.minimumDaysRequired")}
                        </span>
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

          {/* Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupTime">
                {t("bookings.form.dateTime.pickupTime")} *
              </Label>
              <Select value={pickupTime} onValueChange={onPickupTimeChange}>
                <SelectTrigger
                  className={errors.pickupTime ? "border-red-500" : ""}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue
                    placeholder={t("bookings.form.dateTime.selectPickupTime")}
                  />
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

            <div>
              <Label htmlFor="returnTime">
                {t("bookings.form.dateTime.returnTime")} *
              </Label>
              <Select value={returnTime} onValueChange={onReturnTimeChange}>
                <SelectTrigger
                  className={errors.returnTime ? "border-red-500" : ""}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue
                    placeholder={t("bookings.form.dateTime.selectReturnTime")}
                  />
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
            <div
              className={cn(
                "mt-4 p-3 border rounded-lg",
                meetsMinimumDays
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon
                    className={cn(
                      "h-4 w-4",
                      meetsMinimumDays ? "text-green-600" : "text-red-600"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      meetsMinimumDays ? "text-green-800" : "text-red-800"
                    )}
                  >
                    {t("bookings.form.dateTime.rentalDuration")}
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-bold",
                      meetsMinimumDays ? "text-green-900" : "text-red-900"
                    )}
                  >
                    {duration}{" "}
                    {duration === 1
                      ? t("bookings.form.dateTime.day")
                      : t("bookings.form.dateTime.days")}
                  </p>
                  {!meetsMinimumDays && (
                    <p className="text-xs text-red-700">
                      {t("bookings.form.dateTime.needAtLeastDays")}
                    </p>
                  )}
                  {isSameDay && meetsMinimumDays && (
                    <p className="text-xs text-green-700">
                      {t("bookings.form.dateTime.extendedByTimeLogic")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!selectedCarId && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Info className="h-4 w-4" />
                <span className="text-sm">
                  {t("bookings.form.dateTime.selectVehicleFirst")}
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
