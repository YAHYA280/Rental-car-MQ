// src/components/dashboard/overview/DashboardOverview.tsx - SIMPLIFIED VERSION
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { carService } from "@/services/carService";
import { userService } from "@/services/userService";
import { bookingService } from "@/services/bookingService";
import { toast } from "sonner";

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  totalClients: number;
  monthlyRevenue: number;
  totalBookings: number;
  maintenanceDue: number;
}

const DashboardOverview = () => {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    maintenanceDue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [carsResponse, usersResponse, bookingStatsResponse] =
        await Promise.all([
          carService.getCars({ limit: 1000 }),
          userService.getUsers({ limit: 1000 }),
          bookingService
            .getBookingStats()
            .catch(() => ({ success: false, data: null })),
        ]);

      if (carsResponse.success && usersResponse.success) {
        const cars = carsResponse.data || [];
        const users = usersResponse.data || [];

        // Calculate vehicle stats
        const totalVehicles = cars.length;
        const availableVehicles = cars.filter(
          (car) => car.available && car.status === "active"
        ).length;
        const maintenanceDue = cars.filter(
          (car) => car.status === "maintenance"
        ).length;

        // Calculate client stats
        const totalClients = users.length;

        // Get booking stats from API
        let totalBookings = 0;
        let monthlyRevenue = 0;

        if (bookingStatsResponse.success && bookingStatsResponse.data) {
          totalBookings =
            bookingStatsResponse.data.overview?.totalBookings || 0;
          monthlyRevenue =
            bookingStatsResponse.data.overview?.totalRevenue || 0;
        }

        setStats({
          totalVehicles,
          availableVehicles,
          totalClients,
          monthlyRevenue,
          totalBookings,
          maintenanceDue,
        });
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // SIMPLIFIED: Only the 6 stats you want
  const statsCards = [
    {
      title: "Total Véhicules",
      value: stats.totalVehicles.toString(),
      icon: Car,
      color: "blue",
      href: `/${locale}/dashboard/cars`,
    },
    {
      title: "Disponibles",
      value: stats.availableVehicles.toString(),
      icon: Car,
      color: "green",
      href: `/${locale}/dashboard/cars?filter=available`,
    },
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      icon: Users,
      color: "purple",
      href: `/${locale}/dashboard/users`,
    },
    {
      title: "Monthly Revenue",
      value: `€${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "green",
      href: `/${locale}/dashboard/bookings`,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      icon: Calendar,
      color: "blue",
      href: `/${locale}/dashboard/bookings`,
    },
    {
      title: "Maintenance Due",
      value: stats.maintenanceDue.toString(),
      icon: AlertTriangle,
      color: "orange",
      href: `/${locale}/dashboard/cars?filter=maintenance`,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbookers-red-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with prominent Add Booking CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("overview.title")}
          </h1>
          <p className="text-gray-600">{t("overview.subtitle")}</p>
        </div>

        {/* PROMINENT ADD BOOKING CTA */}
        <div className="flex gap-3">
          <Link href={`/${locale}/dashboard/bookings`}>
            <Button
              size="lg"
              className="bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Booking
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/cars`}>
            <Button variant="outline" size="lg" className="px-6 py-3">
              <Car className="h-4 w-4 mr-2" />
              Manage Cars
            </Button>
          </Link>
        </div>
      </div>

      {/* SIMPLIFIED Stats Grid - Only 6 cards in 2 rows */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => {
          // Use static Tailwind classes to avoid dynamic generation issues
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
            case "purple":
              bgColorClass = "bg-purple-100";
              textColorClass = "text-purple-600";
              break;
            case "orange":
              bgColorClass = "bg-orange-100";
              textColorClass = "text-orange-600";
              break;
          }

          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 group-hover:text-carbookers-red-600 transition-colors">
                        {stat.value}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div
                        className={`w-12 h-12 ${bgColorClass} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <stat.icon className={`h-6 w-6 ${textColorClass}`} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* SIMPLIFIED: Quick Actions Card Only */}
      <Card className="border-0 shadow-md max-w-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link href={`/${locale}/dashboard/bookings`}>
              <Button className="w-full justify-start bg-carbookers-red-600 hover:bg-carbookers-red-700">
                <Calendar className="h-4 w-4 mr-2" />
                Create New Booking
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/cars`}>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Vehicle
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/users`}>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Simple Fleet Status (Optional - you can remove this if you want it even simpler) */}
      {stats.totalVehicles > 0 && (
        <Card className="border-0 shadow-md max-w-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fleet Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Available Vehicles
                </span>
                <span className="font-semibold text-green-600">
                  {stats.availableVehicles} / {stats.totalVehicles}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      stats.totalVehicles > 0
                        ? (stats.availableVehicles / stats.totalVehicles) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              {stats.maintenanceDue > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Maintenance Due</span>
                  <Link href={`/${locale}/dashboard/cars?filter=maintenance`}>
                    <span className="font-semibold text-orange-600 hover:text-orange-700 cursor-pointer">
                      {stats.maintenanceDue} vehicles
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardOverview;
