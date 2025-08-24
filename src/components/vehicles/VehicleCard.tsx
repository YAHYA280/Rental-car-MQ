// src/components/vehicles/VehicleCard.tsx - Fixed version
"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Car,
  Fuel,
  MapPin,
  Eye,
  Heart,
  Zap,
  Settings,
} from "lucide-react";
import { Vehicle } from "@/components/types/vehicle";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode: "grid" | "list";
  onFavorite?: (vehicleId: string) => void;
  isFavorite?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  viewMode,
  onFavorite,
  isFavorite = false,
}) => {
  const t = useTranslations("vehicles");
  const tFilters = useTranslations("filters");
  const locale = useLocale();

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
        return <Zap className="h-4 w-4" />;
      case "Petrol":
      case "Diesel":
      case "Hybrid":
      default:
        return <Fuel className="h-4 w-4" />;
    }
  };

  const getTransmissionIcon = (transmission: string) => {
    return transmission === "Manual" ? (
      <Settings className="h-4 w-4" />
    ) : (
      <Car className="h-4 w-4" />
    );
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden group">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 relative overflow-hidden">
            <div className="aspect-video md:aspect-square relative">
              <Image
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.name}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Category Badge */}
              <Badge
                className={`absolute top-3 left-3 ${getCategoryColor(
                  vehicle.category
                )} font-semibold`}
              >
                {tFilters(`categories.${vehicle.category.toLowerCase()}`)}
              </Badge>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 bg-white/80 hover:bg-white/90 p-2"
                onClick={() => onFavorite?.(vehicle.id)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </Button>

              {/* Rating */}
              <div className="absolute bottom-3 left-3 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                <span className="text-xs font-semibold text-gray-900">
                  {vehicle.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {vehicle.brand} {vehicle.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {vehicle.model} {vehicle.year}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="h-3 w-3" />
                  {vehicle.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  €{vehicle.price}
                </div>
                <div className="text-sm text-gray-600">{t("perDay")}</div>
              </div>
            </div>

            {/* Vehicle Specs */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{vehicle.seats}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getTransmissionIcon(vehicle.transmission)}
                <span>
                  {tFilters(
                    `transmissions.${vehicle.transmission.toLowerCase()}`
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getFuelIcon(vehicle.fuelType)}
                <span>
                  {tFilters(`fuelTypes.${vehicle.fuelType.toLowerCase()}`)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Car className="h-4 w-4" />
                <span>
                  {vehicle.doors} {t("doors")}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {vehicle.features.slice(0, 3).map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {vehicle.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{vehicle.features.length - 3} {t("more")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link
                href={{
                  pathname: "/vehicles/[id]",
                  params: { id: vehicle.id },
                }}
                className="flex-1"
              >
                <Button className="w-full bg-black hover:bg-carbookers-red-600 text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  {t("viewDetails")}
                </Button>
              </Link>
              <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white">
                {t("bookNow")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group">
      <div className="relative overflow-hidden">
        {/* Car Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.name}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300" />

          {/* Category Badge */}
          <Badge
            className={`absolute top-4 left-4 ${getCategoryColor(
              vehicle.category
            )} font-semibold shadow-lg`}
          >
            {tFilters(`categories.${vehicle.category.toLowerCase()}`)}
          </Badge>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 p-2 shadow-lg"
            onClick={() => onFavorite?.(vehicle.id)}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button>

          {/* Rating */}
          <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-semibold text-gray-900">
              {vehicle.rating}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Vehicle Info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {vehicle.brand} {vehicle.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {vehicle.model} {vehicle.year}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="h-3 w-3" />
              {vehicle.location}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              €{vehicle.price}
            </div>
            <div className="text-xs text-gray-600">{t("perDay")}</div>
          </div>
        </div>

        {/* Vehicle Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {vehicle.seats} {t("seats")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getTransmissionIcon(vehicle.transmission)}
            <span>
              {tFilters(`transmissions.${vehicle.transmission.toLowerCase()}`)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getFuelIcon(vehicle.fuelType)}
            <span>
              {tFilters(`fuelTypes.${vehicle.fuelType.toLowerCase()}`)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Car className="h-4 w-4" />
            <span>
              {vehicle.doors} {t("doors")}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1">
            {vehicle.features.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {vehicle.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{vehicle.features.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href={{ pathname: "/vehicles/[id]", params: { id: vehicle.id } }}
          >
            <Button
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              {t("viewDetails")}
            </Button>
          </Link>
          <Button className="w-full bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white font-semibold">
            {t("bookNow")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
