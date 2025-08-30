// src/components/dashboard/cars/components/form/PricingSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface PricingSectionProps {
  formData: {
    dailyPrice: string;
    caution: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("cars.form.sections.pricing")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dailyPrice">
              {t("cars.form.dailyPrice")} (€) *
            </Label>
            <Input
              id="dailyPrice"
              type="number"
              value={formData.dailyPrice}
              onChange={(e) => onInputChange("dailyPrice", e.target.value)}
              placeholder="85"
              min="0"
              step="0.01"
              className={errors.dailyPrice ? "border-red-500" : ""}
            />
            {errors.dailyPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.dailyPrice}</p>
            )}
          </div>

          <div>
            <Label htmlFor="caution">{t("cars.form.caution")} (€) *</Label>
            <Input
              id="caution"
              type="number"
              value={formData.caution}
              onChange={(e) => onInputChange("caution", e.target.value)}
              placeholder="500"
              min="0"
              step="0.01"
              className={errors.caution ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t("cars.form.cautionDescription")}
            </p>
            {errors.caution && (
              <p className="text-red-500 text-sm mt-1">{errors.caution}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;
