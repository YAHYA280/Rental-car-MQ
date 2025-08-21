import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import AboutSection from "@/components/layout/AboutSection";
import PopularVehicles from "@/components/layout/PopularVehicles";
import TestimonialsSection from "@/components/layout/TestimonialsSection";
import CTASection from "@/components/layout/CTASection";
import Footer from "@/components/layout/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

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
