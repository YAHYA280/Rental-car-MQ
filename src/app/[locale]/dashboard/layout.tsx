// src/app/[locale]/dashboard/layout.tsx
"use client";

import React, { useState } from "react";
import { setRequestLocale } from "next-intl/server";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// We need to make this a client component to handle mobile menu state
const DashboardLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
  );
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
