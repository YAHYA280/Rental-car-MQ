// src/app/[locale]/vehicles/[id]/page.tsx - Fixed with React.use() and updated translations
"use client";

import React, { useState, useMemo, use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import AnimatedContainer from "@/components/ui/animated-container";
import {
  Star,
  Users,
  Car,
  Fuel,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Clock,
  CheckCircle,
  Zap,
  Settings,
  Calendar as CalendarIcon,
  Phone,
  ArrowLeft,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from "lucide-react";
import { vehiclesData } from "@/components/data/vehicles";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DateRange } from "react-day-picker";

interface VehicleDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  // Fix: Unwrap params with React.use()
  const { id: vehicleId } = use(params);

  const t = useTranslations("vehicles");
  const tVehicle = useTranslations("vehicleDetail");
  const tFilters = useTranslations("filters");
  const tSearch = useTranslations("search");
  const currentLocale = useLocale();
  const searchParams = useSearchParams();

  // Find the vehicle
  const vehicle = useMemo(
    () => vehiclesData.find((v) => v.id === vehicleId),
    [vehicleId]
  );

  // State for rental details form
  const [rentalDetails, setRentalDetails] = useState({
    pickupLocation: searchParams.get("pickup") || "",
    dropoffLocation: searchParams.get("dropoff") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    pickupTime: searchParams.get("pickupTime") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    differentDropoff: searchParams.get("differentDropoff") === "true",
  });

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

  // State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTotalPrice, setShowTotalPrice] = useState(false);

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
      totalPrice: vehicle ? vehicle.price * Math.max(rentalDays, 1) : 0,
      hasValidDates: isValidPeriod,
      isComplete,
    };
  }, [rentalDetails, vehicle]);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("notFound")}
          </h1>
          <Link href="/vehicles">
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white">
              {t("backToVehicles")}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = vehicle.images || [
    vehicle.image,
    vehicle.image,
    vehicle.image,
  ];

  // Handle rental details form changes
  const handleRentalDetailChange = (field: string, value: string | boolean) => {
    setRentalDetails((prev) => ({
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
    return tSearch("selectPeriod");
  };

  // WhatsApp booking function with proper translations
  const handleWhatsAppBooking = () => {
    const messageContent =
      currentLocale === "fr"
        ? {
            intro: `Bonjour! Je souhaiterais réserver le ${vehicle.brand} ${vehicle.name} (${vehicle.model} ${vehicle.year}).`,
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
            intro: `Hello! I would like to book the ${vehicle.brand} ${vehicle.name} (${vehicle.model} ${vehicle.year}).`,
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

    const phoneNumber = "+212612077309";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case "Electric":
        return <Zap className="h-5 w-5" />;
      default:
        return <Fuel className="h-5 w-5" />;
    }
  };

  const getTransmissionIcon = (transmission: string) => {
    return transmission === "Manual" ? (
      <Settings className="h-5 w-5" />
    ) : (
      <Car className="h-5 w-5" />
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Related vehicles
  const relatedVehicles = vehiclesData
    .filter((v) => v.id !== vehicleId && v.brand === vehicle.brand)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <AnimatedContainer direction="down" className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/vehicles"
              className="hover:text-carbookers-red-600 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToVehicles")}
            </Link>
          </div>
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <AnimatedContainer direction="down">
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="relative">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`${vehicle.brand} ${vehicle.name}`}
                      fill
                      className="object-cover"
                      priority
                    />

                    {/* Navigation buttons */}
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    {/* Image indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? "bg-white scale-125"
                                : "bg-white/60 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </AnimatedContainer>

            {/* Vehicle Information */}
            <AnimatedContainer direction="up" delay={0.2}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-carbookers-red-600 text-white font-semibold">
                          {vehicle.brand}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">
                            {vehicle.rating}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({vehicle.bookings} {tVehicle("bookings")})
                          </span>
                        </div>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {vehicle.brand} {vehicle.name}
                      </h1>
                      <p className="text-lg text-gray-600 mb-2">
                        {vehicle.model} {vehicle.year}
                      </p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{vehicle.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="border-gray-300"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {vehicle.description}
                    </p>
                  </div>

                  {/* Vehicle Specifications */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {tVehicle("specifications")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="h-5 w-5 text-carbookers-red-600" />
                        <div>
                          <div className="text-sm text-gray-600">
                            {tVehicle("seats")}
                          </div>
                          <div className="font-semibold">{vehicle.seats}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-carbookers-red-600">
                          {getTransmissionIcon(vehicle.transmission)}
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            {tVehicle("transmission")}
                          </div>
                          <div className="font-semibold">
                            {tFilters(
                              `transmissions.${vehicle.transmission.toLowerCase()}`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-carbookers-red-600">
                          {getFuelIcon(vehicle.fuelType)}
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            {tVehicle("fuelType")}
                          </div>
                          <div className="font-semibold">
                            {tFilters(
                              `fuelTypes.${vehicle.fuelType.toLowerCase()}`
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Car className="h-5 w-5 text-carbookers-red-600" />
                        <div>
                          <div className="text-sm text-gray-600">
                            {tVehicle("doors")}
                          </div>
                          <div className="font-semibold">{vehicle.doors}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {tVehicle("features")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vehicle.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-900">
                          {tVehicle("insured")}
                        </div>
                        <div className="text-sm text-blue-700">
                          {tVehicle("fullyCovered")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <Award className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-900">
                          {tVehicle("certified")}
                        </div>
                        <div className="text-sm text-green-700">
                          {tVehicle("qualityGuarantee")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-semibold text-purple-900">
                          {tVehicle("support")}
                        </div>
                        <div className="text-sm text-purple-700">
                          {tVehicle("available247")}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            {/* Related Vehicles */}
            {relatedVehicles.length > 0 && (
              <AnimatedContainer direction="up" delay={0.4}>
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {tVehicle("relatedVehicles")} {vehicle.brand}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedVehicles.map((relatedVehicle) => (
                        <Link
                          key={relatedVehicle.id}
                          href={{
                            pathname: "/vehicles/[id]",
                            params: { id: relatedVehicle.id },
                          }}
                        >
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                              <Image
                                src={relatedVehicle.image}
                                alt={`${relatedVehicle.brand} ${relatedVehicle.name}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-semibold text-sm">
                                {relatedVehicle.brand} {relatedVehicle.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                {relatedVehicle.model} {relatedVehicle.year}
                              </p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs">
                                    {relatedVehicle.rating}
                                  </span>
                                </div>
                                <div className="text-sm font-bold">
                                  €{relatedVehicle.price}/{tVehicle("day")}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedContainer>
            )}
          </div>

          {/* Right Column - Rental Details & Booking */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatedContainer direction="left" delay={0.3}>
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
                              handleRentalDetailChange(
                                "pickupLocation",
                                e.target.value
                              )
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
                              <span className="text-sm">
                                {getDateRangeText()}
                              </span>
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
                            handleRentalDetailChange(
                              "differentDropoff",
                              e.target.checked
                            )
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
                              placeholder={tSearch(
                                "placeholders.dropoffLocation"
                              )}
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
                            ({rentalInfo.rentalDays}{" "}
                            {currentLocale === "fr" ? "j" : "d"})
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
                              {rentalDetails.pickupDate} to{" "}
                              {rentalDetails.returnDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {rentalDetails.pickupTime} -{" "}
                              {rentalDetails.returnTime}
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
                                  {currentLocale === "fr"
                                    ? "Retour:"
                                    : "Return:"}{" "}
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
                        onClick={() => window.open("tel:+212612077309")}
                      >
                        <Phone className="h-4 w-4" />
                        {tVehicle("callNow")}
                      </Button>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {tVehicle("needHelp")}
                      </p>
                      <p className="font-semibold text-carbookers-red-600">
                        +212612077309
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
            </AnimatedContainer>

            {/* Vehicle Stats */}
            <AnimatedContainer direction="left" delay={0.5}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    {tVehicle("vehicleStats")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {tVehicle("mileage")}
                      </span>
                      <span className="font-semibold">
                        {vehicle.mileage?.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {tVehicle("availability")}
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        {vehicle.available
                          ? tVehicle("available")
                          : tVehicle("unavailable")}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {tVehicle("totalBookings")}
                      </span>
                      <span className="font-semibold">{vehicle.bookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {tVehicle("airConditioning")}
                      </span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
