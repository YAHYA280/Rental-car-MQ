"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Upload, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast, Toaster } from "sonner"; // Import both toast and Toaster

// Import form section components
import BasicInfoSection from "./components/form/BasicInfoSection";
import TechnicalSpecsSection from "./components/form/TechnicalSpecsSection";
import PricingSection from "./components/form/PricingSection";
import MaintenanceSection from "./components/form/MaintenanceSection";
import FeaturesSection from "./components/form/FeaturesSection";

// Import unified types
import { CarData, CarFormData } from "@/components/types";

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
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [technicalVisitDate, setTechnicalVisitDate] = useState<
    Date | undefined
  >();
  const [oilChangeDate, setOilChangeDate] = useState<Date | undefined>();

  // Initialize form data with car data
  useEffect(() => {
    if (car) {
      console.log("Loading car data for editing:", car);

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

      console.log("Mapped form data:", mappedFormData);
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

  const validateLicensePlate = (plate: string): boolean => {
    const trimmedPlate = plate.trim();
    return trimmedPlate.length >= 1 && trimmedPlate.length <= 20;
  };

  const validateWhatsAppNumber = (number: string): boolean => {
    const phoneRegex = /^0[67]\d{8}$/;
    return phoneRegex.test(number.replace(/\s/g, ""));
  };

  const validateYear = (year: string): boolean => {
    const yearNum = parseInt(year);
    return yearNum >= 2000 && yearNum <= 2030; // Updated max year to 2030
  };

  const validatePrice = (price: string): boolean => {
    const priceNum = parseFloat(price);
    return !isNaN(priceNum) && priceNum > 0 && priceNum <= 10000;
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
        if (!value.trim()) {
          newErrors.licensePlate = t(
            "cars.form.validation.licensePlateRequired"
          );
        } else if (!validateLicensePlate(value)) {
          newErrors.licensePlate = "License plate must be between 1 and 20 characters";
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

  const handleInputChange = (field: string, value: string) => {
    console.log(`Changing ${field} to:`, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Mark field as touched
    setTouchedFields((prev) => new Set([...prev, field]));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Immediate validation
    validateSingleField(field, value);
  };

  const handleMainImageChange = (file: File | undefined) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: file,
    }));
    setTouchedFields((prev) => new Set([...prev, "mainImage"]));
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

    // Required fields validation
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

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = t("cars.form.validation.licensePlateRequired");
      hasErrors = true;
    } else if (!validateLicensePlate(formData.licensePlate)) {
      newErrors.licensePlate = "License plate must be between 1 and 20 characters";
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

    setErrors(newErrors);

    // Show error toast with specific issues
    if (hasErrors) {
      const errorCount = Object.keys(newErrors).length;
      toast.error("Form Validation Failed", {
        description: `Please fix ${errorCount} error${
          errorCount > 1 ? "s" : ""
        } before updating`,
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
      console.log("Submitting form data:", formData);
      await onSubmit(formData);

      // Show success toast
      toast.success("Car Updated Successfully! ✅", {
        description: `${formData.brand} ${formData.name} has been updated`,
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 5000,
        action: {
          label: "View Car",
          onClick: () => console.log("Navigate to car details"),
        },
      });
    } catch (error: any) {
      console.error("Error updating car:", error);

      // Show error toast with specific message
      toast.error("Failed to Update Car ❌", {
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

  // FIXED: Get current image URL using unified types
  const getCurrentImageUrl = () => {
    // Priority: mainImage dataUrl > image field > fallback
    if (car.mainImage?.dataUrl) {
      return car.mainImage.dataUrl;
    }
    if (car.image) {
      return car.image.startsWith("http")
        ? car.image
        : car.image.startsWith("data:")
        ? car.image // Already a data URL
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
                      onChange={(e) =>
                        handleMainImageChange(e.target.files?.[0])
                      }
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
                    onChange={(e) =>
                      handleAdditionalImagesChange(e.target.files)
                    }
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
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Car"
            )}
          </Button>
        </div>
      </form>

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

export default EditCarForm;
