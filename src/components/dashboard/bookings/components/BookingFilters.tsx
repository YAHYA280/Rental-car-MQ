// src/components/dashboard/bookings/components/BookingFilters.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface BookingFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  isLoading?: boolean;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  isLoading = false,
}) => {
  const t = useTranslations("dashboard");

  const filters = [
    {
      value: "all",
      label: t("bookings.all"),
      count: 0, // You can pass counts if needed
    },
    {
      value: "pending",
      label: t("bookings.pending"),
      count: 0,
    },
    {
      value: "confirmed",
      label: t("bookings.confirmed"),
      count: 0,
    },
    {
      value: "active",
      label: t("bookings.active"),
      count: 0,
    },
    {
      value: "completed",
      label: t("bookings.completed"),
      count: 0,
    },
    {
      value: "cancelled",
      label: t("bookings.cancelled"),
      count: 0,
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={selectedFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          disabled={isLoading}
          className="transition-all duration-200"
        >
          {filter.label}
          {/* Optionally show counts */}
          {filter.count > 0 && (
            <span className="ml-1 text-xs opacity-70">({filter.count})</span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default BookingFilters;
