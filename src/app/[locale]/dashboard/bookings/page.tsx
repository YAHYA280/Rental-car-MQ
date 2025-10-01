import { setRequestLocale } from "next-intl/server";
import DashboardBookingsContent from "@/components/dashboard/bookings/DashboardBookingsContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardBookingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardBookingsContent />;
}
