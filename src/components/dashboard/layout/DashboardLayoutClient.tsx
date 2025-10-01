// src/components/dashboard/layout/DashboardLayoutClient.tsx - Updated with Auth
"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";
import ProtectedDashboardLayout from "./ProtectedDashboardLayout";

type Props = {
  children: React.ReactNode;
};

const DashboardLayoutClient: React.FC<Props> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="lg:pl-72">
          {/* Header */}
          <DashboardHeader onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

          {/* Page Content */}
          <main className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default DashboardLayoutClient;
