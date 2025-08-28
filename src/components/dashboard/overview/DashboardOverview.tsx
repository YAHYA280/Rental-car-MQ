// src/components/dashboard/overview/DashboardOverview.tsx
"use client";

import React from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const DashboardOverview = () => {
  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: "Total Cars",
      value: "42",
      change: "+12%",
      changeType: "positive" as const,
      icon: Car,
      description: "Active vehicles in fleet",
    },
    {
      title: "Active Bookings",
      value: "28",
      change: "+8%",
      changeType: "positive" as const,
      icon: Calendar,
      description: "Current reservations",
    },
    {
      title: "Total Users",
      value: "1,247",
      change: "+23%",
      changeType: "positive" as const,
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Monthly Revenue",
      value: "€12,460",
      change: "-3%",
      changeType: "negative" as const,
      icon: TrendingUp,
      description: "This month's earnings",
    },
  ];

  const recentBookings = [
    {
      id: "1",
      customer: "Sarah Johnson",
      car: "Mercedes G63 AMG",
      period: "Dec 15 - Dec 20",
      status: "confirmed",
      amount: "€6,250",
    },
    {
      id: "2",
      customer: "Michael Chen",
      car: "Porsche Macan",
      period: "Dec 18 - Dec 22",
      status: "pending",
      amount: "€720",
    },
    {
      id: "3",
      customer: "Emma Davis",
      car: "BMW Series 7",
      period: "Dec 20 - Dec 25",
      status: "confirmed",
      amount: "€1,495",
    },
    {
      id: "4",
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
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your rental business.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/cars">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Car
            </Button>
          </Link>
          <Link href="/dashboard/bookings">
            <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View All Bookings
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
                  <p className="text-3xl font-bold text-gray-900">
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
                  <div className="w-12 h-12 bg-carbookers-red-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-carbookers-red-600" />
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
            <CardTitle className="text-xl font-bold">Recent Bookings</CardTitle>
            <Link href="/dashboard/bookings">
              <Button
                variant="ghost"
                size="sm"
                className="text-carbookers-red-600"
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {booking.customer}
                    </p>
                    <p className="text-sm text-gray-600">{booking.car}</p>
                    <p className="text-xs text-gray-500">{booking.period}</p>
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
              Top Performing Cars
            </CardTitle>
            <Link href="/dashboard/cars">
              <Button
                variant="ghost"
                size="sm"
                className="text-carbookers-red-600"
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
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
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
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/cars/new">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2"
              >
                <Car className="h-6 w-6" />
                <span>Add New Car</span>
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span>View Bookings</span>
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col gap-2"
              >
                <TrendingUp className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
