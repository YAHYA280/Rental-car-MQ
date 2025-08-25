// src/components/about/AboutHeroSection.tsx
"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import AnimatedContainer from "@/components/ui/animated-container";
import Image from "next/image";

const AboutHeroSection = () => {
  const t = useTranslations("aboutPage");
  const locale = useLocale();

  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/HeroSection/img3.jpg"
          alt="MELHOR QUE NADA Fleet"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <AnimatedContainer direction="down" delay={0.1}>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-6">
              <span>MELHOR QUE NADA</span>
              <span>/</span>
              <span className="text-carbookers-red-400">
                {locale === "fr" ? "À Propos" : "About Us"}
              </span>
            </div>
          </AnimatedContainer>

          {/* Main Content */}
          <AnimatedContainer direction="down" delay={0.3}>
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-carbookers-red-600/20 border border-carbookers-red-500/30 rounded-full">
                <span className="text-carbookers-red-400 text-sm font-medium">
                  {locale === "fr"
                    ? "Premium depuis 2020"
                    : "Premium since 2020"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-white mb-2">MELHOR QUE NADA</span>
                <span className="bg-gradient-to-r from-carbookers-red-400 via-carbookers-red-500 to-carbookers-red-600 bg-clip-text text-transparent">
                  {locale === "fr"
                    ? "Excellence Marocaine"
                    : "Moroccan Excellence"}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {locale === "fr"
                  ? "Votre partenaire de confiance pour la location de voitures premium au Maroc. Depuis Tanger, nous redéfinissons l'expérience de mobilité avec notre flotte exceptionnelle."
                  : "Your trusted partner for premium car rental in Morocco. From Tangier, we redefine mobility experience with our exceptional fleet."}
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default AboutHeroSection;
