// src/components/dashboard/bookings/components/BookingStatsGrid.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Car, Clock, DollarSign } from "lucide-react";
import { BookingStats } from "../types/bookingTypes";

interface BookingStatsGridProps {
  stats: BookingStats;
  isLoading?: boolean;
}

const BookingStatsGrid: React.FC<BookingStatsGridProps> = ({
  stats,
  isLoading = false,
}) => {
  const t = useTranslations("dashboard");

  const statsConfig = [
    {
      title: t("stats.totalBookings"),
      value: stats.totalBookings.toString(),
      icon: Calendar,
      color: "blue",
      key: "totalBookings",
    },
    {
      title: t("stats.activeBookings"),
      value: stats.activeBookings.toString(),
      icon: Car,
      color: "green",
      key: "activeBookings",
    },
    {
      title: t("stats.pendingApproval"),
      value: stats.pendingBookings.toString(),
      icon: Clock,
      color: "yellow",
      key: "pendingBookings",
    },
    {
      title: t("stats.monthlyRevenue"),
      value: `€${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "purple",
      key: "monthlyRevenue",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="ml-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <Card
          key={stat.key}
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
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

export default BookingStatsGrid;
