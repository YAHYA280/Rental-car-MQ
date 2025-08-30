// src/components/dashboard/cars/components/form/BasicInfoSection.tsx
"use client";

import React from "react";
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
    model: string;
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

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("cars.form.sections.basicInfo")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="brand">{t("cars.form.brand")} *</Label>
            <Select
              value={formData.brand}
              onValueChange={(value) => onInputChange("brand", value)}
            >
              <SelectTrigger className={errors.brand ? "border-red-500" : ""}>
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
              onChange={(e) => onInputChange("name", e.target.value)}
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
              onChange={(e) => onInputChange("model", e.target.value)}
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
            <Label htmlFor="licensePlate">
              {t("cars.form.licensePlate")} *
            </Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) =>
                onInputChange("licensePlate", e.target.value.toUpperCase())
              }
              placeholder={t("cars.form.placeholders.licensePlateFormat")}
              className={errors.licensePlate ? "border-red-500" : ""}
              maxLength={6}
            />
            {errors.licensePlate && (
              <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>
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
                  onInputChange("whatsappNumber", e.target.value)
                }
                placeholder={t("cars.form.placeholders.whatsappNumber")}
                className={`pl-10 ${
                  errors.whatsappNumber ? "border-red-500" : ""
                }`}
              />
            </div>

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
