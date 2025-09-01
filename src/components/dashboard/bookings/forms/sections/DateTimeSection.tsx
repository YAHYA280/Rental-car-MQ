// src/components/dashboard/bookings/forms/sections/DateTimeSection.tsx
"use client";

import React from "react";
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
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FormValidationState } from "../../types/bookingTypes";

interface DateTimeSectionProps {
  pickupDate: Date | undefined;
  returnDate: Date | undefined;
  pickupTime: string;
  returnTime: string;
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
  onPickupDateChange,
  onReturnDateChange,
  onPickupTimeChange,
  onReturnTimeChange,
  errors,
}) => {
  const t = useTranslations("dashboard");

  // Debug logging
  console.log("DateTimeSection:", {
    pickupDate,
    returnDate,
    pickupTime,
    returnTime,
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

  // Calculate rental duration
  const calculateDuration = () => {
    if (pickupDate && returnDate) {
      const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
    return 0;
  };

  const duration = calculateDuration();

  // Check if same day booking
  const isSameDay =
    pickupDate &&
    returnDate &&
    pickupDate.toDateString() === returnDate.toDateString();

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Rental Period
        </h3>

        <div className="space-y-4">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Date */}
            <div>
              <Label>Pickup Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !pickupDate && "text-muted-foreground",
                      errors.pickupDate && "border-red-500"
                    )}
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
                    onSelect={onPickupDateChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
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
                      "w-full justify-start text-left font-normal",
                      !returnDate && "text-muted-foreground",
                      errors.returnDate && "border-red-500"
                    )}
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
                    onSelect={onReturnDateChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      // Disable past dates
                      if (date <= today) {
                        return true;
                      }

                      // Disable dates before or equal to pickup date
                      if (pickupDate) {
                        return date <= pickupDate;
                      }

                      return false;
                    }}
                    initialFocus
                  />
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

              {pickupDate && returnDate && pickupTime && returnTime && (
                <div className="mt-2 pt-2 border-t border-green-200 text-xs text-green-700">
                  <div className="flex justify-between">
                    <span>
                      From: {format(pickupDate, "MMM dd, yyyy")} at {pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      To: {format(returnDate, "MMM dd, yyyy")} at {returnTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Same day rental warning */}
          {isSameDay && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Same Day Rental</p>
                <p className="text-xs text-amber-700">
                  Please ensure return time is after pickup time for same-day
                  bookings.
                </p>
              </div>
            </div>
          )}

          {/* Business hours info */}
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Business hours: 8:00 AM - 8:30 PM
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTimeSection;
