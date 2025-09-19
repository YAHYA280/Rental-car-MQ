// src/components/dashboard/cars/components/form/PricingSection.tsx - Enhanced
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Euro } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PricingSectionProps {
  formData: {
    dailyPrice: string;
    caution: string;
  };
  errors: Record<string, string>;
  touchedFields?: Set<string>;
  onInputChange: (field: string, value: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  formData,
  errors,
  touchedFields = new Set(),
  onInputChange,
}) => {
  const t = useTranslations("dashboard");

  // Handle price input (numbers and decimal only)
  const handlePriceChange = (field: string, value: string) => {
    // Allow numbers, one decimal point, and up to 2 decimal places
    const cleaned = value.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");

    if (parts.length > 2) {
      // More than one decimal point, ignore the input
      return;
    }

    if (parts[1] && parts[1].length > 2) {
      // More than 2 decimal places, truncate
      parts[1] = parts[1].substring(0, 2);
    }

    const finalValue =
      parts.length === 2 ? `${parts[0]}.${parts[1]}` : parts[0];
    onInputChange(field, finalValue);
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
          {t("cars.form.sections.pricing")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-error="dailyPrice">
            <Label htmlFor="dailyPrice" className="flex items-center gap-2">
              {t("cars.form.dailyPrice")} (€) *
              {shouldShowError("dailyPrice") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>Daily Price Error:</strong>
                      <p className="mt-1">{errors.dailyPrice}</p>
                      <p className="mt-2 text-gray-600">
                        Enter a valid price between €1 and €10,000 per day
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <div className="relative">
              <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="dailyPrice"
                name="dailyPrice"
                type="text"
                value={formData.dailyPrice}
                onChange={(e) =>
                  handlePriceChange("dailyPrice", e.target.value)
                }
                placeholder="85.00"
                className={`pl-10 ${getFieldClass("dailyPrice")}`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Rental price per day in Euros
            </p>
            {shouldShowError("dailyPrice") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.dailyPrice}
              </p>
            )}
          </div>

          <div data-error="caution">
            <Label htmlFor="caution" className="flex items-center gap-2">
              {t("cars.form.caution")} (€) *
              {shouldShowError("caution") && (
                <Popover>
                  <PopoverTrigger>
                    <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="text-sm text-red-600">
                      <strong>Caution Error:</strong>
                      <p className="mt-1">{errors.caution}</p>
                      <p className="mt-2 text-gray-600">
                        Enter a valid security deposit amount between €1 and
                        €10,000
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Label>
            <div className="relative">
              <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="caution"
                name="caution"
                type="text"
                value={formData.caution}
                onChange={(e) => handlePriceChange("caution", e.target.value)}
                placeholder="500.00"
                className={`pl-10 ${getFieldClass("caution")}`}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t("cars.form.cautionDescription")}
            </p>
            {shouldShowError("caution") && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.caution}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;
