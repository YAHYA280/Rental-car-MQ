"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
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
    }, 12000); // Changed to 12 seconds

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
          {/* Main Content */}
          <AnimatedContainer direction="down" delay={0.2}>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-white mb-2">{t("subtitle")}</span>
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  {t("title")}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                {t("description")}
              </p>
            </div>
          </AnimatedContainer>

          {/* Call to Action Button */}
          <AnimatedContainer direction="up" delay={0.4}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {t("cta")}
            </Button>
          </AnimatedContainer>

          {/* Search Component */}
          <AnimatedContainer direction="up" delay={0.6}>
            <CarSearchComponent
              className="max-w-5xl mx-auto"
              onSearch={handleSearch}
            />
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
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
