"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturesSectionProps {
  selectedFeatures: string[];
  onToggleFeature: (feature: string) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  selectedFeatures,
  onToggleFeature,
}) => {
  const t = useTranslations("dashboard.cars");

  // Updated with only 10 main basic features
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

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("form.sections.features")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
          {availableFeatures.map((feature) => {
            const checked = selectedFeatures.includes(feature);
            return (
              <label
                key={feature}
                htmlFor={`feat-${feature}`}
                className={[
                  "flex items-center gap-3 p-3 rounded-xl border shadow-sm cursor-pointer select-none",
                  "transition-colors focus-within:ring-2 focus-within:ring-carbookers-red-500",
                  checked
                    ? "border-carbookers-red-500 bg-carbookers-red-50 text-carbookers-red-700"
                    : "border-gray-200 hover:bg-gray-50",
                ].join(" ")}
              >
                <Checkbox
                  id={`feat-${feature}`}
                  checked={checked}
                  onCheckedChange={() => onToggleFeature(feature)}
                  className="h-5 w-5 data-[state=checked]:bg-carbookers-red-500 data-[state=checked]:border-carbookers-red-500"
                />
                <span className="text-sm flex-1">
                  {t(`form.features.${feature}`)}
                </span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
