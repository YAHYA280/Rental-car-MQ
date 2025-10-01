// src/components/dashboard/layout/MobileSidebar.tsx - With Auth Integration
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  Car,
  Users,
  Calendar,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const { admin, logout } = useAuth(); // 🔐 Auth integration

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

  const handleLogout = () => {
    logout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-black px-6 py-6">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3"
            onClick={onClose}
          >
            <Image
              src="/Logo.png"
              alt="MELHOR QUE NADA"
              width={140}
              height={70}
              className="rounded"
            />
          </Link>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        item.current
                          ? "bg-carbookers-red-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-colors duration-200"
                      )}
                      onClick={onClose}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.current && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Bottom section */}
            <li className="mt-auto pt-8">
              <div className="border-t border-gray-800 pt-6">
                {/* User Profile - 🔐 Using real admin data */}
                <div className="flex items-center gap-x-3 p-2 text-sm text-gray-300 mb-4">
                  <div className="h-8 w-8 rounded-full bg-carbookers-red-600 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {admin?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {admin?.role || "administrator"}
                    </p>
                  </div>
                </div>

                {/* Logout - 🔐 Real logout function */}
                <button
                  onClick={handleLogout}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                  {t("header.logout")}
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;
