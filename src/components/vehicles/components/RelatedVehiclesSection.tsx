// src/components/vehicles/RelatedVehiclesSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { CarData } from "@/components/types";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface RelatedVehiclesSectionProps {
  vehicle: CarData;
  relatedVehicles: CarData[];
}

const RelatedVehiclesSection: React.FC<RelatedVehiclesSectionProps> = ({
  vehicle,
  relatedVehicles,
}) => {
  const tVehicle = useTranslations("vehicleDetail");

  // Get proper image URL using unified types
  const getImageUrl = (car: CarData) => {
    // Priority: mainImage dataUrl > image field > fallback
    if (car.mainImage?.dataUrl) {
      return car.mainImage.dataUrl;
    }
    if (car.image) {
      return car.image.startsWith("http")
        ? car.image
        : car.image.startsWith("data:")
        ? car.image
        : "/cars/car1.jpg";
    }
    return "/cars/car1.jpg";
  };

  if (relatedVehicles.length === 0) {
    return null;
  }

  return (
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
                    src={getImageUrl(relatedVehicle)}
                    alt={`${relatedVehicle.brand} ${relatedVehicle.name}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/cars/car1.jpg";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm">
                    {relatedVehicle.brand} {relatedVehicle.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">
                    {relatedVehicle.year}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs">{relatedVehicle.rating}</span>
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
  );
};

export default RelatedVehiclesSection;
