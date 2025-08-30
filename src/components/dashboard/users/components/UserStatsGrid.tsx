// src/components/dashboard/users/components/UserStatsGrid.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";

interface UserData {
  id: string;
  status: "active" | "inactive";
  joinDate: string;
  totalSpent: number;
  [key: string]: any;
}

interface UserStatsGridProps {
  users: UserData[];
}

const UserStatsGrid: React.FC<UserStatsGridProps> = ({ users }) => {
  const t = useTranslations("dashboard");

  // Calculate new users this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newThisMonth = users.filter((user) => {
    const joinDate = new Date(user.joinDate);
    return (
      joinDate.getMonth() === currentMonth &&
      joinDate.getFullYear() === currentYear
    );
  }).length;

  // Calculate total revenue from all users
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);

  const stats = [
    {
      title: t("stats.totalUsers"),
      value: users.length.toString(),
      icon: Users,
      color: "blue",
    },
    {
      title: t("stats.activeUsers"),
      value: users.filter((user) => user.status === "active").length.toString(),
      icon: UserCheck,
      color: "green",
    },
    {
      title: t("stats.newThisMonth"),
      value: newThisMonth.toString(),
      icon: UserPlus,
      color: "purple",
    },
    {
      title: t("stats.totalRevenue"),
      value: `€${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
