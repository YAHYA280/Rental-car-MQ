"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";

// Import unified types
import { CarData } from "@/components/types";

interface CarDetailsModalProps {
  car: CarData | null;
  onClose: () => void;
  onEdit: (car: CarData) => void;
}

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  car,
  onClose,
  onEdit,
}) => {
  const t = useTranslations("dashboard.cars");

  const getStatusBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800">
        {t("statusBadges.available")}
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        {t("statusBadges.rented")}
      </Badge>
    );
  };

  // Get proper image URL with fallback
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
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${
            car.image
          }`;
    }
    return "/cars/car1.jpg"; // Fallback placeholder
  };

  // Format WhatsApp number for display
  const formatWhatsAppNumber = (number: string) => {
    if (number.length === 10) {
      return `${number.substring(0, 2)} ${number.substring(
        2,
        4
      )} ${number.substring(4, 6)} ${number.substring(6, 8)} ${number.substring(
        8,
        10
      )}`;
    }
    return number;
  };

  if (!car) return null;

  return (
    <Dialog open={car !== null} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-16px)] max-w-4xl h-[calc(100vh-32px)] max-h-[90vh] sm:w-[min(900px,95vw)] sm:max-w-[min(1200px,95vw)] sm:h-auto flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-3 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {t("details.title")}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {t("details.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 sm:px-0">
          <div className="space-y-4 sm:space-y-6 pb-4">
            {/* Car Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="w-full sm:w-24 h-32 sm:h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(car)}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/cars/car1.jpg";
                  }}
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <h3 className="text-lg sm:text-xl font-bold">
                  {car.brand} {car.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">{car.year}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {car.licensePlate}
                </p>
                <div className="mt-2">{getStatusBadge(car.available)}</div>
              </div>
            </div>

            {/* Car Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {t("details.basicInfo")}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">{t("details.seats")}:</span>{" "}
                    <span className="font-medium">{car.seats}</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">{t("details.doors")}:</span>{" "}
                    <span className="font-medium">{car.doors}</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("details.transmission")}:
                    </span>{" "}
                    <span className="font-medium">{car.transmission}</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("details.fuelType")}:
                    </span>{" "}
                    <span className="font-medium">{car.fuelType}</span>
                  </p>
                  {car.mileage && (
                    <p className="text-sm sm:text-base">
                      <span className="text-gray-600">
                        {t("details.mileage")}:
                      </span>{" "}
                      <span className="font-medium">
                        {car.mileage.toLocaleString()} km
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {t("details.pricing")}
                </h4>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm sm:text-base">
                      <span className="text-gray-600">
                        {t("details.dailyPrice")}:
                      </span>
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                      €{car.price}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        / {t("table.perDay")}
                      </span>
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm sm:text-base">
                      <span className="text-gray-600">
                        {t("details.caution")}:
                      </span>
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-orange-600">
                      €{car.caution}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        ({t("table.deposit")})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {t("details.contactInfo")}
                </h4>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base">
                      WhatsApp:
                    </span>
                    <a
                      href={`https://wa.me/${car.whatsappNumber?.replace(
                        /\s/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline  items-center gap-1 font-medium text-sm sm:text-base bg-green-50 p-2 rounded-lg inline-flex w-fit"
                    >
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="break-all">
                        {car.whatsappNumber
                          ? formatWhatsAppNumber(car.whatsappNumber)
                          : ""}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {t("details.maintenance")}
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {t("details.lastTechnicalVisit")}:
                    </p>
                    <p
                      className={`text-sm sm:text-base font-medium ${
                        car.lastTechnicalVisit
                          ? "text-gray-900"
                          : "text-red-500"
                      }`}
                    >
                      {car.lastTechnicalVisit
                        ? new Date(car.lastTechnicalVisit).toLocaleDateString()
                        : t("details.notRecorded")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {t("details.lastOilChange")}:
                    </p>
                    <p
                      className={`text-sm sm:text-base font-medium ${
                        car.lastOilChange ? "text-gray-900" : "text-red-500"
                      }`}
                    >
                      {car.lastOilChange
                        ? new Date(car.lastOilChange).toLocaleDateString()
                        : t("details.notRecorded")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Bookings Info */}
              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {t("details.statusStats")}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("details.status")}:
                    </span>{" "}
                    <span className="font-medium capitalize">{car.status}</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("details.totalBookings")}:
                    </span>{" "}
                    <span className="font-medium">{car.totalBookings}</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("details.rating")}:
                    </span>{" "}
                    <span className="font-medium">{car.rating}/5</span>
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {t("details.features")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {car.features && car.features.length > 0 ? (
                    car.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm"
                      >
                        {t(`form.features.${feature}`)}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      {t("details.noFeatures")}
                    </p>
                  )}
                </div>
              </div>

              {/* Description if available */}
              {car.description && (
                <div className="sm:col-span-2 p-3 sm:p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                    {t("details.description")}
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm sm:text-base leading-relaxed">
                    {car.description}
                  </p>
                </div>
              )}

              {/* Created/Updated info */}
              <div className="sm:col-span-2 p-3 sm:p-4 bg-gray-50 border rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{t("details.created")}:</span>{" "}
                    {new Date(car.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("details.lastUpdated")}:
                    </span>{" "}
                    {new Date(car.updatedAt).toLocaleString()}
                  </div>
                  {car.createdBy && (
                    <div className="sm:col-span-2">
                      <span className="font-medium">
                        {t("details.createdBy")}:
                      </span>{" "}
                      {car.createdBy.name} ({car.createdBy.email})
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-3 sm:pt-4 border-t bg-white flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {t("details.close")}
          </Button>
          <Button
            className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
            onClick={() => {
              onEdit(car);
              onClose();
            }}
          >
            {t("details.edit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CarDetailsModal;
