// src/components/dashboard/cars/AddCarForm.tsx - Updated with model field
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Import form section components
import BasicInfoSection from "./components/form/BasicInfoSection";
import TechnicalSpecsSection from "./components/form/TechnicalSpecsSection";
import PricingSection from "./components/form/PricingSection";
import MaintenanceSection from "./components/form/MaintenanceSection";
import FeaturesSection from "./components/form/FeaturesSection";
import ImagesSection from "./components/form/ImagesSection";

// Import the unified types
import { CarFormData } from "../../types";

interface AddCarFormProps {
  onSubmit: (data: CarFormData) => Promise<void>;
  onClose: () => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ onSubmit, onClose }) => {
  const t = useTranslations("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CarFormData>({
    // Basic Info
    brand: "",
    name: "",
    year: "",
    licensePlate: "",

    // Technical Specs
    transmission: "",
    fuelType: "",
    seats: "",
    doors: "",
    mileage: "",

    // Pricing
    dailyPrice: "",
    caution: "",

    // Contact
    whatsappNumber: "",

    // Maintenance
    lastTechnicalVisit: "",
    lastOilChange: "",

    // Features and Images
    features: [],
    additionalImages: [],
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [technicalVisitDate, setTechnicalVisitDate] = useState<
    Date | undefined
  >();
  const [oilChangeDate, setOilChangeDate] = useState<Date | undefined>();

  // Create a type-compatible handleInputChange function
  const handleInputChange = (field: string, value: string) => {
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
    if (!formData.mainImage)
      newErrors.mainImage = t("cars.form.validation.mainImageRequired");

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
      await onSubmit(formData);
      // Reset form on success
      setFormData({
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
      setTechnicalVisitDate(undefined);
      setOilChangeDate(undefined);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <ImagesSection
            mainImage={formData.mainImage}
            additionalImages={formData.additionalImages}
            errors={errors}
            onMainImageChange={handleMainImageChange}
            onAdditionalImagesChange={handleAdditionalImagesChange}
            onRemoveAdditionalImage={removeAdditionalImage}
          />
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
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("common.loading") : t("cars.form.submit")}
        </Button>
      </div>
    </form>
  );
};

export default AddCarForm;
