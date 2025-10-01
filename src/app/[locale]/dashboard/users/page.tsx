// src/app/[locale]/dashboard/users/page.tsx
import { setRequestLocale } from "next-intl/server";
import DashboardUsersContent from "@/components/dashboard/users/DashboardUsersContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardUsersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardUsersContent />;
}
