import { setRequestLocale } from "next-intl/server";
import DashboardCarsContent from "@/components/dashboard/cars/DashboardCarsContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardCarsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardCarsContent />;
}
