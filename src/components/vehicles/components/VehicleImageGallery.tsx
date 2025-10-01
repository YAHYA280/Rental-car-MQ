// src/components/vehicles/VehicleImageGallery.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { CarData } from "@/components/types";
import Image from "next/image";

interface VehicleImageGalleryProps {
  vehicle: CarData;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const VehicleImageGallery: React.FC<VehicleImageGalleryProps> = ({
  vehicle,
  isFavorite,
  onFavoriteToggle,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Get available images for gallery
  const getAvailableImages = () => {
    const images = [];

    // Add main image
    if (vehicle.mainImage?.dataUrl) {
      images.push(vehicle.mainImage.dataUrl);
    } else if (vehicle.image) {
      images.push(vehicle.image);
    }

    // Add additional images
    if (vehicle.images && vehicle.images.length > 0) {
      vehicle.images.forEach((img) => {
        if (img.dataUrl) {
          images.push(img.dataUrl);
        }
      });
    }

    // If no images, return fallback
    return images.length > 0 ? images : ["/cars/car1.jpg"];
  };

  const images = getAvailableImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.name}`,
        text: `Check out this ${vehicle.brand} ${vehicle.name} for rent!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <div className="relative">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={`${vehicle.brand} ${vehicle.name}`}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              e.currentTarget.src = "/cars/car1.jpg";
            }}
          />

          {/* Brand Badge */}
          <Badge className="absolute top-4 left-4 bg-carbookers-red-600 text-white font-semibold shadow-lg">
            {vehicle.brand}
          </Badge>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFavoriteToggle}
              className="bg-white/80 hover:bg-white/90 p-2 shadow-lg"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="bg-white/80 hover:bg-white/90 p-2 shadow-lg"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

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
  );
};

export default VehicleImageGallery;
