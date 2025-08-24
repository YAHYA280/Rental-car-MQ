// src/components/layout/HeroSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import AnimatedContainer from "@/components/ui/animated-container";
import CarSearchComponent from "@/components/search/CarSearchComponent";

interface SearchFormData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  differentDropoff: boolean;
  driverAge: string;
}

const HeroSection = () => {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background images from your public/HeroSection folder
  const backgroundImages = [
    "/HeroSection/img1.jpg",
    "/HeroSection/img2.jpg",
    "/HeroSection/img3.jpg",
    "/HeroSection/img4.jpg",
    "/HeroSection/img5.jpg",
    "/HeroSection/img7.jpg",
    "/HeroSection/img8.jpg",
  ];

  // Auto-change background images every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleSearch = (searchData: SearchFormData) => {
    console.log("Search submitted:", searchData);
    // Handle search logic here
  };

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${backgroundImages[currentImageIndex]}')`,
            }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-12 max-w-6xl mx-auto">
          {/* SEO-optimized Main Content */}
          <AnimatedContainer direction="down" delay={0.2}>
            <div className="space-y-6">
              {/* H1 tag with primary brand keywords */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-white mb-2">MELHOR QUE NADA</span>
                <span className="bg-gradient-to-r from-carbookers-red-400 via-carbookers-red-500 to-carbookers-red-600 bg-clip-text text-transparent">
                  {locale === "fr"
                    ? "Location Voiture Tanger"
                    : "Car Rental Morocco"}
                </span>
              </h1>

              {/* H2 with supporting keywords and brand reinforcement */}
              <h2 className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium">
                {locale === "fr"
                  ? "MELHOR QUE NADA - Votre expert en location de voiture au Maroc. Véhicules premium et service de qualité à Tanger depuis notre agence RUE 8 ENNASR LOT 635."
                  : "MELHOR QUE NADA - Your premium car rental expert in Morocco. Luxury vehicles and quality service in Tangier from our RUE 8 ENNASR LOT 635 location."}
              </h2>

              {/* Additional brand-focused description */}
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                {locale === "fr"
                  ? "Découvrez pourquoi MELHOR QUE NADA est le choix privilégié pour la location voiture maroc. Notre expertise et notre flotte premium vous garantissent une expérience exceptionnelle."
                  : "Discover why MELHOR QUE NADA is the preferred choice for car rental in Morocco. Our expertise and premium fleet guarantee you an exceptional experience."}
              </p>
            </div>
          </AnimatedContainer>

          {/* Call to Action Button */}
          <AnimatedContainer direction="up" delay={0.4}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-carbookers-red-600 to-carbookers-red-500 hover:from-carbookers-red-700 hover:to-carbookers-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              {locale === "fr"
                ? "Découvrir MELHOR QUE NADA"
                : "Discover MELHOR QUE NADA"}
            </Button>
          </AnimatedContainer>

          {/* Search Component */}
          <AnimatedContainer direction="up" delay={0.6}>
            <CarSearchComponent
              className="max-w-5xl mx-auto"
              onSearch={handleSearch}
            />
          </AnimatedContainer>

          {/* Additional SEO Content - Trust Indicators */}
          <AnimatedContainer direction="up" delay={0.8}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {locale === "fr" ? "MELHOR QUE NADA" : "MELHOR QUE NADA"}
                </h3>
                <p className="text-gray-200 text-sm">
                  {locale === "fr"
                    ? "Leader location voiture Tanger"
                    : "Leading car rental in Tangier"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-2">40+</h3>
                <p className="text-gray-200 text-sm">
                  {locale === "fr" ? "Véhicules Premium" : "Premium Vehicles"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
                <p className="text-gray-200 text-sm">
                  {locale === "fr"
                    ? "Service MELHOR QUE NADA"
                    : "MELHOR QUE NADA Service"}
                </p>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-white shadow-lg"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Image ${index + 1} - MELHOR QUE NADA gallery`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
