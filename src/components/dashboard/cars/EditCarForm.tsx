// src/components/dashboard/cars/EditCarForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus, Calendar as CalendarIcon, Phone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Import types from DashboardCarsContent
interface CarData {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  seats: number;
  doors: number;
  transmission: string;
  fuelType: string;
  available: boolean;
  rating: number;
  bookings?: number;
  mileage?: number;
  features?: string[];
  description?: string;
  licensePlate?: string;
  caution?: number;
  whatsappNumber?: string;
  lastTechnicalVisit?: string;
  lastOilChange?: string;
}

interface CarFormData {
  brand: string;
  name: string;
  model: string;
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
    model: "",
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

  // Initialize form data with car data
  useEffect(() => {
    if (car) {
      setFormData({
        brand: car.brand || "",
        name: car.name || "",
        model: car.model || "",
        year: car.year?.toString() || "",
        licensePlate: car.licensePlate || "",
        transmission: car.transmission || "",
        fuelType: car.fuelType || "",
        seats: car.seats?.toString() || "",
        doors: car.doors?.toString() || "",
        mileage: car.mileage?.toString() || "",
        dailyPrice: car.price?.toString() || "",
        caution: car.caution?.toString() || "",
        whatsappNumber: car.whatsappNumber || "",
        lastTechnicalVisit: car.lastTechnicalVisit || "",
        lastOilChange: car.lastOilChange || "",
        features: car.features || [],
        additionalImages: [],
        description: car.description || "",
      });

      // Set dates
      if (car.lastTechnicalVisit) {
        setTechnicalVisitDate(new Date(car.lastTechnicalVisit));
      }
      if (car.lastOilChange) {
        setOilChangeDate(new Date(car.lastOilChange));
      }
    }
  }, [car]);

  const brands = [
    "Cupra",
    "Dacia",
    "Hyundai",
    "KIA",
    "Mercedes",
    "Opel",
    "Peugeot",
    "Porsche",
    "Renault",
    "SEAT",
    "Volkswagen",
  ];

  const transmissionTypes = ["manual", "automatic"];
  const fuelTypes = ["petrol", "diesel", "electric", "hybrid"];
  const seatOptions = ["2", "4", "5", "7", "8"];
  const doorOptions = ["2", "3", "4", "5"];

  // Updated with only 10 main basic features arranged for 2 columns display
  const availableFeatures = [
    "airConditioning",
    "bluetooth",
    "gps",
    "cruiseControl",
    "parkingSensors",
    "backupCamera",
    "leatherSeats",
    "keylessEntry",
    "electricWindows",
    "abs",
  ];

  const handleInputChange = (field: keyof CarFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (field: "mainImage", file: File | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleMultipleFileChange = (files: FileList | null) => {
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
    // Morocco WhatsApp format: +212XXXXXXXXX or 212XXXXXXXXX or 0XXXXXXXXX
    const phoneRegex = /^(\+212|212|0)[5-7]\d{8}$/;
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
    if (!formData.model)
      newErrors.model = t("cars.form.validation.modelRequired");
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
      newErrors.whatsappNumber = t("cars.form.validation.whatsappFormat");
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
      await onSubmit(formData);
    } catch (error) {
      console.error("Error updating car:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("cars.form.sections.basicInfo")}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="brand">{t("cars.form.brand")} *</Label>
                  <Select
                    value={formData.brand}
                    onValueChange={(value) => handleInputChange("brand", value)}
                  >
                    <SelectTrigger
                      className={errors.brand ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={t("cars.form.placeholders.selectBrand")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brand && (
                    <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">{t("cars.form.name")} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("cars.form.placeholders.name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="model">{t("cars.form.model")} *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder={t("cars.form.placeholders.model")}
                    className={errors.model ? "border-red-500" : ""}
                  />
                  {errors.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="year">{t("cars.form.year")} *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    placeholder="2024"
                    min="2000"
                    max="2025"
                    className={errors.year ? "border-red-500" : ""}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="licensePlate">
                    {t("cars.form.licensePlate")} *
                  </Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      handleInputChange(
                        "licensePlate",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder={t("cars.form.placeholders.licensePlateFormat")}
                    className={errors.licensePlate ? "border-red-500" : ""}
                    maxLength={6}
                  />
                  {errors.licensePlate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.licensePlate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="whatsappNumber">
                    {t("cars.form.whatsappNumber")} *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        handleInputChange("whatsappNumber", e.target.value)
                      }
                      placeholder={t("cars.form.placeholders.whatsappNumber")}
                      className={`pl-10 ${
                        errors.whatsappNumber ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("cars.form.whatsappDescription")}
                  </p>
                  {errors.whatsappNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.whatsappNumber}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("cars.form.sections.technicalSpecs")}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="transmission">
                    {t("cars.form.transmission")} *
                  </Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) =>
                      handleInputChange("transmission", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.transmission ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={t(
                          "cars.form.placeholders.selectTransmission"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`cars.form.transmissions.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.transmission && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transmission}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="fuelType">{t("cars.form.fuelType")} *</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) =>
                      handleInputChange("fuelType", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.fuelType ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={t("cars.form.placeholders.selectFuelType")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`cars.form.fuelTypes.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuelType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fuelType}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seats">{t("cars.form.seats")} *</Label>
                  <Select
                    value={formData.seats}
                    onValueChange={(value) => handleInputChange("seats", value)}
                  >
                    <SelectTrigger
                      className={errors.seats ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={t("cars.form.placeholders.selectSeats")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {seatOptions.map((seats) => (
                        <SelectItem key={seats} value={seats}>
                          {seats} {t("cars.form.seatsLabel")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.seats && (
                    <p className="text-red-500 text-sm mt-1">{errors.seats}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="doors">{t("cars.form.doors")} *</Label>
                  <Select
                    value={formData.doors}
                    onValueChange={(value) => handleInputChange("doors", value)}
                  >
                    <SelectTrigger
                      className={errors.doors ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={t("cars.form.placeholders.selectDoors")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {doorOptions.map((doors) => (
                        <SelectItem key={doors} value={doors}>
                          {doors} {t("cars.form.doorsLabel")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doors && (
                    <p className="text-red-500 text-sm mt-1">{errors.doors}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mileage">{t("cars.form.mileage")} (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      handleInputChange("mileage", e.target.value)
                    }
                    placeholder="15000"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("cars.form.sections.pricing")}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="dailyPrice">
                    {t("cars.form.dailyPrice")} (€) *
                  </Label>
                  <Input
                    id="dailyPrice"
                    type="number"
                    value={formData.dailyPrice}
                    onChange={(e) =>
                      handleInputChange("dailyPrice", e.target.value)
                    }
                    placeholder="85"
                    min="0"
                    step="0.01"
                    className={errors.dailyPrice ? "border-red-500" : ""}
                  />
                  {errors.dailyPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dailyPrice}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="caution">
                    {t("cars.form.caution")} (€) *
                  </Label>
                  <Input
                    id="caution"
                    type="number"
                    value={formData.caution}
                    onChange={(e) =>
                      handleInputChange("caution", e.target.value)
                    }
                    placeholder="500"
                    min="0"
                    step="0.01"
                    className={errors.caution ? "border-red-500" : ""}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {t("cars.form.cautionDescription")}
                  </p>
                  {errors.caution && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.caution}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Maintenance */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("cars.form.sections.maintenance")}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>{t("cars.form.lastTechnicalVisit")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !technicalVisitDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {technicalVisitDate ? (
                          format(technicalVisitDate, "PPP")
                        ) : (
                          <span>{t("cars.form.placeholders.selectDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={technicalVisitDate}
                        onSelect={(date) =>
                          handleDateChange(date, "technicalVisit")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>{t("cars.form.lastOilChange")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !oilChangeDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {oilChangeDate ? (
                          format(oilChangeDate, "PPP")
                        ) : (
                          <span>{t("cars.form.placeholders.selectDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={oilChangeDate}
                        onSelect={(date) => handleDateChange(date, "oilChange")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("cars.form.sections.features")}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {availableFeatures.map((feature) => (
                    <div
                      key={feature}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        formData.features.includes(feature)
                          ? "border-carbookers-red-500 bg-carbookers-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <Label
                        htmlFor={feature}
                        className="text-sm cursor-pointer flex-1"
                        onClick={() => toggleFeature(feature)}
                      >
                        {t(`cars.form.features.${feature}`)}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.features.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      {t("cars.form.selectedFeatures")}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {t(`cars.form.features.${feature}`)}
                          <button
                            type="button"
                            onClick={() => toggleFeature(feature)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Image Display */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Current Vehicle Image
              </h3>
              <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* New Image Upload */}
              <div>
                <Label htmlFor="mainImage">Upload New Image (Optional)</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Leave empty to keep the current image
                </p>
                <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300">
                  {formData.mainImage ? (
                    <div className="space-y-3">
                      <div className="w-32 h-24 mx-auto relative">
                        <img
                          src={URL.createObjectURL(formData.mainImage)}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleFileChange("mainImage", undefined)
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formData.mainImage.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload New Main Image
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG, PNG or WebP (Max 10MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("mainImage", e.target.files?.[0])
                    }
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("mainImage")?.click()
                    }
                  >
                    {formData.mainImage ? "Change Image" : "Choose Image"}
                  </Button>
                </div>
              </div>

              {/* Additional Images */}
              <div className="mt-6">
                <Label htmlFor="additionalImages">
                  Add More Images (Optional)
                </Label>
                <p className="text-sm text-gray-500 mb-2">
                  Upload additional images to showcase the vehicle
                </p>

                {formData.additionalImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {formData.additionalImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
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
                  onChange={(e) => handleMultipleFileChange(e.target.files)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("additionalImages")?.click()
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Car"}
        </Button>
      </div>
    </form>
  );
};

export default EditCarForm;
