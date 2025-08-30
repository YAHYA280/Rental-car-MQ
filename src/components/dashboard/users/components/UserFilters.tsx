// src/components/dashboard/users/components/UserFilters.tsx
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

  const filters = [
    { value: "all", label: t("users.allUsers") },
    { value: "active", label: t("users.active") },
    { value: "inactive", label: t("users.inactive") },
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

export default UserFilters;
