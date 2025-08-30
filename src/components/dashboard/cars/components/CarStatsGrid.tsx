// src/components/dashboard/cars/components/CarStatsGrid.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Users, Settings } from "lucide-react";

interface CarData {
  id: string;
  available: boolean;
  [key: string]: any;
}

interface CarStatsGridProps {
  cars: CarData[];
}

const CarStatsGrid: React.FC<CarStatsGridProps> = ({ cars }) => {
  const t = useTranslations("dashboard");

  const stats = [
    {
      title: t("stats.totalCars"),
      value: cars.length.toString(),
      icon: Car,
      color: "blue",
    },
    {
      title: t("stats.activeCars"),
      value: cars.filter((car) => car.available).length.toString(),
      icon: Car,
      color: "green",
    },
    {
      title: t("stats.rentedCars"),
      value: cars.filter((car) => !car.available).length.toString(),
      icon: Users,
      color: "red",
    },
    {
      title: t("stats.maintenanceDue"),
      value: "3",
      icon: Settings,
      color: "yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="ml-4">
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CarStatsGrid;
