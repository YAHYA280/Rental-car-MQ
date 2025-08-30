// src/components/dashboard/cars/components/form/TechnicalSpecsSection.tsx
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

interface TechnicalSpecsSectionProps {
  formData: {
    transmission: string;
    fuelType: string;
    seats: string;
    doors: string;
    mileage: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const TechnicalSpecsSection: React.FC<TechnicalSpecsSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const t = useTranslations("dashboard");

  const transmissionTypes = ["manual", "automatic"];
  const fuelTypes = ["petrol", "diesel", "electric", "hybrid"];
  const seatOptions = ["2", "4", "5", "7", "8"];
  const doorOptions = ["2", "3", "4", "5"];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("cars.form.sections.technicalSpecs")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transmission">
              {t("cars.form.transmission")} *
            </Label>
            <Select
              value={formData.transmission}
              onValueChange={(value) => onInputChange("transmission", value)}
            >
              <SelectTrigger
                className={errors.transmission ? "border-red-500" : ""}
              >
                <SelectValue
                  placeholder={t("cars.form.placeholders.selectTransmission")}
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
              <p className="text-red-500 text-sm mt-1">{errors.transmission}</p>
            )}
          </div>

          <div>
            <Label htmlFor="fuelType">{t("cars.form.fuelType")} *</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(value) => onInputChange("fuelType", value)}
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
              <p className="text-red-500 text-sm mt-1">{errors.fuelType}</p>
            )}
          </div>

          <div>
            <Label htmlFor="seats">{t("cars.form.seats")} *</Label>
            <Select
              value={formData.seats}
              onValueChange={(value) => onInputChange("seats", value)}
            >
              <SelectTrigger className={errors.seats ? "border-red-500" : ""}>
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
              onValueChange={(value) => onInputChange("doors", value)}
            >
              <SelectTrigger className={errors.doors ? "border-red-500" : ""}>
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
              onChange={(e) => onInputChange("mileage", e.target.value)}
              placeholder="15000"
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSpecsSection;
