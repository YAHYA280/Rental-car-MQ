// src/components/dashboard/overview/DashboardOverview.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { carService } from "@/services/carService";
import { userService } from "@/services/userService";
import { toast } from "sonner";

interface DashboardStats {
  totalCars: number;
  activeCars: number;
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  monthlyRevenue: number;
  pendingBookings: number;
  maintenanceDue: number;
}

const DashboardOverview = () => {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    activeCars: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
    maintenanceDue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch cars and users data in parallel
      const [carsResponse, usersResponse] = await Promise.all([
        carService.getCars({ limit: 100 }), // Get all cars for stats
        userService.getUsers({ limit: 100 }), // Get all users for stats
      ]);

      if (carsResponse.success && usersResponse.success) {
        const cars = carsResponse.data || [];
        const users = usersResponse.data || [];

        // Calculate stats
        const activeCars = cars.filter(
          (car) => car.available && car.status === "active"
        ).length;
        const activeUsers = users.filter(
          (user) => user.status === "active"
        ).length;
        const totalRevenue = users.reduce(
          (sum, user) => sum + (user.totalSpent || 0),
          0
        );

        setStats({
          totalCars: cars.length,
          activeCars,
          totalUsers: users.length,
          activeUsers,
          totalBookings: users.reduce(
            (sum, user) => sum + (user.totalBookings || 0),
            0
          ),
          monthlyRevenue: totalRevenue, // This should be calculated from actual bookings
          pendingBookings: 0, // This should come from bookings API
          maintenanceDue: cars.filter((car) => car.status === "maintenance")
            .length,
        });

        // Set recent activity (mock data for now)
        setRecentActivity([
          {
            id: 1,
            type: "booking",
            message: "New booking created for Toyota Corolla",
            time: "2 minutes ago",
            status: "success",
          },
          {
            id: 2,
            type: "user",
            message: "New customer registered: John Doe",
            time: "15 minutes ago",
            status: "info",
          },
          {
            id: 3,
            type: "maintenance",
            message: "BMW X5 scheduled for maintenance",
            time: "1 hour ago",
            status: "warning",
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: t("stats.totalCars"),
      value: stats.totalCars.toString(),
      icon: Car,
      color: "blue",
      href: `/${locale}/dashboard/cars`,
    },
    {
      title: t("stats.activeCars"),
      value: stats.activeCars.toString(),
      icon: Car,
      color: "green",
      href: `/${locale}/dashboard/cars?filter=available`,
    },
    {
      title: t("stats.totalUsers"),
      value: stats.totalUsers.toString(),
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("overview.title")}
          </h1>
          <p className="text-gray-600">{t("overview.subtitle")}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${locale}/dashboard/cars`}>
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700">
              <Car className="h-4 w-4 mr-2" />
              Manage Cars
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/users`}>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
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
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={`/${locale}/dashboard/cars`}>
              <Button className="w-full justify-start bg-carbookers-red-600 hover:bg-carbookers-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Car
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/users`}>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/bookings`}>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Create Booking
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/cars?filter=maintenance`}>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Maintenance Due
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Cars</span>
                <span className="font-semibold">
                  {stats.activeCars} / {stats.totalCars}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.totalCars > 0
                        ? (stats.activeCars / stats.totalCars) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Customers</span>
                <span className="font-semibold">
                  {stats.activeUsers} / {stats.totalUsers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.totalUsers > 0
                        ? (stats.activeUsers / stats.totalUsers) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <span className="text-green-600 font-semibold">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-green-600 font-semibold">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-gray-600 font-semibold">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
