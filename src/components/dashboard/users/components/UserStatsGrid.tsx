// STEP 2F: Replace src/components/dashboard/users/components/UserStatsGrid.tsx

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";

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

interface UserStatsGridProps {
  users: UserData[];
}

const UserStatsGrid: React.FC<UserStatsGridProps> = ({ users }) => {
  const t = useTranslations("dashboard");

  // FIXED: Calculate stats from real user data
  const calculateStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Calculate new users this month
    const newThisMonth = users.filter((user) => {
      try {
        const joinDate = new Date(user.createdAt);
        return (
          joinDate.getMonth() === currentMonth &&
          joinDate.getFullYear() === currentYear
        );
      } catch {
        return false;
      }
    }).length;

    // Calculate total revenue from all users
    const totalRevenue = users.reduce((sum, user) => {
      return sum + (user.totalSpent || 0);
    }, 0);

    // Count active users
    const activeUsers = users.filter((user) => user.status === "active").length;

    return {
      totalUsers: users.length,
      activeUsers,
      newThisMonth,
      totalRevenue,
    };
  };

  const stats = calculateStats();

  const statsData = [
    {
      title: t("stats.totalUsers"),
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "blue",
    },
    {
      title: t("stats.activeUsers"),
      value: stats.activeUsers.toString(),
      icon: UserCheck,
      color: "green",
    },
    {
      title: t("stats.newThisMonth"),
      value: stats.newThisMonth.toString(),
      icon: UserPlus,
      color: "purple",
    },
    {
      title: t("stats.totalRevenue"),
      value: `€${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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
  );
};

export default UserStatsGrid;
