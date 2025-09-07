// src/components/vehicles/components/RentalBookingForm.tsx - Complete rewrite with consistent naming
"use client";

import React, { useState, useMemo } from "react";
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
  Clock,
  MessageCircle,
  Phone,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  User,
  Mail,
  Loader2,
} from "lucide-react";
import {
  CarData,
  WebsiteBookingFormData,
  PICKUP_LOCATIONS,
} from "@/components/types";
import { DateRange } from "react-day-picker";
import { bookingService } from "@/services/bookingService";
import { toast } from "sonner";

// Consistent interface using returnLocation throughout
interface RentalDetails {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  differentDropoff: boolean;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface RentalBookingFormProps {
  vehicle: CarData;
  initialDetails: {
    pickupLocation: string;
    dropoffLocation: string; // This comes from props but we'll map it
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    differentDropoff: boolean;
  };
  onDetailsChange: (details: any) => void; // Keep original for compatibility
}

const RentalBookingForm: React.FC<RentalBookingFormProps> = ({
  vehicle,
  initialDetails,
  onDetailsChange,
}) => {
  const t = useTranslations("vehicles");
  const tVehicle = useTranslations("vehicleDetail");
  const tSearch = useTranslations("search");
  const tCommon = useTranslations("common");
  const currentLocale = useLocale();

  // Map initial props to consistent internal state
  const [rentalDetails, setRentalDetails] = useState<RentalDetails>({
    pickupLocation: initialDetails.pickupLocation || "",
    returnLocation: initialDetails.dropoffLocation || "", // Map dropoffLocation to returnLocation
    pickupDate: initialDetails.pickupDate || "",
    pickupTime: initialDetails.pickupTime || "",
    returnDate: initialDetails.returnDate || "",
    returnTime: initialDetails.returnTime || "",
    differentDropoff: initialDetails.differentDropoff || false,
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState<"details" | "customer" | "summary">(
    "details"
  );

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const pickup = rentalDetails.pickupDate;
    const returnD = rentalDetails.returnDate;
    if (pickup && returnD) {
      return {
        from: new Date(pickup),
        to: new Date(returnD),
      };
    }
    return undefined;
  });

  // Calculate rental period and validation
  const rentalInfo = useMemo(() => {
    const pickup = rentalDetails.pickupDate;
    const returnD = rentalDetails.returnDate;

    let rentalDays = 0;
    let isValidPeriod = false;

    if (pickup && returnD) {
      const pickupDateObj = new Date(pickup);
      const returnDateObj = new Date(returnD);
      const timeDiff = returnDateObj.getTime() - pickupDateObj.getTime();
      rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      isValidPeriod = rentalDays >= 1;
    }

    const isRentalDetailsComplete = Boolean(
      rentalDetails.pickupLocation &&
        pickup &&
        returnD &&
        rentalDetails.pickupTime &&
        rentalDetails.returnTime &&
        isValidPeriod &&
        (!rentalDetails.differentDropoff || rentalDetails.returnLocation)
    );

    const isCustomerInfoComplete = Boolean(
      customerInfo.firstName.trim() &&
        customerInfo.lastName.trim() &&
        customerInfo.phone.trim()
    );

    return {
      rentalDays,
      totalPrice: vehicle.price * Math.max(rentalDays, 1),
      hasValidDates: isValidPeriod,
      isRentalDetailsComplete,
      isCustomerInfoComplete,
      isComplete: isRentalDetailsComplete && isCustomerInfoComplete,
    };
  }, [rentalDetails, customerInfo, vehicle.price]);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  // Handle rental details form changes
  const handleRentalDetailChange = (
    field: keyof RentalDetails,
    value: string | boolean
  ) => {
    const newDetails = {
      ...rentalDetails,
      [field]: value,
    };
    setRentalDetails(newDetails);

    // Map back to original format for parent component
    const mappedDetails = {
      ...newDetails,
      dropoffLocation: newDetails.returnLocation, // Map back for compatibility
    };
    onDetailsChange(mappedDetails);
  };

  // Handle customer info changes
  const handleCustomerInfoChange = (
    field: keyof CustomerInfo,
    value: string
  ) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      handleRentalDetailChange("pickupDate", format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      handleRentalDetailChange("returnDate", format(range.to, "yyyy-MM-dd"));
    }
  };

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

  // Validate phone number (Moroccan format)
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^0[67]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Handle form submission
  const handleSubmitBooking = async () => {
    if (!rentalInfo.isComplete) {
      toast.error("Please complete all required information");
      return;
    }

    if (!isValidPhone(customerInfo.phone)) {
      toast.error(
        "Please enter a valid Moroccan phone number (06XXXXXXXX or 07XXXXXXXX)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData: WebsiteBookingFormData = {
        // Customer information
        firstName: customerInfo.firstName.trim(),
        lastName: customerInfo.lastName.trim(),
        phone: customerInfo.phone.trim(),
        email: customerInfo.email.trim() || undefined,

        // Booking details
        vehicleId: vehicle.id,
        pickupDate: rentalDetails.pickupDate,
        returnDate: rentalDetails.returnDate,
        pickupTime: rentalDetails.pickupTime,
        returnTime: rentalDetails.returnTime,
        pickupLocation: rentalDetails.pickupLocation,
        returnLocation: rentalDetails.returnLocation,
      };

      console.log("Submitting booking:", bookingData);

      const response = await bookingService.createWebsiteBooking(bookingData);

      if (response.success) {
        toast.success(
          currentLocale === "fr"
            ? "Demande de réservation envoyée avec succès! Nous vous contacterons bientôt."
            : "Booking request submitted successfully! We will contact you soon."
        );

        // Reset form
        setCustomerInfo({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
        });
        setFormStep("details");
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

  // WhatsApp booking function
  const handleWhatsAppBooking = () => {
    const messageContent =
      currentLocale === "fr"
        ? {
            intro: `Bonjour! Je souhaiterais réserver le ${vehicle.brand} ${vehicle.name} (${vehicle.year}).`,
            rentalDetails: "Détails de la Location:",
            pickupDate: `Date de Prise: ${rentalDetails.pickupDate} à ${rentalDetails.pickupTime}`,
            returnDate: `Date de Retour: ${rentalDetails.returnDate} à ${rentalDetails.returnTime}`,
            pickupLocation: `Lieu de Prise: ${rentalDetails.pickupLocation}`,
            returnLocation: `Lieu de Retour: ${
              rentalDetails.returnLocation || rentalDetails.pickupLocation
            }`,
            duration: `Durée: ${rentalInfo.rentalDays} jour${
              rentalInfo.rentalDays > 1 ? "s" : ""
            }`,
            estimatedCost: `Coût Estimé: €${rentalInfo.totalPrice} (€${vehicle.price}/jour)`,
          }
        : {
            intro: `Hello! I would like to book the ${vehicle.brand} ${vehicle.name} (${vehicle.year}).`,
            rentalDetails: "Rental Details:",
            pickupDate: `Pickup Date: ${rentalDetails.pickupDate} at ${rentalDetails.pickupTime}`,
            returnDate: `Return Date: ${rentalDetails.returnDate} at ${rentalDetails.returnTime}`,
            pickupLocation: `Pickup Location: ${rentalDetails.pickupLocation}`,
            returnLocation: `Return Location: ${
              rentalDetails.returnLocation || rentalDetails.pickupLocation
            }`,
            duration: `Duration: ${rentalInfo.rentalDays} day${
              rentalInfo.rentalDays > 1 ? "s" : ""
            }`,
            estimatedCost: `Estimated Cost: €${rentalInfo.totalPrice} (€${vehicle.price}/day)`,
          };

    const message = `${messageContent.intro}

📅 ${messageContent.rentalDetails}
• ${messageContent.pickupDate}
• ${messageContent.returnDate}
• ${messageContent.pickupLocation}
• ${messageContent.returnLocation}
• ${messageContent.duration}

💰 ${messageContent.estimatedCost}

Please confirm availability. Thank you!`;

    const phoneNumber =
      vehicle.whatsappNumber?.replace(/\s/g, "") || "+212612077309";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="border-0 shadow-xl sticky top-6">
      <CardContent className="p-6">
        {/* Price Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            {rentalInfo.hasValidDates && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTotalPrice(!showTotalPrice)}
                className="p-1 h-auto"
              >
                {showTotalPrice ? (
                  <ToggleRight className="h-5 w-5 text-carbookers-red-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400" />
                )}
              </Button>
            )}
            <div className="text-4xl font-bold text-gray-900">
              €
              {showTotalPrice && rentalInfo.hasValidDates
                ? rentalInfo.totalPrice
                : vehicle.price}
            </div>
          </div>
          <div className="text-gray-600">
            {showTotalPrice && rentalInfo.hasValidDates ? (
              <>
                <div className="text-lg font-semibold">
                  {rentalInfo.rentalDays}{" "}
                  {rentalInfo.rentalDays > 1 ? "days" : "day"} total
                </div>
                <div className="text-sm text-gray-500">
                  €{vehicle.price}/day
                </div>
              </>
            ) : (
              "per day"
            )}
          </div>
        </div>

        {/* Step 1: Rental Details */}
        {formStep === "details" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800">Rental Details</h4>
                <p className="text-sm text-blue-700">
                  Select your dates and locations
                </p>
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Pickup Location *
              </Label>
              <Select
                value={rentalDetails.pickupLocation}
                onValueChange={(value) =>
                  handleRentalDetailChange("pickupLocation", value)
                }
              >
                <SelectTrigger>
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

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Rental Period * (min. 1 day)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal p-3 h-auto"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{getDateRangeText()}</span>
                    {rentalInfo.rentalDays > 0 && (
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
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Pickup Time *
                </Label>
                <Select
                  value={rentalDetails.pickupTime}
                  onValueChange={(value) =>
                    handleRentalDetailChange("pickupTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Return Time *
                </Label>
                <Select
                  value={rentalDetails.returnTime}
                  onValueChange={(value) =>
                    handleRentalDetailChange("returnTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Different return location toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="different-return"
                checked={rentalDetails.differentDropoff}
                onChange={(e) =>
                  handleRentalDetailChange("differentDropoff", e.target.checked)
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
            {rentalDetails.differentDropoff && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Return Location *
                </Label>
                <Select
                  value={rentalDetails.returnLocation}
                  onValueChange={(value) =>
                    handleRentalDetailChange("returnLocation", value)
                  }
                >
                  <SelectTrigger>
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

            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                Debug: Details Complete ={" "}
                {rentalInfo.isRentalDetailsComplete.toString()}
              </div>
            )}

            <Button
              onClick={() => setFormStep("customer")}
              disabled={!rentalInfo.isRentalDetailsComplete}
              className="w-full py-3 font-semibold flex items-center gap-2 bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white"
            >
              <User className="h-4 w-4" />
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Customer Information */}
        {formStep === "customer" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">
                  Customer Information
                </h4>
                <p className="text-sm text-green-700">
                  Your contact information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    First Name *
                  </Label>
                  <Input
                    value={customerInfo.firstName}
                    onChange={(e) =>
                      handleCustomerInfoChange("firstName", e.target.value)
                    }
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Last Name *
                  </Label>
                  <Input
                    value={customerInfo.lastName}
                    onChange={(e) =>
                      handleCustomerInfoChange("lastName", e.target.value)
                    }
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Phone *
                </Label>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Input
                    value={customerInfo.phone}
                    onChange={(e) =>
                      handleCustomerInfoChange("phone", e.target.value)
                    }
                    placeholder="06XXXXXXXX or 07XXXXXXXX"
                    className="border-0 p-0 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 06XXXXXXXX or 07XXXXXXXX
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Email (optional)
                </Label>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      handleCustomerInfoChange("email", e.target.value)
                    }
                    placeholder="your@email.com"
                    className="border-0 p-0 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setFormStep("details")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setFormStep("summary")}
                disabled={!rentalInfo.isCustomerInfoComplete}
                className="flex-1 bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Summary and Submit */}
        {formStep === "summary" && (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">
                Booking Summary
              </h4>
              <div className="text-sm text-green-700 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    {customerInfo.firstName} {customerInfo.lastName} -{" "}
                    {customerInfo.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {rentalDetails.pickupDate} to {rentalDetails.returnDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {rentalDetails.pickupTime} - {rentalDetails.returnTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{rentalDetails.pickupLocation}</span>
                </div>
                {rentalDetails.differentDropoff &&
                  rentalDetails.returnLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Return: {rentalDetails.returnLocation}</span>
                    </div>
                  )}
                <div className="font-semibold pt-2 border-t border-green-300 flex items-center justify-between">
                  <span>Total: €{rentalInfo.totalPrice}</span>
                  <span className="text-xs">
                    ({rentalInfo.rentalDays}{" "}
                    {rentalInfo.rentalDays > 1 ? "days" : "day"})
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmitBooking}
              disabled={isSubmitting || !rentalInfo.isComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 flex items-center gap-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  Confirm Booking
                </>
              )}
            </Button>

            <Button
              onClick={handleWhatsAppBooking}
              variant="outline"
              className="w-full border-green-300 hover:bg-green-50 flex items-center gap-2 py-3"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              Or book via WhatsApp
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setFormStep("customer")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => setFormStep("details")}
                className="flex-1"
              >
                Edit Details
              </Button>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <p className="font-semibold text-carbookers-red-600">
              {vehicle.whatsappNumber || "+212612077309"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              WhatsApp available 24/7
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalBookingForm;
