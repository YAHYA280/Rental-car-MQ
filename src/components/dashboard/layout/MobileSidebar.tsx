// src/components/dashboard/layout/MobileSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  BarChart3,
  Car,
  Users,
  Calendar,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  const navigation = [
    {
      name: t("navigation.overview"),
      href: "/dashboard",
      icon: BarChart3,
      current: pathname === "/dashboard" || pathname.endsWith("/dashboard"),
    },
    {
      name: t("navigation.cars"),
      href: "/dashboard/cars",
      icon: Car,
      current: pathname.includes("/dashboard/cars"),
    },
    {
      name: t("navigation.users"),
      href: "/dashboard/users",
      icon: Users,
      current: pathname.includes("/dashboard/users"),
    },
    {
      name: t("navigation.bookings"),
      href: "/dashboard/bookings",
      icon: Calendar,
      current: pathname.includes("/dashboard/bookings"),
    },
    {
      name: t("navigation.settings"),
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname.includes("/dashboard/settings"),
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-black transform transition-transform duration-300 ease-in-out lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3"
              onClick={onClose}
            >
              <Image
                src="/Logo.png"
                alt="MELHOR QUE NADA"
                width={32}
                height={32}
                className="rounded"
              />
              <div>
                <span className="text-lg font-bold text-white">
                  MELHOR QUE NADA
                </span>
                <p className="text-xs text-gray-400">
                  {t("sidebar.dashboard")}
                </p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  item.current
                    ? "bg-carbookers-red-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800",
                  "group flex gap-x-3 rounded-md p-3 text-sm font-semibold transition-colors duration-200"
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-800">
            {/* User Profile */}
            <div className="flex items-center gap-x-3 p-3 text-sm text-gray-300 mb-4">
              <div className="h-8 w-8 rounded-full bg-carbookers-red-600 flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div>
                <p className="font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-400">
                  {t("sidebar.administrator")}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button className="group flex w-full gap-x-3 rounded-md p-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200">
              <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
              {t("header.logout")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
