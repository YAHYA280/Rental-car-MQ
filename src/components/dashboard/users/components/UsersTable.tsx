"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { UserData } from "@/components/types";

interface UsersTableProps {
  users: UserData[];
  onViewDetails: (user: UserData) => void;
  onEditUser: (user: UserData) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onViewDetails,
  onEditUser,
  onDeleteUser,
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
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
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
  const calculateAge = (dateOfBirth: string | undefined): string => {
    if (!dateOfBirth) return "N/A";
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
      return `${age} years`;
    } catch {
      return "N/A";
    }
  };

  // Get document completion status
  const getDocumentCompletionBadge = (user: UserData) => {
    const hasDriverLicense = !!(
      user.driverLicenseNumber && user.driverLicenseImage?.dataUrl
    );
    const hasPassport = !!(user.passportNumber && user.passportImage?.dataUrl);
    const hasCin = !!(user.cinNumber && user.cinImage?.dataUrl);
    const hasPersonalInfo = !!(user.dateOfBirth && user.address);

    const completedCount = [
      hasDriverLicense,
      hasPassport,
      hasCin,
      hasPersonalInfo,
    ].filter(Boolean).length;
    const totalCount = 4;
    const percentage = Math.round((completedCount / totalCount) * 100);

    if (percentage >= 75) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {percentage}% Complete
        </Badge>
      );
    } else if (percentage >= 50) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {percentage}% Partial
        </Badge>
      );
    } else if (percentage > 0) {
      return (
        <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          {percentage}% Incomplete
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          No Documents
        </Badge>
      );
    }
  };

  // Get available documents list
  const getAvailableDocuments = (user: UserData): string[] => {
    const docs: string[] = [];
    if (user.driverLicenseNumber || user.driverLicenseImage?.dataUrl)
      docs.push("License");
    if (user.passportNumber || user.passportImage?.dataUrl)
      docs.push("Passport");
    if (user.cinNumber || user.cinImage?.dataUrl) docs.push("CIN");
    return docs;
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact & Location</TableHead>
            <TableHead>Age & Status</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Bookings & Revenue</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              {/* Customer Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      ID: {user.id.slice(0, 8)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.source === "admin"
                        ? "Staff Created"
                        : "Self Registered"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Contact & Location - Simplified */}
              <TableCell>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">
                      {user.email || (
                        <span className="italic text-gray-400">No email</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{user.phoneFormatted || user.phone}</span>
                  </div>
                  {/* Show country/nationality instead of city */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {getNationality(user.country)}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Age & Status */}
              <TableCell>
                <div className="space-y-2">
                  {getStatusBadge(user.status)}
                  {user.dateOfBirth && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {calculateAge(user.dateOfBirth)}
                    </div>
                  )}
                  {user.emailVerified && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Email Verified
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Documents */}
              <TableCell>
                <div className="space-y-2">
                  {getDocumentCompletionBadge(user)}
                  <div className="flex flex-wrap gap-1">
                    {getAvailableDocuments(user).map((doc) => (
                      <Badge key={doc} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                  {getAvailableDocuments(user).length === 0 && (
                    <p className="text-xs text-gray-400 italic">No documents</p>
                  )}
                </div>
              </TableCell>

              {/* Bookings & Revenue */}
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-blue-600">
                      {user.totalBookings || 0}
                    </span>
                    <span className="text-sm text-gray-600">bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(user.totalSpent)}
                    </span>
                  </div>
                  {user.totalBookings > 0 && (
                    <div className="text-xs text-gray-500">
                      Avg:{" "}
                      {formatCurrency(user.totalSpent / user.totalBookings)}
                    </div>
                  )}
                  {user.averageRating && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <span>★</span>
                      <span>{user.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Last Activity - Simplified */}
              <TableCell>
                <div className="space-y-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Last Booking
                    </p>
                    <p className="text-sm text-gray-600">
                      {user.lastBookingDate ? (
                        formatDate(user.lastBookingDate)
                      ) : (
                        <span className="italic text-gray-400">
                          No bookings
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Customer Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onViewDetails(user)}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditUser(user)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Customer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      View Bookings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer focus:text-red-600"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Customer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
