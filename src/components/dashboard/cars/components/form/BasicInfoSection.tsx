// src/components/dashboard/cars/components/form/BasicInfoSection.tsx - Updated without model and location
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
import { Phone } from "lucide-react";

interface BasicInfoSectionProps {
  formData: {
    brand: string;
    name: string;
    year: string;
    licensePlate: string;
    whatsappNumber: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const t = useTranslations("dashboard");
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
          // Fallback to static brands if API fails
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
        // Fallback to static brands
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

    // Format as 06 XX XX XX XX
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length > 2) formatted += " " + cleaned.substring(2, 4);
      if (cleaned.length > 4) formatted += " " + cleaned.substring(4, 6);
      if (cleaned.length > 6) formatted += " " + cleaned.substring(6, 8);
      if (cleaned.length > 8) formatted += " " + cleaned.substring(8, 10);
    }

    onInputChange("whatsappNumber", cleaned); // Store unformatted for validation
  };

  // Format license plate as user types
  const handleLicensePlateChange = (value: string) => {
    // Remove all non-alphanumeric characters
    let cleaned = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();

    // Limit to 6 characters (5 digits + 1 letter)
    if (cleaned.length > 6) {
      cleaned = cleaned.substring(0, 6);
    }

    onInputChange("licensePlate", cleaned);
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

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">Brand *</Label>
            <Select
              value={formData.brand}
              onValueChange={(value) => onInputChange("brand", value)}
              disabled={loadingBrands}
            >
              <SelectTrigger className={errors.brand ? "border-red-500" : ""}>
                <SelectValue
                  placeholder={
                    loadingBrands ? "Loading brands..." : "Select brand"
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
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Car name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => onInputChange("year", e.target.value)}
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
            <Label htmlFor="licensePlate">License Plate *</Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) => handleLicensePlateChange(e.target.value)}
              placeholder="12345A"
              className={errors.licensePlate ? "border-red-500" : ""}
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: 12345A (5 digits + 1 letter)
            </p>
            {errors.licensePlate && (
              <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="whatsappNumber"
                value={formatWhatsAppDisplay(formData.whatsappNumber)}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                placeholder="06 XX XX XX XX"
                className={`pl-10 ${
                  errors.whatsappNumber ? "border-red-500" : ""
                }`}
                maxLength={14} // For formatted display
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format: 06 XX XX XX XX or 07 XX XX XX XX
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
  );
};

export default BasicInfoSection;
