// src/app/[locale]/about/page.tsx
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import CompanyOverview from "@/components/about/CompanyOverview";
import ContactMapSection from "@/components/about/ContactMapSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AboutHeroSection />
      <CompanyOverview />
      <ContactMapSection />
      <Footer />
    </div>
  );
}
