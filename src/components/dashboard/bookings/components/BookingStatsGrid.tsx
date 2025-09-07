// src/components/dashboard/bookings/components/BookingStatsGrid.tsx - Updated for real backend
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Car,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
} from "lucide-react";
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

  // Default stats when loading or no data
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

  const statsConfig = [
    {
      title: "Total Bookings",
      value: currentStats.totalBookings.toString(),
      icon: Calendar,
      color: "blue",
      description: "All time bookings",
      key: "totalBookings",
    },
    {
      title: "Pending Approval",
      value: currentStats.pendingBookings.toString(),
      icon: Clock,
      color: "yellow",
      description: "Awaiting confirmation",
      key: "pendingBookings",
    },
    {
      title: "Active Rentals",
      value: currentStats.activeBookings.toString(),
      icon: Car,
      color: "green",
      description: "Vehicles currently out",
      key: "activeBookings",
    },
    {
      title: "Total Revenue",
      value: `€${currentStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "purple",
      description: "All time earnings",
      key: "totalRevenue",
    },
    {
      title: "Confirmed Bookings",
      value: currentStats.confirmedBookings.toString(),
      icon: CheckCircle,
      color: "blue",
      description: "Ready for pickup",
      key: "confirmedBookings",
    },
    {
      title: "Completed Bookings",
      value: currentStats.completedBookings.toString(),
      icon: Users,
      color: "green",
      description: "Successfully completed",
      key: "completedBookings",
    },
    {
      title: "Cancelled Bookings",
      value: currentStats.cancelledBookings.toString(),
      icon: XCircle,
      color: "red",
      description: "Cancelled bookings",
      key: "cancelledBookings",
    },
    {
      title: "Average Booking Value",
      value: `€${Math.round(
        currentStats.averageBookingValue || 0
      ).toLocaleString()}`,
      icon: TrendingUp,
      color: "indigo",
      description: "Per booking average",
      key: "averageBookingValue",
    },
  ];

  // Calculate additional metrics
  const completionRate =
    currentStats.totalBookings > 0
      ? Math.round(
          (currentStats.completedBookings / currentStats.totalBookings) * 100
        )
      : 0;

  const cancellationRate =
    currentStats.totalBookings > 0
      ? Math.round(
          (currentStats.cancelledBookings / currentStats.totalBookings) * 100
        )
      : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
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
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;
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
                      className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`h-6 w-6 text-${stat.color}-600`}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Completion Rate */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Completion Rate
              </h3>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    {completionRate}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentStats.completedBookings} /{" "}
                    {currentStats.totalBookings}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Rate */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Cancellation Rate
              </h3>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-red-600">
                    {cancellationRate}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentStats.cancelledBookings} /{" "}
                    {currentStats.totalBookings}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cancellationRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue per Day */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Revenue
              </h3>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  €{currentStats.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-500">This month's earnings</div>
              {currentStats.totalRevenue > 0 && (
                <div className="text-xs text-gray-400">
                  {Math.round(
                    (currentStats.monthlyRevenue / currentStats.totalRevenue) *
                      100
                  )}
                  % of total revenue
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Summary */}
      {currentStats.totalBookings > 0 && (
        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Pending:</span>
                    <span className="ml-1 font-semibold text-yellow-600">
                      {currentStats.pendingBookings}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confirmed:</span>
                    <span className="ml-1 font-semibold text-blue-600">
                      {currentStats.confirmedBookings}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Active:</span>
                    <span className="ml-1 font-semibold text-green-600">
                      {currentStats.activeBookings}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Completed:</span>
                    <span className="ml-1 font-semibold text-gray-600">
                      {currentStats.completedBookings}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Active Status</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {currentStats.pendingBookings +
                    currentStats.confirmedBookings +
                    currentStats.activeBookings}
                </div>
                <div className="text-xs text-gray-500">needs attention</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingStatsGrid;
