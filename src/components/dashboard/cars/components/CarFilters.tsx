// src/components/dashboard/cars/components/CarFilters.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface CarFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const t = useTranslations("dashboard");

  const filters = [
    { value: "all", label: t("cars.allCars") },
    { value: "available", label: t("cars.available") },
    { value: "rented", label: t("cars.rented") },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={selectedFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default CarFilters;
