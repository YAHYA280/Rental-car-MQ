"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, AlertCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BasicInfoSectionProps {
  formData: {
    brand: string;
    name: string;
    year: string;
    licensePlate: string;
    whatsappNumber: string;
  };
  errors: Record<string, string>;
  touchedFields?: Set<string>;
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  touchedFields = new Set(),
  onInputChange,
}) => {
  const t = useTranslations("dashboard.cars");
  const [brands, setBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // Fetch brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
          }/vehicles/brands`
        );
        const data = await response.json();

        if (data.success) {
          setBrands(data.data);
        } else {
          setBrands([
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
          ]);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([
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
        ]);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  // Format WhatsApp number as user types
  const handleWhatsAppChange = (value: string) => {
    // Remove all non-digits
    let cleaned = value.replace(/\D/g, "");

    // Ensure it starts with 06 or 07
    if (
      cleaned.length > 0 &&
      !cleaned.startsWith("06") &&
      !cleaned.startsWith("07")
    ) {
      if (cleaned.startsWith("6") || cleaned.startsWith("7")) {
        cleaned = "0" + cleaned;
      } else if (!cleaned.startsWith("0")) {
        cleaned = "06" + cleaned;
      }
    }

    // Limit to 10 digits
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }

    onInputChange("whatsappNumber", cleaned); // Store unformatted for validation
  };

  // Handle license plate input
  const handleLicensePlateChange = (value: string) => {
    // Limit to 20 characters
    if (value.length <= 20) {
      onInputChange("licensePlate", value);
    }
  };

  // Handle year input with validation
  const handleYearChange = (value: string) => {
    // Only allow numbers
    const cleaned = value.replace(/\D/g, "");
    // Limit to 4 digits
    if (cleaned.length <= 4) {
      onInputChange("year", cleaned);
    }
  };

  // Format displayed WhatsApp number
  const formatWhatsAppDisplay = (value: string) => {
    if (value.length <= 2) return value;
    let formatted = value.substring(0, 2);
    if (value.length > 2) formatted += " " + value.substring(2, 4);
    if (value.length > 4) formatted += " " + value.substring(4, 6);
    if (value.length > 6) formatted += " " + value.substring(6, 8);
    if (value.length > 8) formatted += " " + value.substring(8, 10);
    return formatted;
  };

  // Check if field has error and should show it
  const shouldShowError = (field: string) => {
    return errors[field] && touchedFields.has(field);
  };

  // Get error styling
  const getFieldClass = (field: string) => {
    return shouldShowError(field)
      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
      : "";
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("form.sections.basicInfo")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-error="brand">
            <Label htmlFor="brand" className="flex items-center gap-2">
              {t("form.brand")} *
              {shouldShowError("brand") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>{t("form.brand")} Error:</strong>
                      <p className="mt-1">{errors.brand}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Select
              value={formData.brand}
              onValueChange={(value) => onInputChange("brand", value)}
              disabled={loadingBrands}
            >
              <SelectTrigger className={getFieldClass("brand")}>
                <SelectValue
                  placeholder={
                    loadingBrands
                      ? "Loading brands..."
                      : t("form.placeholders.selectBrand")
                  }
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
            {shouldShowError("brand") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.brand}
              </p>
            )}
          </div>

          <div data-error="name">
            <Label htmlFor="name" className="flex items-center gap-2">
              {t("form.name")} *
              {shouldShowError("name") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>{t("form.name")} Error:</strong>
                      <p className="mt-1">{errors.name}</p>
                      <p className="mt-2 text-gray-600">
                        {t("form.placeholders.name")}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder={t("form.placeholders.name")}
              className={getFieldClass("name")}
              maxLength={50}
            />
            <div className="flex justify-between items-center mt-1">
              {shouldShowError("name") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.name.length}/50
              </p>
            </div>
          </div>

          <div data-error="year">
            <Label htmlFor="year" className="flex items-center gap-2">
              {t("form.year")} *
              {shouldShowError("year") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>{t("form.year")} Error:</strong>
                      <p className="mt-1">{errors.year}</p>
                      <p className="mt-2 text-gray-600">
                        Enter the manufacturing year (2000-2030)
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Input
              id="year"
              name="year"
              type="text"
              value={formData.year}
              onChange={(e) => handleYearChange(e.target.value)}
              placeholder="2024"
              className={getFieldClass("year")}
              maxLength={4}
            />
            {shouldShowError("year") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.year}
              </p>
            )}
          </div>

          <div data-error="licensePlate">
            <Label htmlFor="licensePlate" className="flex items-center gap-2">
              {t("form.licensePlate")} *
              {shouldShowError("licensePlate") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>{t("form.licensePlate")} Error:</strong>
                      <p className="mt-1">{errors.licensePlate}</p>
                      <p className="mt-2 text-gray-600">
                        {t("form.placeholders.licensePlateFormat")}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={(e) => handleLicensePlateChange(e.target.value)}
              placeholder={t("form.placeholders.licensePlate")}
              className={getFieldClass("licensePlate")}
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("form.placeholders.licensePlateFormat")}
            </p>
            {shouldShowError("licensePlate") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.licensePlate}
              </p>
            )}
          </div>

          <div className="md:col-span-2" data-error="whatsappNumber">
            <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
              {t("form.whatsappNumber")} *
              {shouldShowError("whatsappNumber") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>{t("form.whatsappNumber")} Error:</strong>
                      <p className="mt-1">{errors.whatsappNumber}</p>
                      <p className="mt-2 text-gray-600">
                        {t("form.whatsappDescription")}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                value={formatWhatsAppDisplay(formData.whatsappNumber)}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                placeholder={t("form.placeholders.whatsappNumber")}
                className={`pl-10 ${getFieldClass("whatsappNumber")}`}
                maxLength={14}
              />
            </div>

            {shouldShowError("whatsappNumber") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.whatsappNumber}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
