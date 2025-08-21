// src/app/[locale]/page.tsx
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import AboutSection from "@/components/layout/AboutSection";
import PopularVehicles from "@/components/layout/PopularVehicles";
import TestimonialsSection from "@/components/layout/TestimonialsSection";
import CTASection from "@/components/layout/CTASection";
import Footer from "@/components/layout/Footer";

type Props = {
  params: { locale: string };
};

export default function HomePage({ params: { locale } }: Props) {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PopularVehicles />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
