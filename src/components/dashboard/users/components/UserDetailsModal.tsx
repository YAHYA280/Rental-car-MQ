// src/components/dashboard/users/components/UserDetailsModal.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, Calendar, CreditCard, FileText } from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  driverLicenseImage?: string;
}

interface UserDetailsModalProps {
  user: UserData | null;
  onClose: () => void;
  onEdit: (user: UserData) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
  onEdit,
}) => {
  const t = useTranslations("dashboard");

  const getStatusBadge = (status: "active" | "inactive") => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">
        {t("users.statusBadges.active")}
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">
        {t("users.statusBadges.inactive")}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <Dialog open={user !== null} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-16px)] max-w-4xl h-[calc(100vh-32px)] max-h-[90vh] sm:w-[min(900px,95vw)] sm:max-w-[min(1200px,95vw)] sm:h-auto flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-3 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {t("users.details.title")}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {t("users.details.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 sm:px-0">
          <div className="space-y-4 sm:space-y-6 pb-4">
            {/* User Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <h3 className="text-lg sm:text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {user.email}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  User ID: {user.id}
                </p>
                <div className="mt-2">{getStatusBadge(user.status)}</div>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("users.details.contactInfo")}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("users.details.email")}:
                    </span>{" "}
                    <span className="font-medium break-all">{user.email}</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("users.details.phone")}:
                    </span>{" "}
                    <span className="font-medium">{user.phone}</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("users.details.joinDate")}:
                    </span>{" "}
                    <span className="font-medium">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t("users.details.bookingStats")}
                </h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm sm:text-base">
                      <span className="text-gray-600">
                        {t("users.details.totalBookings")}:
                      </span>
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">
                      {user.totalBookings}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        bookings
                      </span>
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm sm:text-base">
                      <span className="text-gray-600">
                        {t("users.details.totalSpent")}:
                      </span>
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                      €{user.totalSpent}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        lifetime
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("users.details.recentActivity")}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("users.details.lastBooking")}:
                    </span>{" "}
                    <span
                      className={`font-medium ${
                        user.lastBooking ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {user.lastBooking
                        ? new Date(user.lastBooking).toLocaleDateString()
                        : "No bookings yet"}
                    </span>
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-600">
                      {t("users.details.avgBookingValue")}:
                    </span>{" "}
                    <span className="font-medium">
                      €
                      {user.totalBookings > 0
                        ? Math.round(user.totalSpent / user.totalBookings)
                        : 0}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("users.details.driverLicense")}
                </h4>
                {user.driverLicenseImage ? (
                  <div className="w-full max-w-sm">
                    <img
                      src={user.driverLicenseImage}
                      alt="Driver License"
                      className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() =>
                        window.open(user.driverLicenseImage, "_blank")
                      }
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click to view full size
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No driver license image uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-3 sm:pt-4 border-t bg-white flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {t("users.details.close")}
          </Button>
          <Button
            className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
            onClick={() => {
              onEdit(user);
              onClose();
            }}
          >
            {t("users.details.edit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
