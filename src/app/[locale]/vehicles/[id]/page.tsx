// src/app/[locale]/vehicles/[id]/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedContainer from "@/components/ui/animated-container";
import CarSearchComponent from "@/components/search/CarSearchComponent";
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
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { vehiclesData } from "@/components/data/vehicles";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface VehicleDetailPageProps {
  params: { locale: string; id: string };
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const t = useTranslations("vehicles");
  const tVehicle = useTranslations("vehicleDetail");
  const tFilters = useTranslations("filters");

  const vehicleId = params.id;

  // Find the vehicle
  const vehicle = useMemo(
    () => vehiclesData.find((v) => v.id === vehicleId),
    [vehicleId]
  );

  // State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const getCategoryColor = (category: string) => {
    const colors = {
      Economy: "bg-green-100 text-green-800",
      Premium: "bg-blue-100 text-blue-800",
      Luxury: "bg-purple-100 text-purple-800",
      SUV: "bg-orange-100 text-orange-800",
      Electric: "bg-emerald-100 text-emerald-800",
      Family: "bg-indigo-100 text-indigo-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case "Electric":
        return <Zap className="h-5 w-5" />;
      case "Petrol":
      case "Diesel":
      case "Hybrid":
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

  const handleSearchSubmit = (searchData: any) => {
    console.log("Search submitted from vehicle detail:", searchData);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const relatedVehicles = vehiclesData
    .filter((v) => v.id !== vehicleId && v.category === vehicle.category)
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
                        <Badge
                          className={`${getCategoryColor(
                            vehicle.category
                          )} font-semibold`}
                        >
                          {tFilters(
                            `categories.${vehicle.category.toLowerCase()}`
                          )}
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
                      {tVehicle("relatedVehicles")}
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
                                {tFilters(
                                  `categories.${relatedVehicle.category.toLowerCase()}`
                                )}
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

          {/* Right Column - Booking */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price and Booking */}
            <AnimatedContainer direction="left" delay={0.3}>
              <Card className="border-0 shadow-xl sticky top-6">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      €{vehicle.price}
                    </div>
                    <div className="text-gray-600">{tVehicle("perDay")}</div>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4 mb-6">
                    <CarSearchComponent
                      className="!p-4 !bg-gray-50"
                      onSearch={handleSearchSubmit}
                      compact={true}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white font-semibold py-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {tVehicle("bookNow")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {tVehicle("callNow")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {tVehicle("getQuote")}
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {tVehicle("needHelp")}
                      </p>
                      <p className="font-semibold text-carbookers-red-600">
                        +212612077309
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
