// src/components/vehicles/RentalBookingForm.tsx
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
} from "lucide-react";
import { CarData } from "@/components/types";
import { DateRange } from "react-day-picker";

interface RentalDetails {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  differentDropoff: boolean;
}

interface RentalBookingFormProps {
  vehicle: CarData;
  initialDetails: RentalDetails;
  onDetailsChange: (details: RentalDetails) => void;
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

  const [rentalDetails, setRentalDetails] =
    useState<RentalDetails>(initialDetails);
  const [showTotalPrice, setShowTotalPrice] = useState(false);

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
      isValidPeriod = rentalDays >= 2;
    }

    const isComplete = Boolean(
      rentalDetails.pickupLocation &&
        pickup &&
        returnD &&
        rentalDetails.pickupTime &&
        rentalDetails.returnTime &&
        isValidPeriod &&
        (!rentalDetails.differentDropoff || rentalDetails.dropoffLocation)
    );

    return {
      rentalDays,
      totalPrice: vehicle.price * Math.max(rentalDays, 1),
      hasValidDates: isValidPeriod,
      isComplete,
    };
  }, [rentalDetails, vehicle.price]);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  // Handle rental details form changes
  const handleRentalDetailChange = (field: string, value: string | boolean) => {
    const newDetails = {
      ...rentalDetails,
      [field]: value,
    };
    setRentalDetails(newDetails);
    onDetailsChange(newDetails);
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
    return tSearch("selectPeriod");
  };

  // WhatsApp booking function with proper translations
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
              rentalDetails.dropoffLocation || rentalDetails.pickupLocation
            }`,
            duration: `Durée: ${rentalInfo.rentalDays} jour${
              rentalInfo.rentalDays > 1 ? "s" : ""
            }`,
            estimatedCost: `Coût Estimé: €${rentalInfo.totalPrice} (€${vehicle.price}/jour)`,
            vehicleFeatures: "Équipements du Véhicule:",
            confirmRequest:
              "Veuillez confirmer la disponibilité et fournir le tarif final. Merci!",
          }
        : {
            intro: `Hello! I would like to book the ${vehicle.brand} ${vehicle.name} (${vehicle.year}).`,
            rentalDetails: "Rental Details:",
            pickupDate: `Pickup Date: ${rentalDetails.pickupDate} at ${rentalDetails.pickupTime}`,
            returnDate: `Return Date: ${rentalDetails.returnDate} at ${rentalDetails.returnTime}`,
            pickupLocation: `Pickup Location: ${rentalDetails.pickupLocation}`,
            returnLocation: `Return Location: ${
              rentalDetails.dropoffLocation || rentalDetails.pickupLocation
            }`,
            duration: `Duration: ${rentalInfo.rentalDays} day${
              rentalInfo.rentalDays > 1 ? "s" : ""
            }`,
            estimatedCost: `Estimated Cost: €${rentalInfo.totalPrice} (€${vehicle.price}/day)`,
            vehicleFeatures: "Vehicle Features:",
            confirmRequest:
              "Please confirm availability and provide final pricing. Thank you!",
          };

    const message = `${messageContent.intro}

📅 ${messageContent.rentalDetails}
• ${messageContent.pickupDate}
• ${messageContent.returnDate}
• ${messageContent.pickupLocation}
• ${messageContent.returnLocation}
• ${messageContent.duration}

💰 ${messageContent.estimatedCost}

🚗 ${messageContent.vehicleFeatures}
${vehicle.features
  .slice(0, 5)
  .map((feature) => `• ${feature}`)
  .join("\n")}

${messageContent.confirmRequest}`;

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
                  {rentalInfo.rentalDays > 1
                    ? tVehicle("days")
                    : tVehicle("day")}{" "}
                  {currentLocale === "fr" ? "au total" : "total"}
                </div>
                <div className="text-sm text-gray-500">
                  €{vehicle.price}/{tVehicle("day")}
                </div>
              </>
            ) : (
              tVehicle("perDay")
            )}
          </div>
        </div>

        {/* Rental Details Form */}
        {!rentalInfo.isComplete ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-800">
                  {currentLocale === "fr"
                    ? "Détails de Location Requis"
                    : "Rental Details Required"}
                </h4>
                <p className="text-sm text-yellow-700">
                  {currentLocale === "fr"
                    ? "Complétez vos informations pour réserver"
                    : "Complete your details to book this vehicle"}
                </p>
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {tSearch("pickupLocation")} *
              </Label>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder={tSearch("placeholders.pickupLocation")}
                  value={rentalDetails.pickupLocation}
                  onChange={(e) =>
                    handleRentalDetailChange("pickupLocation", e.target.value)
                  }
                  className="border-0 p-0 text-sm"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {tSearch("rentalPeriod")} * (min. 2{" "}
                {currentLocale === "fr" ? "jours" : "days"})
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
                        {rentalInfo.rentalDays}{" "}
                        {currentLocale === "fr" ? "j" : "d"}
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
                  {tSearch("pickupTime")} *
                </Label>
                <Select
                  value={rentalDetails.pickupTime}
                  onValueChange={(value) =>
                    handleRentalDetailChange("pickupTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={tSearch("placeholders.selectTime")}
                    />
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
                  {tSearch("returnTime")} *
                </Label>
                <Select
                  value={rentalDetails.returnTime}
                  onValueChange={(value) =>
                    handleRentalDetailChange("returnTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={tSearch("placeholders.selectTime")}
                    />
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

            {/* Different dropoff location toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="different-dropoff"
                checked={rentalDetails.differentDropoff}
                onChange={(e) =>
                  handleRentalDetailChange("differentDropoff", e.target.checked)
                }
                className="w-4 h-4 text-carbookers-red-600 focus:ring-carbookers-red-600 rounded"
              />
              <label
                htmlFor="different-dropoff"
                className="text-sm cursor-pointer"
              >
                {tSearch("differentDropoff")}
              </label>
            </div>

            {/* Dropoff Location (conditional) */}
            {rentalDetails.differentDropoff && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {tSearch("dropoffLocation")} *
                </Label>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder={tSearch("placeholders.dropoffLocation")}
                    value={rentalDetails.dropoffLocation}
                    onChange={(e) =>
                      handleRentalDetailChange(
                        "dropoffLocation",
                        e.target.value
                      )
                    }
                    className="border-0 p-0 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Apply Period Button */}
            <Button
              onClick={() => {
                // This will trigger the state change to show summary when all fields are complete
                // The button is automatically enabled/disabled based on validation
              }}
              disabled={!rentalInfo.isComplete}
              className={`w-full py-3 font-semibold flex items-center gap-2 ${
                rentalInfo.isComplete
                  ? "bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              {tSearch("applyPeriod")}
              {rentalInfo.rentalDays > 0 && rentalInfo.isComplete && (
                <span className="text-xs opacity-90">
                  ({rentalInfo.rentalDays} {currentLocale === "fr" ? "j" : "d"})
                </span>
              )}
            </Button>

            {/* Incomplete fields notice */}
            {!rentalInfo.isComplete && (
              <div className="text-center text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                {tSearch("validation.completeAllFields")}
              </div>
            )}
          </div>
        ) : (
          /* Complete booking summary and WhatsApp button */
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">
                {currentLocale === "fr"
                  ? "Résumé de la Réservation"
                  : "Booking Summary"}
              </h4>
              <div className="text-sm text-green-700 space-y-2">
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
                  rentalDetails.dropoffLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {currentLocale === "fr" ? "Retour:" : "Return:"}{" "}
                        {rentalDetails.dropoffLocation}
                      </span>
                    </div>
                  )}
                <div className="font-semibold pt-2 border-t border-green-300 flex items-center justify-between">
                  <span>Total: €{rentalInfo.totalPrice}</span>
                  <span className="text-xs">
                    ({rentalInfo.rentalDays}{" "}
                    {rentalInfo.rentalDays > 1
                      ? tVehicle("days")
                      : tVehicle("day")}
                    )
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Booking Button */}
            <Button
              onClick={handleWhatsAppBooking}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 flex items-center gap-3 text-lg"
            >
              <MessageCircle className="h-5 w-5" />
              {currentLocale === "fr"
                ? "Réserver via WhatsApp"
                : "Book via WhatsApp"}
            </Button>

            {/* Call Button */}
            <Button
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 flex items-center gap-2 py-3"
              onClick={() =>
                window.open(`tel:${vehicle.whatsappNumber || "+212612077309"}`)
              }
            >
              <Phone className="h-4 w-4" />
              {tVehicle("callNow")}
            </Button>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">{tVehicle("needHelp")}</p>
            <p className="font-semibold text-carbookers-red-600">
              {vehicle.whatsappNumber || "+212612077309"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {currentLocale === "fr"
                ? "WhatsApp disponible 24/7"
                : "WhatsApp available 24/7"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalBookingForm;
