// src/components/dashboard/users/components/UserFilters.tsx - FIXED: Removed blocked status

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface UserFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const t = useTranslations("dashboard");

  // FIXED: Removed "blocked" filter - only show All Users, Active, and Inactive
  const filters = [
    { value: "all", label: "All Users" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={selectedFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => {
            console.log("User filter button clicked:", filter.value); // Debug log
            onFilterChange(filter.value);
          }}
          className={
            selectedFilter === filter.value
              ? "bg-carbookers-red-600 hover:bg-carbookers-red-700"
              : ""
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default UserFilters;
