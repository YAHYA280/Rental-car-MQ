"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Users } from "lucide-react";

interface CarData {
  id: string;
  available: boolean;
  status?: string;
  [key: string]: any;
}

interface CarStatsGridProps {
  cars: CarData[];
}

const CarStatsGrid: React.FC<CarStatsGridProps> = ({ cars }) => {
  const t = useTranslations("dashboard");

  // Calculate stats from cars data
  const totalCars = cars.length;
  const availableCars = cars.filter(
    (car) => car.available && car.status === "active"
  ).length;
  const rentedCars = cars.filter(
    (car) => !car.available || car.status === "rented"
  ).length;

  // SIMPLIFIED: Only 3 stats (removed maintenance)
  const stats = [
    {
      title: t("stats.totalCars"),
      value: totalCars.toString(),
      icon: Car,
      color: "blue",
      description: "Total vehicles in fleet",
    },
    {
      title: t("stats.activeCars"),
      value: availableCars.toString(),
      icon: Car,
      color: "green",
      description: "Available for booking",
    },
    {
      title: t("stats.rentedCars"),
      value: rentedCars.toString(),
      icon: Users,
      color: "red",
      description: "Currently rented out",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const IconComponent = stat.icon;

        // FIXED: Use static Tailwind classes to avoid dynamic generation issues
        let bgColorClass = "bg-gray-100";
        let textColorClass = "text-gray-600";

        switch (stat.color) {
          case "blue":
            bgColorClass = "bg-blue-100";
            textColorClass = "text-blue-600";
            break;
          case "green":
            bgColorClass = "bg-green-100";
            textColorClass = "text-green-600";
            break;
          case "red":
            bgColorClass = "bg-red-100";
            textColorClass = "text-red-600";
            break;
        }

        return (
          <Card
            key={stat.title}
            className="border-0 shadow-md hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className="ml-4">
                  <div
                    className={`w-12 h-12 ${bgColorClass} rounded-lg flex items-center justify-center`}
                  >
                    <IconComponent className={`h-6 w-6 ${textColorClass}`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CarStatsGrid;
