// src/components/dashboard/layout/DashboardHeader.tsx
"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, Globe, User, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  onMobileMenuOpen?: () => void;
}

const DashboardHeader = ({ onMobileMenuOpen }: DashboardHeaderProps) => {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const [notifications] = useState([
    {
      id: 1,
      message: "New booking received",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "Car maintenance due",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Payment confirmed",
      time: "3 hours ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLanguageChange = (newLocale: "en" | "fr") => {
    if (newLocale === locale) return;

    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    window.location.href = newPath;
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMobileMenuOpen}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* Separator - Only visible on mobile */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-between">
        {/* Left Section - Empty on mobile, keeps layout balanced */}
        <div className="flex-1"></div>

        {/* Right section - Clean and minimal */}
        <div className="flex items-center gap-x-4">
          {/* Language selector - Hidden on small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-20 h-8 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                <SelectValue>{locale.toUpperCase()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-carbookers-red-500 focus:ring-offset-2"
              >
                <span className="sr-only">{t("header.notifications")}</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-carbookers-red-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{t("header.notifications")}</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} {t("header.newNotifications")}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.unread
                          ? "bg-carbookers-red-600"
                          : "bg-gray-300"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-carbookers-red-600 py-3 font-medium justify-center">
                {t("header.viewAllNotifications")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Language Switcher - Only visible on mobile */}
          <div className="sm:hidden flex items-center">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <Select value={locale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-20 h-8 text-sm border border-gray-300 bg-white text-gray-700">
                  <SelectValue>{locale.toUpperCase()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="fr">FR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Separator - Hidden on mobile */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative -m-1.5 flex items-center p-1.5 focus:outline-none focus:ring-2 focus:ring-carbookers-red-500 focus:ring-offset-2"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-carbookers-red-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">A</span>
                </div>
                <span className="hidden lg:flex lg:items-center lg:ml-4">
                  <span
                    className="text-sm font-semibold leading-6 text-gray-900"
                    aria-hidden="true"
                  >
                    Admin User
                  </span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    admin@melhorquenada.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>{t("header.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("header.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("header.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
