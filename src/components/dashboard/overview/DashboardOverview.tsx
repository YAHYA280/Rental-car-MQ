// src/components/dashboard/overview/DashboardOverview.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Users,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Settings,
  DollarSign,
  Clock,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const DashboardOverview = () => {
  const t = useTranslations("dashboard");

  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: t("stats.totalCars"),
      value: "42",
      change: "+12%",
      changeType: "positive" as const,
      icon: Car,
      description: t("stats.totalCarsDescription"),
      color: "blue",
    },
    {
      title: t("stats.activeBookings"),
      value: "28",
      change: "+8%",
      changeType: "positive" as const,
      icon: Calendar,
      description: t("stats.activeBookingsDescription"),
      color: "green",
    },
    {
      title: t("stats.totalUsers"),
      value: "1,247",
      change: "+23%",
      changeType: "positive" as const,
      icon: Users,
      description: t("stats.totalUsersDescription"),
      color: "purple",
    },
    {
      title: t("stats.monthlyRevenue"),
      value: "€12,460",
      change: "-3%",
      changeType: "negative" as const,
      icon: DollarSign,
      description: t("stats.monthlyRevenueDescription"),
      color: "yellow",
    },
  ];

  const recentBookings = [
    {
      id: "BK001",
      customer: "Sarah Johnson",
      car: "Mercedes G63 AMG",
      period: "Dec 15 - Dec 20",
      status: "confirmed",
      amount: "€6,250",
    },
    {
      id: "BK002",
      customer: "Michael Chen",
      car: "Porsche Macan",
      period: "Dec 18 - Dec 22",
      status: "pending",
      amount: "€720",
    },
    {
      id: "BK003",
      customer: "Emma Davis",
      car: "BMW Series 7",
      period: "Dec 20 - Dec 25",
      status: "confirmed",
      amount: "€1,495",
    },
    {
      id: "BK004",
      customer: "John Smith",
      car: "Volkswagen Golf 8",
      period: "Dec 22 - Dec 28",
      status: "pending",
      amount: "€420",
    },
  ];

  const topCars = [
    {
      id: "1",
      name: "Mercedes G63 AMG",
      bookings: 12,
      revenue: "€15,000",
      availability: "Available",
    },
    {
      id: "2",
      name: "Porsche Macan",
      bookings: 8,
      revenue: "€1,440",
      availability: "Booked",
    },
    {
      id: "3",
      name: "Hyundai Tucson",
      bookings: 15,
      revenue: "€1,050",
      availability: "Available",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
          <Link href="/dashboard/cars">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("overview.addNewCar")}
            </Button>
          </Link>
          <Link href="/dashboard/bookings">
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t("overview.viewBookings")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      vs last month
                    </span>
                  </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {t("overview.recentBookings")}
            </CardTitle>
            <Link href="/dashboard/bookings">
              <Button
                variant="ghost"
                size="sm"
                className="text-carbookers-red-600 hover:text-carbookers-red-700"
              >
                {t("common.viewAll")}
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-sm">
                        {booking.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.customer}
                        </p>
                        <p className="text-sm text-gray-600">{booking.car}</p>
                        <p className="text-xs text-gray-500">
                          {booking.period}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(booking.status)}
                    <p className="font-semibold text-gray-900">
                      {booking.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Cars */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {t("overview.topPerformingCars")}
            </CardTitle>
            <Link href="/dashboard/cars">
              <Button
                variant="ghost"
                size="sm"
                className="text-carbookers-red-600 hover:text-carbookers-red-700"
              >
                Manage Fleet
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCars.map((car, index) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-carbookers-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{car.name}</p>
                      <p className="text-sm text-gray-600">
                        {car.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{car.revenue}</p>
                    <Badge
                      className={
                        car.availability === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {car.availability}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {t("overview.quickActions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/cars/new">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
              >
                <Car className="h-6 w-6" />
                <span>{t("overview.addNewCar")}</span>
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="h-6 w-6" />
                <span>{t("overview.viewBookings")}</span>
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
              >
                <Users className="h-6 w-6" />
                <span>{t("overview.manageUsers")}</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-6 w-6" />
                <span>{t("overview.viewReports")}</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
