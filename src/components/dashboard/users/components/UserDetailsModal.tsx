// src/components/dashboard/users/components/UserDetailsModal.tsx - UPDATED: Removed city, postal code, emergency contact, notes, and referral code
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
import {
  Mail,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  User,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { UserData } from "@/components/types";

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

  const getStatusBadge = (status: "active" | "inactive" | "blocked") => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Inactive
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Blocked
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Safe date formatting
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Safe currency formatting
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "€0";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string | undefined): number | null => {
    if (!dateOfBirth) return null;
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  // Get nationality from country code
  const getNationality = (countryCode: string | undefined): string => {
    const nationalityMap: Record<string, string> = {
      MA: "Moroccan",
      FR: "French",
      ES: "Spanish",
      DE: "German",
      IT: "Italian",
      GB: "British",
      US: "American",
      CA: "Canadian",
      DZ: "Algerian",
      TN: "Tunisian",
      BE: "Belgian",
      NL: "Dutch",
      PT: "Portuguese",
    };
    return nationalityMap[countryCode || "MA"] || "Unknown";
  };

  // Get document completion status
  const getDocumentCompletion = (user: UserData) => {
    const documents = {
      driverLicense: !!(
        user.driverLicenseNumber && user.driverLicenseImage?.dataUrl
      ),
      passport: !!(user.passportNumber && user.passportImage?.dataUrl),
      cin: !!(user.cinNumber && user.cinImage?.dataUrl),
      personalInfo: !!(user.dateOfBirth && user.address),
    };

    const completedCount = Object.values(documents).filter(Boolean).length;
    const totalCount = Object.keys(documents).length;

    return {
      ...documents,
      completionPercentage: Math.round((completedCount / totalCount) * 100),
      isComplete: completedCount === totalCount,
    };
  };

  // Document display component
  const DocumentDisplay = ({
    title,
    imageUrl,
    documentNumber,
    additionalInfo,
  }: {
    title: string;
    imageUrl?: string;
    documentNumber?: string;
    additionalInfo?: string;
  }) => (
    <div className="space-y-2">
      <h5 className="font-medium text-gray-900">{title}</h5>
      {imageUrl ? (
        <div className="space-y-2">
          <div className="w-full h-32 relative border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onClick={() => window.open(imageUrl, "_blank")}
            />
          </div>
          {documentNumber && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Number:</span> {documentNumber}
            </p>
          )}
          {additionalInfo && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Additional:</span> {additionalInfo}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(imageUrl, "_blank")}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            View Full Size
          </Button>
        </div>
      ) : documentNumber ? (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Number:</span> {documentNumber}
          </p>
          {additionalInfo && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Additional:</span> {additionalInfo}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2 italic">No image uploaded</p>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 italic">
            No {title.toLowerCase()} information provided
          </p>
        </div>
      )}
    </div>
  );

  if (!user) return null;

  const documentCompletion = getDocumentCompletion(user);
  const userAge = calculateAge(user.dateOfBirth);

  return (
    <Dialog open={user !== null} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-16px)] max-w-6xl h-[calc(100vh-32px)] max-h-[95vh] sm:w-[min(1400px,95vw)] sm:max-w-[min(1400px,95vw)] sm:h-auto flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-3 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            Customer Details
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Complete customer information and document status
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 sm:px-0">
          <div className="space-y-4 sm:space-y-6 pb-4">
            {/* Customer Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <div className="w-20 h-20 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="flex-1 w-full sm:w-auto space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  {getStatusBadge(user.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    ID: {user.id.slice(0, 8)}...
                  </span>
                  {userAge && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {userAge} years old
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Flag className="h-4 w-4" />
                    {getNationality(user.country)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Member since {formatDate(user.createdAt)}
                  </span>
                </div>

                {/* Document completion indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        documentCompletion.completionPercentage >= 75
                          ? "bg-green-500"
                          : documentCompletion.completionPercentage >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${documentCompletion.completionPercentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {documentCompletion.completionPercentage}% Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium break-all">
                        {user.email || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {user.phoneFormatted || user.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">
                        {user.dateOfBirth ? (
                          <span>
                            {formatDate(user.dateOfBirth)}
                            {userAge && (
                              <span className="text-gray-500 ml-2">
                                ({userAge} years)
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="font-medium">
                        {getNationality(user.country)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information - Simplified */}
                {user.address && (
                  <div className="p-4 bg-white border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Address Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{user.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Information */}
                <div className="p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Document Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DocumentDisplay
                      title="Driver License"
                      imageUrl={user.driverLicenseImage?.dataUrl}
                      documentNumber={user.driverLicenseNumber}
                    />

                    <DocumentDisplay
                      title="Passport"
                      imageUrl={user.passportImage?.dataUrl}
                      documentNumber={user.passportNumber}
                      additionalInfo={
                        user.passportIssuedAt
                          ? `Issued at: ${user.passportIssuedAt}`
                          : undefined
                      }
                    />

                    <DocumentDisplay
                      title="CIN (National ID)"
                      imageUrl={user.cinImage?.dataUrl}
                      documentNumber={user.cinNumber}
                    />
                  </div>

                  {/* Document completion summary */}
                  <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Document Completion
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {documentCompletion.completionPercentage}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {documentCompletion.driverLicense && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Driver License
                        </Badge>
                      )}
                      {documentCompletion.passport && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Passport
                        </Badge>
                      )}
                      {documentCompletion.cin && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          CIN
                        </Badge>
                      )}
                      {documentCompletion.personalInfo && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Personal Info
                        </Badge>
                      )}
                      {!documentCompletion.isComplete && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Incomplete
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Booking Statistics */}
                <div className="p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                    Booking Statistics
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {user.totalBookings || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(user.totalSpent)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Average per Booking
                      </p>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(
                          user.totalBookings > 0
                            ? user.totalSpent / user.totalBookings
                            : 0
                        )}
                      </p>
                    </div>
                    {user.averageRating && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-xl font-bold text-yellow-600">
                          {user.averageRating.toFixed(1)} / 5.0
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Last Booking</p>
                      <p className="font-medium">
                        {user.lastBookingDate ? (
                          formatDate(user.lastBookingDate)
                        ) : (
                          <span className="text-gray-400 italic">
                            No bookings yet
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Registration Source
                      </p>
                      <p className="font-medium capitalize">{user.source}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className={`flex items-center gap-1 ${
                          user.emailVerified
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {user.emailVerified ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Email {user.emailVerified ? "Verified" : "Not Verified"}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          user.phoneVerified
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {user.phoneVerified ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Phone {user.phoneVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    System Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-medium">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-medium">
                        {formatDate(user.updatedAt)}
                      </p>
                    </div>
                    {user.createdBy && (
                      <div>
                        <p className="text-gray-600">Created by</p>
                        <p className="font-medium">
                          {user.createdBy.name} ({user.createdBy.email})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t bg-white flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Close
          </Button>
          <Button
            className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
            onClick={() => {
              onEdit(user);
              onClose();
            }}
          >
            Edit Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
