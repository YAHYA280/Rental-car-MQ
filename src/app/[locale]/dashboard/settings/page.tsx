import { setRequestLocale } from "next-intl/server";
import DashboardSettingsContent from "@/components/dashboard/settings/DashboardSettingsContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardSettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardSettingsContent />;
}
