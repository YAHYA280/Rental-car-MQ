// src/components/dashboard/bookings/components/BookingStatsGrid.tsx - Updated with translations
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Car, DollarSign } from "lucide-react";
import { BookingStats } from "@/components/types";

interface BookingStatsGridProps {
  stats: BookingStats | null;
  isLoading?: boolean;
}

const BookingStatsGrid: React.FC<BookingStatsGridProps> = ({
  stats,
  isLoading = false,
}) => {
  const t = useTranslations("dashboard");

  const defaultStats: BookingStats = {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    monthlyRevenue: 0,
  };

  const currentStats = stats || defaultStats;

  // SIMPLIFIED: Only show the 4 stats you requested
  const statsConfig = [
    {
      title: t("bookings.stats.totalBookings"),
      value: currentStats.totalBookings.toString(),
      icon: Calendar,
      color: "blue",
      description: t("bookings.stats.totalBookingsDesc"),
      key: "totalBookings",
    },
    {
      title: t("bookings.stats.pendingBookings"),
      value: currentStats.pendingBookings.toString(),
      icon: Clock,
      color: "yellow",
      description: t("bookings.stats.pendingBookingsDesc"),
      key: "pendingBookings",
    },
    {
      title: t("bookings.stats.activeBookings"),
      value: currentStats.activeBookings.toString(),
      icon: Car,
      color: "green",
      description: t("bookings.stats.activeBookingsDesc"),
      key: "activeBookings",
    },
    {
      title: t("bookings.stats.totalRevenue"),
      value: `€${currentStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "purple",
      description: t("bookings.stats.totalRevenueDesc"),
      key: "totalRevenue",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((_, index) => (
          <Card key={index} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mt-2 w-24" />
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
    <div className="space-y-6">
      {/* SIMPLIFIED: Main Stats Grid - Only 4 Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;

          // FIXED: Use static Tailwind classes to avoid dynamic class generation issues
          let bgColorClass = "bg-gray-100";
          let textColorClass = "text-gray-600";

          switch (stat.color) {
            case "blue":
              bgColorClass = "bg-blue-100";
              textColorClass = "text-blue-600";
              break;
            case "yellow":
              bgColorClass = "bg-yellow-100";
              textColorClass = "text-yellow-600";
              break;
            case "green":
              bgColorClass = "bg-green-100";
              textColorClass = "text-green-600";
              break;
            case "purple":
              bgColorClass = "bg-purple-100";
              textColorClass = "text-purple-600";
              break;
          }

          return (
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
    </div>
  );
};

export default BookingStatsGrid;
