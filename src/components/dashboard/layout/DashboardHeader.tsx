// src/components/dashboard/layout/DashboardHeader.tsx - Minimal Design
"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onMobileMenuOpen: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMobileMenuOpen,
}) => {
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side - Language & Profile */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              FR
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
            <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-x-3 p-2 hover:bg-gray-50 -m-1.5"
            >
              <div className="flex items-center gap-x-3">
                <div className="h-8 w-8 rounded-full bg-carbookers-red-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                <div className="hidden lg:flex lg:items-center">
                  <div className="ml-0 text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {admin?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {admin?.role || "admin"}
                    </p>
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="px-4 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{admin?.name}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
