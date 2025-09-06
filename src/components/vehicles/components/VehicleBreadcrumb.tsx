// src/components/vehicles/VehicleBreadcrumb.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

const VehicleBreadcrumb: React.FC = () => {
  const t = useTranslations("vehicles");

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Link
        href="/vehicles"
        className="hover:text-carbookers-red-600 flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToVehicles")}
      </Link>
    </div>
  );
};

export default VehicleBreadcrumb;
