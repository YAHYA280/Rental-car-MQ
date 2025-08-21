import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import AboutSection from "@/components/layout/AboutSection";
import PopularVehicles from "@/components/layout/PopularVehicles";
import TestimonialsSection from "@/components/layout/TestimonialsSection";
import MapSection from "@/components/layout/MapSection";
import Footer from "@/components/layout/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering - THIS IS CRUCIAL
  setRequestLocale(locale);

  return (
    <div className="min-h-screen m-0 p-0">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PopularVehicles />
      <TestimonialsSection />
      <MapSection />
      <Footer />
    </div>
  );
}
