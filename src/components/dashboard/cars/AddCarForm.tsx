// src/components/dashboard/cars/AddCarForm.tsx - With built-in Toaster
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast, Toaster } from "sonner";
import { AlertTriangle, CheckCircle } from "lucide-react";

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
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
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

    // Mark field as touched
    setTouchedFields((prev) => new Set([...prev, field]));

    // Clear error when user starts typing and validate immediately
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Immediate validation for better UX
    validateSingleField(field, value);
  };

  const handleMainImageChange = (file: File | undefined) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: file,
    }));
    setTouchedFields((prev) => new Set([...prev, "mainImage"]));

    // Clear error immediately if file is selected
    if (file && errors.mainImage) {
      setErrors((prev) => ({ ...prev, mainImage: "" }));
    }
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

  const validateYear = (year: string): boolean => {
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    return yearNum >= 2000 && yearNum <= 2030; // Updated max year to 2030
  };

  const validatePrice = (price: string): boolean => {
    const priceNum = parseFloat(price);
    return !isNaN(priceNum) && priceNum > 0 && priceNum <= 10000; // Reasonable price range
  };

  const validateSingleField = (field: string, value: string) => {
    const newErrors: Record<string, string> = { ...errors };

    switch (field) {
      case "brand":
        if (!value.trim()) {
          newErrors.brand = t("cars.form.validation.brandRequired");
        } else {
          delete newErrors.brand;
        }
        break;

      case "name":
        if (!value.trim()) {
          newErrors.name = t("cars.form.validation.nameRequired");
        } else if (value.trim().length < 2) {
          newErrors.name = "Car name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          newErrors.name = "Car name cannot exceed 50 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "year":
        if (!value) {
          newErrors.year = t("cars.form.validation.yearRequired");
        } else if (!validateYear(value)) {
          newErrors.year = "Year must be between 2000 and 2030";
        } else {
          delete newErrors.year;
        }
        break;

      case "licensePlate":
        if (!value) {
          newErrors.licensePlate = t(
            "cars.form.validation.licensePlateRequired"
          );
        } else if (!validateLicensePlate(value)) {
          newErrors.licensePlate = t("cars.form.validation.licensePlateFormat");
        } else {
          delete newErrors.licensePlate;
        }
        break;

      case "dailyPrice":
        if (!value) {
          newErrors.dailyPrice = t("cars.form.validation.dailyPriceRequired");
        } else if (!validatePrice(value)) {
          newErrors.dailyPrice =
            "Please enter a valid price between €1 and €10,000";
        } else {
          delete newErrors.dailyPrice;
        }
        break;

      case "caution":
        if (!value) {
          newErrors.caution = t("cars.form.validation.cautionRequired");
        } else if (!validatePrice(value)) {
          newErrors.caution =
            "Please enter a valid caution amount between €1 and €10,000";
        } else {
          delete newErrors.caution;
        }
        break;

      case "whatsappNumber":
        if (!value) {
          newErrors.whatsappNumber = t("cars.form.validation.whatsappRequired");
        } else if (!validateWhatsAppNumber(value)) {
          newErrors.whatsappNumber =
            "Please enter a valid WhatsApp number (06XXXXXXXX or 07XXXXXXXX)";
        } else {
          delete newErrors.whatsappNumber;
        }
        break;

      case "transmission":
        if (!value) {
          newErrors.transmission = t(
            "cars.form.validation.transmissionRequired"
          );
        } else {
          delete newErrors.transmission;
        }
        break;

      case "fuelType":
        if (!value) {
          newErrors.fuelType = t("cars.form.validation.fuelTypeRequired");
        } else {
          delete newErrors.fuelType;
        }
        break;

      case "seats":
        if (!value) {
          newErrors.seats = t("cars.form.validation.seatsRequired");
        } else {
          delete newErrors.seats;
        }
        break;

      case "doors":
        if (!value) {
          newErrors.doors = t("cars.form.validation.doorsRequired");
        } else {
          delete newErrors.doors;
        }
        break;
    }

    setErrors(newErrors);
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
    let hasErrors = false;

    // Required fields validation with detailed messages
    if (!formData.brand) {
      newErrors.brand = t("cars.form.validation.brandRequired");
      hasErrors = true;
    }

    if (!formData.name.trim()) {
      newErrors.name = t("cars.form.validation.nameRequired");
      hasErrors = true;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Car name must be at least 2 characters";
      hasErrors = true;
    }

    if (!formData.year) {
      newErrors.year = t("cars.form.validation.yearRequired");
      hasErrors = true;
    } else if (!validateYear(formData.year)) {
      newErrors.year = "Year must be between 2000 and 2030";
      hasErrors = true;
    }

    if (!formData.licensePlate) {
      newErrors.licensePlate = t("cars.form.validation.licensePlateRequired");
      hasErrors = true;
    } else if (!validateLicensePlate(formData.licensePlate)) {
      newErrors.licensePlate = t("cars.form.validation.licensePlateFormat");
      hasErrors = true;
    }

    if (!formData.transmission) {
      newErrors.transmission = t("cars.form.validation.transmissionRequired");
      hasErrors = true;
    }

    if (!formData.fuelType) {
      newErrors.fuelType = t("cars.form.validation.fuelTypeRequired");
      hasErrors = true;
    }

    if (!formData.seats) {
      newErrors.seats = t("cars.form.validation.seatsRequired");
      hasErrors = true;
    }

    if (!formData.doors) {
      newErrors.doors = t("cars.form.validation.doorsRequired");
      hasErrors = true;
    }

    if (!formData.dailyPrice) {
      newErrors.dailyPrice = t("cars.form.validation.dailyPriceRequired");
      hasErrors = true;
    } else if (!validatePrice(formData.dailyPrice)) {
      newErrors.dailyPrice =
        "Please enter a valid price between €1 and €10,000";
      hasErrors = true;
    }

    if (!formData.caution) {
      newErrors.caution = t("cars.form.validation.cautionRequired");
      hasErrors = true;
    } else if (!validatePrice(formData.caution)) {
      newErrors.caution =
        "Please enter a valid caution amount between €1 and €10,000";
      hasErrors = true;
    }

    if (!formData.whatsappNumber) {
      newErrors.whatsappNumber = t("cars.form.validation.whatsappRequired");
      hasErrors = true;
    } else if (!validateWhatsAppNumber(formData.whatsappNumber)) {
      newErrors.whatsappNumber =
        "Please enter a valid WhatsApp number (06XXXXXXXX or 07XXXXXXXX)";
      hasErrors = true;
    }

    if (!formData.mainImage) {
      newErrors.mainImage = t("cars.form.validation.mainImageRequired");
      hasErrors = true;
    }

    setErrors(newErrors);

    // Show error toast with specific issues
    if (hasErrors) {
      const errorCount = Object.keys(newErrors).length;
      toast.error("Form Validation Failed", {
        description: `Please fix ${errorCount} error${
          errorCount > 1 ? "s" : ""
        } before submitting`,
        icon: <AlertTriangle className="h-4 w-4" />,
        duration: 4000,
      });
    }

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      const errorElement =
        document.querySelector(`[data-error="${firstErrorField}"]`) ||
        document.querySelector(`#${firstErrorField}`) ||
        document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);

      // Show success toast
      toast.success("Car Added Successfully! 🚗", {
        description: `${formData.brand} ${formData.name} has been added to your fleet`,
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 5000,
        action: {
          label: "View Cars",
          onClick: () => console.log("Navigate to cars list"),
        },
      });

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
      setErrors({});
      setTouchedFields(new Set());
    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Show error toast with specific message
      toast.error("Failed to Add Car ❌", {
        description:
          error?.message || "An unexpected error occurred. Please try again.",
        icon: <AlertTriangle className="h-4 w-4" />,
        duration: 6000,
        action: {
          label: "Retry",
          onClick: () => handleSubmit(e),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              touchedFields={touchedFields}
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
              touchedFields={touchedFields}
              onInputChange={handleInputChange}
            />

            <PricingSection
              formData={{
                dailyPrice: formData.dailyPrice,
                caution: formData.caution,
              }}
              errors={errors}
              touchedFields={touchedFields}
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
              touchedFields={touchedFields}
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
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("common.loading")}
              </>
            ) : (
              t("cars.form.submit")
            )}
          </Button>
        </div>
      </form>

      {/* Built-in Toaster - This ensures toasts appear! */}
      <Toaster
        position="top-right"
        richColors
        duration={4000}
        closeButton
        expand={false}
        visibleToasts={5}
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e5e7eb",
            color: "#374151",
            fontSize: "14px",
          },
          className: "font-sans",
          descriptionClassName: "text-gray-600",
          actionButtonStyle: {
            background: "#dc2626",
            color: "white",
          },
        }}
      />
    </>
  );
};

export default AddCarForm;
