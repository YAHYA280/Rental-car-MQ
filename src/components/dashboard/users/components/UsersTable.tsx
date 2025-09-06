// STEP 2D: Replace src/components/dashboard/users/components/UsersTable.tsx

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
} from "lucide-react";

// FIXED: Updated interface to match backend data
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  driverLicenseNumber?: string;
  driverLicenseImage?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;
  status: "active" | "inactive" | "blocked";
  totalBookings: number;
  totalSpent: number;
  averageRating?: number;
  lastBookingDate?: string;
  source: "website" | "admin" | "referral" | "social" | "other";
  referralCode: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

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
          <Badge className="bg-green-100 text-green-800">
            {t("users.statusBadges.active")}
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {t("users.statusBadges.inactive")}
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-red-100 text-red-800">
            {t("users.statusBadges.blocked")}
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // FIXED: Format date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  // FIXED: Format currency safely
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "€0";
    return `€${amount.toLocaleString()}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("users.table.user")}</TableHead>
          <TableHead>{t("users.table.contact")}</TableHead>
          <TableHead>{t("users.table.status")}</TableHead>
          <TableHead>{t("users.table.joinDate")}</TableHead>
          <TableHead>{t("users.table.bookings")}</TableHead>
          <TableHead>{t("users.table.totalSpent")}</TableHead>
          <TableHead>{t("users.table.lastBooking")}</TableHead>
          <TableHead>{t("users.table.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    ID: {user.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  📞 {user.phone}
                </div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(user.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {formatDate(user.createdAt)}
              </div>
            </TableCell>
            <TableCell>
              <p className="font-medium">{user.totalBookings || 0}</p>
              <p className="text-sm text-gray-600">
                {t("users.table.bookingsCount")}
              </p>
            </TableCell>
            <TableCell>
              <p className="font-semibold text-gray-900">
                {formatCurrency(user.totalSpent)}
              </p>
              <p className="text-sm text-gray-600">
                {t("users.table.lifetime")}
              </p>
            </TableCell>
            <TableCell>
              <p className="text-sm text-gray-600">
                {user.lastBookingDate
                  ? formatDate(user.lastBookingDate)
                  : "No bookings"}
              </p>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewDetails(user)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("users.actions.viewDetails")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("users.actions.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    {t("users.actions.sendMessage")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("users.actions.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
