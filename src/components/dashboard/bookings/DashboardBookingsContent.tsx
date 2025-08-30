// src/components/dashboard/bookings/DashboardBookingsContent.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Calendar,
  Car,
  User,
  Clock,
  MapPin,
  DollarSign,
  Phone,
} from "lucide-react";

const DashboardBookingsContent = () => {
  const t = useTranslations("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // Mock bookings data with WhatsApp numbers
  const [bookings, setBookings] = useState([
    {
      id: "BK001",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+212612345678",
      },
      car: {
        name: "Mercedes G63 AMG",
        brand: "Mercedes",
        image: "/cars/Mercedes G63/photo1.jpg",
        whatsappNumber: "+212612077309", // WhatsApp for reservations
      },
      dates: {
        pickup: "2024-12-15",
        return: "2024-12-20",
        pickupTime: "10:00",
        returnTime: "18:00",
      },
      locations: {
        pickup: "Tangier Airport",
        return: "Tangier Airport",
      },
      status: "confirmed",
      totalAmount: 6250,
      dailyRate: 1250,
      days: 5,
      createdAt: "2024-12-10",
    },
    {
      id: "BK002",
      customer: {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        phone: "+212623456789",
      },
      car: {
        name: "Porsche Macan",
        brand: "Porsche",
        image: "/cars/Porsche Macan/photo1.jpg",
        whatsappNumber: "+212623456001", // WhatsApp for reservations
      },
      dates: {
        pickup: "2024-12-18",
        return: "2024-12-22",
        pickupTime: "09:00",
        returnTime: "17:00",
      },
      locations: {
        pickup: "Tangier City Center",
        return: "Tangier Airport",
      },
      status: "pending",
      totalAmount: 720,
      dailyRate: 180,
      days: 4,
      createdAt: "2024-12-08",
    },
    {
      id: "BK003",
      customer: {
        name: "Emma Davis",
        email: "emma.davis@email.com",
        phone: "+212634567890",
      },
      car: {
        name: "Hyundai Tucson",
        brand: "Hyundai",
        image: "/cars/Hyundai Tucson/photo1.jpg",
        whatsappNumber: "+212634567001", // WhatsApp for reservations
      },
      dates: {
        pickup: "2024-12-20",
        return: "2024-12-25",
        pickupTime: "14:00",
        returnTime: "12:00",
      },
      locations: {
        pickup: "Tangier Airport",
        return: "Tangier Airport",
      },
      status: "active",
      totalAmount: 350,
      dailyRate: 70,
      days: 5,
      createdAt: "2024-12-05",
    },
    {
      id: "BK004",
      customer: {
        name: "Ahmed Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+212645678901",
      },
      car: {
        name: "Volkswagen Golf 8",
        brand: "Volkswagen",
        image: "/cars/Golf8/photo1.png",
        whatsappNumber: "+212645678001", // WhatsApp for reservations
      },
      dates: {
        pickup: "2024-12-22",
        return: "2024-12-28",
        pickupTime: "08:00",
        returnTime: "20:00",
      },
      locations: {
        pickup: "Tangier City Center",
        return: "Tangier City Center",
      },
      status: "cancelled",
      totalAmount: 420,
      dailyRate: 70,
      days: 6,
      createdAt: "2024-12-03",
    },
  ]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.whatsappNumber?.includes(searchTerm);

    const matchesFilter =
      selectedFilter === "all" || booking.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t("bookings.confirmed")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("bookings.pending")}
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("bookings.active")}
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {t("bookings.completed")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            {t("bookings.cancelled")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = [
    {
      title: t("stats.totalBookings"),
      value: bookings.length.toString(),
      icon: Calendar,
      color: "blue",
    },
    {
      title: t("stats.activeBookings"),
      value: bookings.filter((b) => b.status === "active").length.toString(),
      icon: Car,
      color: "green",
    },
    {
      title: t("stats.pendingApproval"),
      value: bookings.filter((b) => b.status === "pending").length.toString(),
      icon: Clock,
      color: "yellow",
    },
    {
      title: t("stats.monthlyRevenue"),
      value: `€${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}`,
      icon: DollarSign,
      color: "purple",
    },
  ];

  const handleConfirmBooking = (bookingId: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "confirmed" } : booking
      )
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );
    setBookingToCancel(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("bookings.title")}
          </h1>
          <p className="text-gray-600">{t("bookings.subtitle")}</p>
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

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("common.searchBookings")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                {t("bookings.all")}
              </Button>
              <Button
                variant={selectedFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("pending")}
              >
                {t("bookings.pending")}
              </Button>
              <Button
                variant={selectedFilter === "confirmed" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("confirmed")}
              >
                {t("bookings.confirmed")}
              </Button>
              <Button
                variant={selectedFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("active")}
              >
                {t("bookings.active")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>
            {t("overview.recentBookings")} ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("bookings.table.booking")}</TableHead>
                <TableHead>{t("bookings.table.customer")}</TableHead>
                <TableHead>{t("bookings.table.car")}</TableHead>
                <TableHead>WhatsApp Contact</TableHead>
                <TableHead>{t("bookings.table.dates")}</TableHead>
                <TableHead>{t("bookings.table.locations")}</TableHead>
                <TableHead>{t("bookings.table.amount")}</TableHead>
                <TableHead>{t("bookings.table.status")}</TableHead>
                <TableHead>{t("bookings.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-sm">
                        {booking.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.customer.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.customer.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.car.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          €{booking.dailyRate}/day
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`https://wa.me/${booking.car.whatsappNumber?.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {booking.car.whatsappNumber}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">
                        {new Date(booking.dates.pickup).toLocaleDateString()} -
                        {new Date(booking.dates.return).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        {booking.dates.pickupTime} - {booking.dates.returnTime}
                      </p>
                      <p className="text-gray-500">
                        {booking.days} {t("bookings.table.days")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {booking.locations.pickup}
                      </div>
                      {booking.locations.pickup !==
                        booking.locations.return && (
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <MapPin className="h-3 w-3" />
                          {booking.locations.return}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-900">
                      €{booking.totalAmount}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {t("common.actions")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("bookings.actions.viewDetails")}
                        </DropdownMenuItem>
                        {booking.status === "pending" && (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handleConfirmBooking(booking.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            {t("bookings.actions.confirmBooking")}
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "cancelled" &&
                          booking.status !== "completed" && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setBookingToCancel(booking.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              {t("bookings.actions.cancelBooking")}
                            </DropdownMenuItem>
                          )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog
        open={selectedBooking !== null}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("bookings.details.title")}</DialogTitle>
            <DialogDescription>
              {t("bookings.details.description")}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    Booking {selectedBooking.id}
                  </h3>
                  <p className="text-gray-600">
                    {t("bookings.details.createdOn")}{" "}
                    {new Date(selectedBooking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(selectedBooking.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("bookings.details.customerInformation")}
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.name")}:
                      </span>{" "}
                      {selectedBooking.customer.name}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.email")}:
                      </span>{" "}
                      {selectedBooking.customer.email}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.phone")}:
                      </span>{" "}
                      {selectedBooking.customer.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("bookings.details.vehicleInformation")}
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.car")}:
                      </span>{" "}
                      {selectedBooking.car.name}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.dailyRate")}:
                      </span>{" "}
                      €{selectedBooking.dailyRate}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.totalDays")}:
                      </span>{" "}
                      {selectedBooking.days}
                    </p>
                    <p>
                      <span className="text-gray-600">WhatsApp Contact:</span>{" "}
                      <a
                        href={`https://wa.me/${selectedBooking.car.whatsappNumber?.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        {selectedBooking.car.whatsappNumber}
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("bookings.details.rentalPeriod")}
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.pickup")}:
                      </span>{" "}
                      {new Date(
                        selectedBooking.dates.pickup
                      ).toLocaleDateString()}{" "}
                      at {selectedBooking.dates.pickupTime}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.return")}:
                      </span>{" "}
                      {new Date(
                        selectedBooking.dates.return
                      ).toLocaleDateString()}{" "}
                      at {selectedBooking.dates.returnTime}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.duration")}:
                      </span>{" "}
                      {selectedBooking.days} days
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("bookings.details.locations")}
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.pickup")}:
                      </span>{" "}
                      {selectedBooking.locations.pickup}
                    </p>
                    <p>
                      <span className="text-gray-600">
                        {t("bookings.details.return")}:
                      </span>{" "}
                      {selectedBooking.locations.return}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {t("bookings.details.totalAmount")}:
                  </span>
                  <span className="text-2xl font-bold text-carbookers-red-600">
                    €{selectedBooking.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)}>
              {t("bookings.details.close")}
            </Button>
            {selectedBooking?.status === "pending" && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleConfirmBooking(selectedBooking.id);
                  setSelectedBooking(null);
                }}
              >
                {t("bookings.details.confirmBooking")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog
        open={bookingToCancel !== null}
        onOpenChange={() => setBookingToCancel(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bookings.cancelConfirmation.title")}</DialogTitle>
            <DialogDescription>
              {t("bookings.cancelConfirmation.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingToCancel(null)}>
              {t("bookings.cancelConfirmation.keepBooking")}
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                bookingToCancel && handleCancelBooking(bookingToCancel)
              }
            >
              {t("bookings.cancelConfirmation.cancelBooking")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardBookingsContent;
