// src/components/dashboard/layout/DashboardSidebar.tsx
"use client";

import React, { useState } from "react";
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
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MobileSidebar from "./MobileSidebar";

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isMobileMenuOpen,
  onMobileMenuClose,
}) => {
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  const navigation = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: BarChart3,
      current: pathname === "/dashboard" || pathname.endsWith("/dashboard"),
    },
    {
      name: "Cars",
      href: "/dashboard/cars",
      icon: Car,
      current: pathname.includes("/dashboard/cars"),
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      current: pathname.includes("/dashboard/users"),
    },
    {
      name: "Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
      current: pathname.includes("/dashboard/bookings"),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname.includes("/dashboard/settings"),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image
                src="/Logo.png"
                alt="MELHOR QUE NADA"
                width={40}
                height={40}
                className="rounded"
              />
              <div>
                <span className="text-xl font-bold text-white">
                  MELHOR QUE NADA
                </span>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
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
              <li className="mt-auto">
                <div className="border-t border-gray-800 pt-6">
                  {/* User Profile */}
                  <div className="flex items-center gap-x-3 p-2 text-sm text-gray-300">
                    <div className="h-8 w-8 rounded-full bg-carbookers-red-600 flex items-center justify-center">
                      <span className="text-white font-semibold">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Admin User</p>
                      <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                  </div>

                  {/* Logout */}
                  <button className="mt-4 group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200">
                    <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={onMobileMenuClose} />
    </>
  );
};

export default DashboardSidebar;
