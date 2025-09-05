// src/components/dashboard/cars/EditCarForm.tsx - Fixed with proper data loading
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Upload, Plus } from "lucide-react";
import { format } from "date-fns";

// Import form section components
import BasicInfoSection from "./components/form/BasicInfoSection";
import TechnicalSpecsSection from "./components/form/TechnicalSpecsSection";
import PricingSection from "./components/form/PricingSection";
import MaintenanceSection from "./components/form/MaintenanceSection";
import FeaturesSection from "./components/form/FeaturesSection";

// Import types
interface CarData {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  image: string;
  seats: number;
  doors: number;
  transmission: string;
  fuelType: string;
  available: boolean;
  rating: number;
  totalBookings?: number;
  mileage?: number;
  features?: string[];
  description?: string;
  licensePlate?: string;
  caution?: number;
  whatsappNumber?: string;
  lastTechnicalVisit?: string;
  lastOilChange?: string;
  status: "active" | "maintenance" | "inactive";
  createdAt: string;
  updatedAt: string;
  mainImage?: {
    filename: string;
    originalName: string;
    path: string;
    fullPath?: string;
  };
  images?: Array<{
    filename: string;
    originalName: string;
    path: string;
    fullPath?: string;
  }>;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

interface CarFormData {
  brand: string;
  name: string;
  year: string;
  licensePlate: string;
  transmission: string;
  fuelType: string;
  seats: string;
  doors: string;
  mileage: string;
  dailyPrice: string;
  caution: string;
  whatsappNumber: string;
  lastTechnicalVisit: string;
  lastOilChange: string;
  features: string[];
  mainImage?: File;
  additionalImages: File[];
  description?: string;
}

interface EditCarFormProps {
  car: CarData;
  onSubmit: (data: CarFormData) => Promise<void>;
  onClose: () => void;
}

const EditCarForm: React.FC<EditCarFormProps> = ({
  car,
  onSubmit,
  onClose,
}) => {
  const t = useTranslations("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    name: "",
    year: "",
    licensePlate: "",
    transmission: "",
    fuelType: "",
    seats: "",
    doors: "",
    mileage: "",
    dailyPrice: "",
    caution: "",
    whatsappNumber: "",
    lastTechnicalVisit: "",
    lastOilChange: "",
    features: [],
    additionalImages: [],
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [technicalVisitDate, setTechnicalVisitDate] = useState<
    Date | undefined
  >();
  const [oilChangeDate, setOilChangeDate] = useState<Date | undefined>();

  // Initialize form data with car data - FIXED VERSION
  useEffect(() => {
    if (car) {
      console.log("Loading car data for editing:", car); // Debug log

      // Create the properly mapped form data
      const mappedFormData: CarFormData = {
        brand: car.brand || "",
        name: car.name || "",
        year: car.year?.toString() || "",
        licensePlate: car.licensePlate || "",
        transmission: car.transmission || "",
        fuelType: car.fuelType || "",
        seats: car.seats?.toString() || "",
        doors: car.doors?.toString() || "",
        mileage: car.mileage?.toString() || "0",
        dailyPrice: car.price?.toString() || "",
        caution: car.caution?.toString() || "",
        whatsappNumber: car.whatsappNumber || "",
        lastTechnicalVisit: car.lastTechnicalVisit || "",
        lastOilChange: car.lastOilChange || "",
        features: Array.isArray(car.features) ? car.features : [],
        additionalImages: [],
        description: car.description || "",
      };

      console.log("Mapped form data:", mappedFormData); // Debug log
      setFormData(mappedFormData);

      // Set dates if they exist and are valid
      if (car.lastTechnicalVisit) {
        try {
          const techDate = new Date(car.lastTechnicalVisit);
          if (!isNaN(techDate.getTime())) {
            setTechnicalVisitDate(techDate);
          }
        } catch (error) {
          console.warn("Invalid technical visit date:", car.lastTechnicalVisit);
        }
      }

      if (car.lastOilChange) {
        try {
          const oilDate = new Date(car.lastOilChange);
          if (!isNaN(oilDate.getTime())) {
            setOilChangeDate(oilDate);
          }
        } catch (error) {
          console.warn("Invalid oil change date:", car.lastOilChange);
        }
      }
    }
  }, [car]);

  // Debug log for form data changes
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  // Create a type-compatible handleInputChange function
  const handleInputChange = (field: string, value: string) => {
    console.log(`Changing ${field} to:`, value); // Debug log
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMainImageChange = (file: File | undefined) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: file,
    }));
  };

  const handleAdditionalImagesChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...fileArray],
      }));
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const validateLicensePlate = (plate: string): boolean => {
    // Format: 5 digits + 1 letter (e.g., 12345A)
    const plateRegex = /^\d{5}[A-Z]$/;
    return plateRegex.test(plate.toUpperCase());
  };

  const validateWhatsAppNumber = (number: string): boolean => {
    // Updated validation for 10-digit format: 06XXXXXXXX or 07XXXXXXXX
    const phoneRegex = /^0[67]\d{8}$/;
    return phoneRegex.test(number.replace(/\s/g, ""));
  };

  const handleDateChange = (
    date: Date | undefined,
    field: "technicalVisit" | "oilChange"
  ) => {
    if (date) {
      const dateString = format(date, "yyyy-MM-dd");
      if (field === "technicalVisit") {
        setTechnicalVisitDate(date);
        handleInputChange("lastTechnicalVisit", dateString);
      } else {
        setOilChangeDate(date);
        handleInputChange("lastOilChange", dateString);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.brand)
      newErrors.brand = t("cars.form.validation.brandRequired");
    if (!formData.name) newErrors.name = t("cars.form.validation.nameRequired");
    if (!formData.year) newErrors.year = t("cars.form.validation.yearRequired");
    if (!formData.licensePlate) {
      newErrors.licensePlate = t("cars.form.validation.licensePlateRequired");
    } else if (!validateLicensePlate(formData.licensePlate)) {
      newErrors.licensePlate = t("cars.form.validation.licensePlateFormat");
    }
    if (!formData.transmission)
      newErrors.transmission = t("cars.form.validation.transmissionRequired");
    if (!formData.fuelType)
      newErrors.fuelType = t("cars.form.validation.fuelTypeRequired");
    if (!formData.seats)
      newErrors.seats = t("cars.form.validation.seatsRequired");
    if (!formData.doors)
      newErrors.doors = t("cars.form.validation.doorsRequired");
    if (!formData.dailyPrice)
      newErrors.dailyPrice = t("cars.form.validation.dailyPriceRequired");
    if (!formData.caution)
      newErrors.caution = t("cars.form.validation.cautionRequired");
    if (!formData.whatsappNumber) {
      newErrors.whatsappNumber = t("cars.form.validation.whatsappRequired");
    } else if (!validateWhatsAppNumber(formData.whatsappNumber)) {
      newErrors.whatsappNumber =
        "Please enter a valid WhatsApp number (06XXXXXXXX or 07XXXXXXXX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", formData); // Debug log
      await onSubmit(formData);
    } catch (error) {
      console.error("Error updating car:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current image URL with fallback
  const getCurrentImageUrl = () => {
    if (car.mainImage?.fullPath) {
      return car.mainImage.fullPath;
    }
    if (car.mainImage?.path) {
      return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${
        car.mainImage.path
      }`;
    }
    if (car.image) {
      return car.image.startsWith("http")
        ? car.image
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${
            car.image
          }`;
    }
    return "/cars/car1.jpg";
  };

  // Show loading state while form data is being set
  if (!formData.brand && car.brand) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carbookers-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading car data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="space-y-4 sm:space-y-6">
          <BasicInfoSection
            formData={{
              brand: formData.brand,
              name: formData.name,
              year: formData.year,
              licensePlate: formData.licensePlate,
              whatsappNumber: formData.whatsappNumber,
            }}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <TechnicalSpecsSection
            formData={{
              transmission: formData.transmission,
              fuelType: formData.fuelType,
              seats: formData.seats,
              doors: formData.doors,
              mileage: formData.mileage,
            }}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <PricingSection
            formData={{
              dailyPrice: formData.dailyPrice,
              caution: formData.caution,
            }}
            errors={errors}
            onInputChange={handleInputChange}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          <MaintenanceSection
            technicalVisitDate={technicalVisitDate}
            oilChangeDate={oilChangeDate}
            onDateChange={handleDateChange}
          />

          <FeaturesSection
            selectedFeatures={formData.features}
            onToggleFeature={toggleFeature}
          />

          {/* Current Image Display */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Current Vehicle Image
              </h3>
              <div className="w-full h-40 sm:h-48 relative rounded-lg overflow-hidden mb-3 sm:mb-4">
                <img
                  src={getCurrentImageUrl()}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/cars/car1.jpg";
                  }}
                />
              </div>

              {/* New Image Upload */}
              <div>
                <Label htmlFor="mainImage" className="text-sm sm:text-base">
                  Upload New Image (Optional)
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Leave empty to keep the current image
                </p>
                <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center border-gray-300">
                  {formData.mainImage ? (
                    <div className="space-y-3">
                      <div className="w-24 sm:w-32 h-18 sm:h-24 mx-auto relative">
                        <img
                          src={URL.createObjectURL(formData.mainImage)}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleMainImageChange(undefined)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 break-all px-2">
                        {formData.mainImage.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                        Upload New Main Image
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                        JPG, PNG or WebP (Max 10MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={(e) => handleMainImageChange(e.target.files?.[0])}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("mainImage")?.click()
                    }
                    className="w-full sm:w-auto text-sm"
                  >
                    {formData.mainImage ? "Change Image" : "Choose Image"}
                  </Button>
                </div>
              </div>

              {/* Additional Images */}
              <div className="mt-4 sm:mt-6">
                <Label
                  htmlFor="additionalImages"
                  className="text-sm sm:text-base"
                >
                  Add More Images (Optional)
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Upload additional images to showcase the vehicle
                </p>

                {formData.additionalImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    {formData.additionalImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-16 sm:h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  id="additionalImages"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleAdditionalImagesChange(e.target.files)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("additionalImages")?.click()
                  }
                  className="w-full sm:w-auto text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Add More Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Car"}
        </Button>
      </div>
    </form>
  );
};

export default EditCarForm;
