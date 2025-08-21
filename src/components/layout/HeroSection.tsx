"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Car, Users, Star } from "lucide-react";
import AnimatedContainer from "@/components/ui/animated-container";

const HeroSection = () => {
  const t = useTranslations("hero");

  // Generate particles with stable positions to avoid hydration mismatch
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${(i * 4.7 + 15) % 100}%`, // Deterministic positioning
      top: `${(i * 3.2 + 10) % 100}%`,
      delay: i * 0.1,
      duration: 2 + (i % 3), // Vary duration between 2-4 seconds
    }));
  }, []);

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Image/Video Area */}
      <div className="absolute inset-0">
        {/* City Night Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect fill="%23000" width="1200" height="800"/><g fill="%23333"><rect x="100" y="400" width="80" height="200"/><rect x="200" y="350" width="70" height="250"/><rect x="300" y="300" width="90" height="300"/><rect x="450" y="250" width="100" height="350"/><rect x="600" y="200" width="85" height="400"/><rect x="750" y="280" width="75" height="320"/><rect x="900" y="320" width="95" height="280"/><rect x="1050" y="360" width="80" height="240"/></g><g fill="%23ffff00" opacity="0.6"><circle cx="150" cy="420" r="2"/><circle cx="230" cy="380" r="2"/><circle cx="340" cy="340" r="2"/><circle cx="500" cy="290" r="2"/><circle cx="640" cy="260" r="2"/><circle cx="780" cy="320" r="2"/><circle cx="940" cy="360" r="2"/><circle cx="1080" cy="400" r="2"/></g></svg>')`,
          }}
        />

        {/* Animated particles with stable positions */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Main Content */}
          <AnimatedContainer direction="down" delay={0.2}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {t("subtitle")}
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.6}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {t("cta")}
            </Button>
          </AnimatedContainer>

          {/* Stats Section */}
          <AnimatedContainer direction="up" delay={0.8}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-700">
              <motion.div
                className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-4">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {t("stats.availableCars")}
                </div>
                <div className="text-gray-300">
                  {t("stats.availableCarsLabel")}
                </div>
              </motion.div>

              <motion.div
                className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {t("stats.happyCustomers")}
                </div>
                <div className="text-gray-300">
                  {t("stats.happyCustomersLabel")}
                </div>
              </motion.div>

              <motion.div
                className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-500 rounded-full mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {t("stats.clientRating")}
                </div>
                <div className="text-gray-300">
                  {t("stats.clientRatingLabel")}
                </div>
              </motion.div>
            </div>
          </AnimatedContainer>
        </div>
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
