// src/app/[locale]/dashboard/layout.tsx
import React from "react";
import { setRequestLocale } from "next-intl/server";
import DashboardLayoutClient from "@/components/dashboard/layout/DashboardLayoutClient";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  // Enable static rendering - this is now in a server component
  setRequestLocale(locale);

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
