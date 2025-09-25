// src/components/dashboard/cars/components/form/MaintenanceSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MaintenanceSectionProps {
  technicalVisitDate: Date | undefined;
  oilChangeDate: Date | undefined;
  onDateChange: (
    date: Date | undefined,
    field: "technicalVisit" | "oilChange"
  ) => void;
}

const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({
  technicalVisitDate,
  oilChangeDate,
  onDateChange,
}) => {
  const t = useTranslations("dashboard.cars");

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("form.sections.maintenance")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t("form.lastTechnicalVisit")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !technicalVisitDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {technicalVisitDate ? (
                    format(technicalVisitDate, "PPP")
                  ) : (
                    <span>{t("form.placeholders.selectDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={technicalVisitDate}
                  onSelect={(date) => onDateChange(date, "technicalVisit")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>{t("form.lastOilChange")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !oilChangeDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {oilChangeDate ? (
                    format(oilChangeDate, "PPP")
                  ) : (
                    <span>{t("form.placeholders.selectDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={oilChangeDate}
                  onSelect={(date) => onDateChange(date, "oilChange")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceSection;
