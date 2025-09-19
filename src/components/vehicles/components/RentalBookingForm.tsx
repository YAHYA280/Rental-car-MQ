"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  MapPin,
  Calendar as CalendarIcon,
  Phone,
  MessageCircle,
  User,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";
import {
  CarData,
  WebsiteBookingFormData,
  PICKUP_LOCATIONS,
  VehicleAvailabilityStatus,
} from "@/components/types";
import { DateRange } from "react-day-picker";
import { bookingService } from "@/services/bookingService";
import { toast } from "sonner";

interface RentalBookingFormProps {
  vehicle: CarData;
  initialDetails: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    differentDropoff: boolean;
  };
  onDetailsChange: (details: any) => void;
}

const RentalBookingForm: React.FC<RentalBookingFormProps> = ({
  vehicle,
  initialDetails,
  onDetailsChange,
}) => {
  const t = useTranslations("vehicles");
  const currentLocale = useLocale();

  // All state variables
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    pickupLocation: initialDetails.pickupLocation || "",
    returnLocation: initialDetails.dropoffLocation || "",
    pickupDate: initialDetails.pickupDate || "",
    returnDate: initialDetails.returnDate || "",
    pickupTime: initialDetails.pickupTime || "10:00",
    returnTime: initialDetails.returnTime || "10:00",
    differentDropoff: initialDetails.differentDropoff || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [availabilityStatus, setAvailabilityStatus] =
    useState<VehicleAvailabilityStatus>({
      available: true,
    });

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (formData.pickupDate && formData.returnDate) {
      return {
        from: new Date(formData.pickupDate),
        to: new Date(formData.returnDate),
      };
    }
    return undefined;
  });

  // Load vehicle calendar on component mount
  useEffect(() => {
    loadVehicleCalendar();
  }, [vehicle.id]);

  // Load vehicle calendar and blocked dates from backend
  const loadVehicleCalendar = async () => {
    try {
      setIsLoadingCalendar(true);

      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 90);

      const response = await bookingService.getVehicleCalendar(
        vehicle.id,
        format(today, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      if (response.success && response.data) {
        setBlockedDates(response.data.blockedDates || []);
        setAvailabilityStatus({
          available: response.data.available,
          nextAvailableDate: response.data.nextAvailableDate,
          currentBooking: response.data.currentBooking,
          upcomingBooking: response.data.upcomingBooking,
        });
      }
    } catch (error) {
      console.error("Error loading vehicle calendar:", error);
      toast.error("Error loading vehicle availability");
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  // Generate time slots (business hours: 8:00 AM - 8:30 PM)
  const timeSlots = useMemo(() => {
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

  // UPDATED: Calculate rental info with your specific time logic
  const rentalInfo = useMemo(() => {
    let rentalDays = 0;
    let isValidPeriod = false;
    let timeExceededMessage = "";

    if (
      formData.pickupDate &&
      formData.returnDate &&
      formData.pickupTime &&
      formData.returnTime
    ) {
      const pickupDateTime = new Date(
        `${formData.pickupDate}T${formData.pickupTime}:00`
      );
      const returnDateTime = new Date(
        `${formData.returnDate}T${formData.returnTime}:00`
      );

      // Calculate basic day difference
      const pickupDateOnly = new Date(formData.pickupDate);
      const returnDateOnly = new Date(formData.returnDate);
      const basicDays = Math.ceil(
        (returnDateOnly.getTime() - pickupDateOnly.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Apply your specific time logic
      const pickupTime = formData.pickupTime;
      const returnTime = formData.returnTime;

      // Convert times to minutes for easier comparison
      const pickupMinutes =
        parseInt(pickupTime.split(":")[0]) * 60 +
        parseInt(pickupTime.split(":")[1]);
      const returnMinutes =
        parseInt(returnTime.split(":")[0]) * 60 +
        parseInt(returnTime.split(":")[1]);

      // Your logic: if return time is more than 1 hour after pickup time on the last day, add 1 day
      const timeDifference = returnMinutes - pickupMinutes;
      const oneHourInMinutes = 60;

      rentalDays = basicDays;

      // If return time exceeds pickup time by more than 1 hour, add extra day
      if (timeDifference > oneHourInMinutes) {
        rentalDays += 1;
        const excessHours = Math.floor(
          (timeDifference - oneHourInMinutes) / 60
        );
        const excessMinutes = (timeDifference - oneHourInMinutes) % 60;
        timeExceededMessage = `+1 day added (return time exceeds pickup time by ${excessHours}h ${excessMinutes}m)`;
      }

      isValidPeriod = rentalDays >= 1;
    }

    const totalAmount = vehicle.price * Math.max(rentalDays, 1);
    const cautionAmount = Number(vehicle.caution) || 0;

    const isFormValid = Boolean(
      formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.phone.trim() &&
        formData.pickupLocation &&
        formData.pickupDate &&
        formData.returnDate &&
        formData.pickupTime &&
        formData.returnTime &&
        isValidPeriod &&
        (!formData.differentDropoff || formData.returnLocation)
    );

    return {
      rentalDays,
      totalAmount,
      cautionAmount,
      hasValidDates: isValidPeriod,
      isFormValid,
      timeExceededMessage,
    };
  }, [formData, vehicle.price, vehicle.caution]);

  // Handle form field changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // If differentDropoff is turned off, set return location same as pickup
      if (field === "differentDropoff" && !value) {
        newData.returnLocation = newData.pickupLocation;
      }

      return newData;
    });
  };

  // Check if a date is blocked
  const isDateBlocked = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.includes(dateStr);
  };

  // Handle date range selection with proper validation
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setDateRange(undefined);
      handleInputChange("pickupDate", "");
      handleInputChange("returnDate", "");
      return;
    }

    // If only 'from' date is selected, allow it
    if (range.from && !range.to) {
      setDateRange(range);
      handleInputChange("pickupDate", format(range.from, "yyyy-MM-dd"));
      handleInputChange("returnDate", "");
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
        toast.error(
          currentLocale === "fr"
            ? `La date ${blockedDate} n'est pas disponible`
            : `${blockedDate} is not available`,
          {
            description:
              currentLocale === "fr"
                ? "Veuillez choisir des dates disponibles uniquement"
                : "Please select only available dates",
          }
        );
        return;
      }
    }

    // If we get here, the selection is valid
    setDateRange(range);
    if (range.from) {
      handleInputChange("pickupDate", format(range.from, "yyyy-MM-dd"));
    }
    if (range.to) {
      handleInputChange("returnDate", format(range.to, "yyyy-MM-dd"));

      toast.success(
        currentLocale === "fr"
          ? "Dates sélectionnées avec succès!"
          : "Dates selected successfully!",
        { duration: 2000 }
      );
    }
  };

  // Get date range display text
  const getDateRangeText = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMM dd")} - ${format(
        dateRange.to,
        "MMM dd, yyyy"
      )}`;
    } else if (dateRange?.from) {
      return format(dateRange.from, "MMM dd, yyyy");
    }
    return "Select rental period";
  };

  // Validate Moroccan phone number
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^0[67]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Handle booking submission
  const handleBookNow = async () => {
    if (!rentalInfo.isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      toast.error(
        "Please enter a valid Moroccan phone number (06XXXXXXXX or 07XXXXXXXX)"
      );
      return;
    }

    // Final availability check before submission
    if (formData.pickupDate && formData.returnDate) {
      const hasConflict = blockedDates.some((blockedDate) => {
        const blocked = new Date(blockedDate);
        const pickup = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);
        return blocked >= pickup && blocked <= returnDate;
      });

      if (hasConflict) {
        toast.error(
          "Selected dates are no longer available. Please refresh and try again."
        );
        await loadVehicleCalendar();
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData: WebsiteBookingFormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        vehicleId: vehicle.id,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        pickupTime: formData.pickupTime,
        returnTime: formData.returnTime,
        pickupLocation: formData.pickupLocation,
        returnLocation: formData.differentDropoff
          ? formData.returnLocation
          : formData.pickupLocation,
      };

      console.log("Submitting booking:", bookingData);

      // Create booking
      const response = await bookingService.createWebsiteBooking(bookingData);

      if (response.success) {
        toast.success(
          currentLocale === "fr"
            ? "Demande de réservation envoyée avec succès!"
            : "Booking request submitted successfully!"
        );

        // Prepare WhatsApp message with detailed time info
        const customerName = `${formData.firstName} ${formData.lastName}`;
        const bookingNumber = response.data?.bookingNumber || "NEW";

        const messageContent =
          currentLocale === "fr"
            ? {
                intro: `Bonjour! Je viens de faire une demande de réservation pour le ${vehicle.brand} ${vehicle.name} (${vehicle.year}).`,
                bookingDetails: "Détails de la réservation:",
                bookingNumber: `Numéro de réservation: ${bookingNumber}`,
                dates: `Dates: ${formData.pickupDate} (${formData.pickupTime}) au ${formData.returnDate} (${formData.returnTime})`,
                duration: `Durée: ${rentalInfo.rentalDays} jour${
                  rentalInfo.rentalDays > 1 ? "s" : ""
                }`,
                location: `Lieu: ${formData.pickupLocation}`,
                customer: `Client: ${customerName}`,
                phone: `Téléphone: ${formData.phone}`,
                total: `Total location: €${rentalInfo.totalAmount}`,
                caution: `Caution: €${rentalInfo.cautionAmount}`,
                request:
                  "Pouvez-vous confirmer la disponibilité et les détails s'il vous plaît?",
              }
            : {
                intro: `Hello! I just submitted a booking request for the ${vehicle.brand} ${vehicle.name} (${vehicle.year}).`,
                bookingDetails: "Booking Details:",
                bookingNumber: `Booking Number: ${bookingNumber}`,
                dates: `Dates: ${formData.pickupDate} (${formData.pickupTime}) to ${formData.returnDate} (${formData.returnTime})`,
                duration: `Duration: ${rentalInfo.rentalDays} day${
                  rentalInfo.rentalDays > 1 ? "s" : ""
                }`,
                location: `Location: ${formData.pickupLocation}`,
                customer: `Customer: ${customerName}`,
                phone: `Phone: ${formData.phone}`,
                total: `Rental Total: €${rentalInfo.totalAmount}`,
                caution: `Security Deposit: €${rentalInfo.cautionAmount}`,
                request: "Can you please confirm availability and details?",
              };

        const whatsappMessage = `${messageContent.intro}

📋 ${messageContent.bookingDetails}
• ${messageContent.bookingNumber}
• ${messageContent.dates}
• ${messageContent.duration}
• ${messageContent.location}
• ${messageContent.customer}
• ${messageContent.phone}

💰 ${messageContent.total}
🛡️ ${messageContent.caution}

${messageContent.request}`;

        // Redirect to WhatsApp
        const phoneNumber =
          vehicle.whatsappNumber?.replace(/\s/g, "") || "+212612077309";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
        }, 1500);

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          pickupLocation: "",
          returnLocation: "",
          pickupDate: "",
          returnDate: "",
          pickupTime: "10:00",
          returnTime: "10:00",
          differentDropoff: false,
        });
        setDateRange(undefined);

        await loadVehicleCalendar();
      } else {
        throw new Error(response.message || "Failed to submit booking");
      }
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast.error(
        error.message ||
          (currentLocale === "fr"
            ? "Erreur lors de l'envoi de la demande"
            : "Error submitting booking request")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl sticky top-6">
      <CardContent className="p-6">
        {/* Price Display */}
        <div className="text-center mb-6">
          {/* Vehicle Availability Status */}
          <div className="mb-3">
            {isLoadingCalendar ? (
              <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">
                  Loading availability...
                </span>
              </div>
            ) : availabilityStatus.available ? (
              <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg px-3 py-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {availabilityStatus.upcomingBooking
                    ? `Available until ${format(
                        new Date(availabilityStatus.upcomingBooking.pickupDate),
                        "MMM dd"
                      )}`
                    : "Available Now"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Not Available</span>
                </div>
                {availabilityStatus.nextAvailableDate && (
                  <span className="text-xs text-red-700">
                    Next available:{" "}
                    {format(
                      new Date(availabilityStatus.nextAvailableDate),
                      "MMM dd, yyyy"
                    )}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="text-4xl font-bold text-carbookers-red-600 mb-2">
            €{rentalInfo.hasValidDates ? rentalInfo.totalAmount : vehicle.price}
          </div>
          <div className="text-gray-600">
            {rentalInfo.hasValidDates ? (
              <>
                <div className="text-lg font-semibold">
                  {rentalInfo.rentalDays}{" "}
                  {rentalInfo.rentalDays > 1 ? "days" : "day"} total
                </div>
                <div className="text-sm text-gray-500">
                  €{vehicle.price}/day
                </div>
                {rentalInfo.timeExceededMessage && (
                  <div className="text-xs text-amber-600 mt-1 flex items-center justify-center gap-1">
                    <Info className="h-3 w-3" />
                    {rentalInfo.timeExceededMessage}
                  </div>
                )}
              </>
            ) : (
              "per day"
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          {/* Customer Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">First Name *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="John"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Last Name *</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Doe"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Phone Number *</Label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0612345678"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: 06XXXXXXXX or 07XXXXXXXX
              </p>
            </div>

            <div>
              <Label className="text-sm">Email (optional)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Rental Period
            </h4>

            <div>
              <Label className="text-sm">Select Dates *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                    disabled={isLoadingCalendar}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {isLoadingCalendar ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading calendar...
                      </span>
                    ) : (
                      <span className="text-sm">{getDateRangeText()}</span>
                    )}
                    {rentalInfo.rentalDays > 0 && !isLoadingCalendar && (
                      <span className="ml-auto text-xs text-gray-500">
                        {rentalInfo.rentalDays}d
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={1}
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
                    className="rounded-md border shadow"
                  />

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
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pickup Time */}
              <div>
                <Label className="text-sm">Pickup Time *</Label>
                <Select
                  value={formData.pickupTime}
                  onValueChange={(value) =>
                    handleInputChange("pickupTime", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Return Time */}
              <div>
                <Label className="text-sm">Return Time *</Label>
                <Select
                  value={formData.returnTime}
                  onValueChange={(value) =>
                    handleInputChange("returnTime", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Logic Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Time Policy:</p>
                  <ul className="space-y-1">
                    <li>• 1-hour grace period after pickup time</li>
                    <li>• Return after grace period = +1 day charge</li>
                    <li>• Business hours: 8:00 AM - 8:30 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h4>

            <div>
              <Label className="text-sm">Pickup Location *</Label>
              <Select
                value={formData.pickupLocation}
                onValueChange={(value) => {
                  handleInputChange("pickupLocation", value);
                  if (!formData.differentDropoff) {
                    handleInputChange("returnLocation", value);
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {PICKUP_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="different-return"
                checked={formData.differentDropoff}
                onChange={(e) =>
                  handleInputChange("differentDropoff", e.target.checked)
                }
                className="w-4 h-4 text-carbookers-red-600 focus:ring-carbookers-red-600 rounded"
              />
              <label
                htmlFor="different-return"
                className="text-sm cursor-pointer"
              >
                Return to different location
              </label>
            </div>

            {/* Return Location (conditional) */}
            {formData.differentDropoff && (
              <div>
                <Label className="text-sm">Return Location *</Label>
                <Select
                  value={formData.returnLocation}
                  onValueChange={(value) =>
                    handleInputChange("returnLocation", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Select return location" />
                  </SelectTrigger>
                  <SelectContent>
                    {PICKUP_LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          {rentalInfo.hasValidDates && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">
                Booking Summary
              </h4>
              <div className="text-sm text-green-700 space-y-2">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span>
                    {vehicle.brand} {vehicle.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup:</span>
                  <span>
                    {formData.pickupDate} at {formData.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Return:</span>
                  <span>
                    {formData.returnDate} at {formData.returnTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>
                    {rentalInfo.rentalDays} day
                    {rentalInfo.rentalDays > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{formData.pickupLocation}</span>
                </div>
                {formData.differentDropoff && formData.returnLocation && (
                  <div className="flex justify-between">
                    <span>Return to:</span>
                    <span>{formData.returnLocation}</span>
                  </div>
                )}

                {/* Pricing Breakdown */}
                <div className="border-t border-green-300 pt-2 mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Daily Rate:</span>
                    <span>€{vehicle.price}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Days:</span>
                    <span>{rentalInfo.rentalDays}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-900">
                    <span>Rental Total:</span>
                    <span>€{rentalInfo.totalAmount}</span>
                  </div>

                  {/* Security Deposit/Caution */}
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-800 font-medium">
                        Security Deposit:
                      </span>
                      <span className="text-amber-900 font-bold">
                        €{rentalInfo.cautionAmount}
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      Refundable deposit required at pickup
                    </p>
                  </div>

                  {/* Total Summary */}
                  <div className="bg-green-100 border border-green-300 rounded p-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-900">
                        Total at Pickup:
                      </span>
                      <span className="font-bold text-xl text-green-900">
                        €
                        {Number(
                          rentalInfo.totalAmount + rentalInfo.cautionAmount
                        ).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Rental (€{rentalInfo.totalAmount}) + Deposit (€
                      {rentalInfo.cautionAmount})
                    </p>
                  </div>
                </div>

                {/* Time exceeded warning */}
                {rentalInfo.timeExceededMessage && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Time Policy Applied
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      {rentalInfo.timeExceededMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <Button
            onClick={handleBookNow}
            disabled={
              isSubmitting || !rentalInfo.isFormValid || isLoadingCalendar
            }
            className="w-full bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : isLoadingCalendar ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading calendar...
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                Book Now
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <CheckCircle className="h-4 w-4 inline mr-1" />
            Your booking will be confirmed via WhatsApp
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <p className="font-semibold text-carbookers-red-600">
            {vehicle.whatsappNumber || "+212612077309"}
          </p>
          <p className="text-sm text-gray-500">WhatsApp available 24/7</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalBookingForm;
