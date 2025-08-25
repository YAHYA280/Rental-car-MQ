// src/components/about/CompanyOverview.tsx
"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedContainer from "@/components/ui/animated-container";
import Image from "next/image";
import { Award, Shield, Clock, Users, MapPin, Car } from "lucide-react";

const CompanyOverview = () => {
  const t = useTranslations("aboutPage");
  const locale = useLocale();

  const achievements = [
    {
      icon: Award,
      title: locale === "fr" ? "Qualité Certifiée" : "Certified Quality",
      desc:
        locale === "fr" ? "Normes internationales" : "International standards",
    },
    {
      icon: Shield,
      title: locale === "fr" ? "Assurance Complète" : "Full Insurance",
      desc: locale === "fr" ? "Protection totale" : "Complete protection",
    },
    {
      icon: Clock,
      title: locale === "fr" ? "Service 24/7" : "24/7 Service",
      desc: locale === "fr" ? "Toujours disponible" : "Always available",
    },
    {
      icon: Users,
      title: locale === "fr" ? "1000+ Clients" : "1000+ Clients",
      desc: locale === "fr" ? "Clients satisfaits" : "Satisfied customers",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <AnimatedContainer direction="right">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <Badge className="bg-carbookers-red-600 text-white mb-4">
                  {locale === "fr" ? "Notre Histoire" : "Our Story"}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {locale === "fr"
                    ? "MELHOR QUE NADA : Plus Qu'une Location"
                    : "MELHOR QUE NADA: More Than Rental"}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {locale === "fr"
                    ? "Fondée avec la vision de révolutionner l'industrie de la location de voitures au Maroc, MELHOR QUE NADA s'est imposée comme le leader incontesté du secteur premium à Tanger."
                    : "Founded with the vision to revolutionize Morocco's car rental industry, MELHOR QUE NADA has established itself as the undisputed leader in Tangier's premium sector."}
                </p>
              </div>

              {/* Mission Statement */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Car className="h-5 w-5 text-carbookers-red-600" />
                  {locale === "fr" ? "Notre Mission" : "Our Mission"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {locale === "fr"
                    ? "Offrir une expérience de mobilité exceptionnelle en combinant une flotte premium, un service personnalisé et une expertise locale inégalée pour chaque client au Maroc."
                    : "To provide an exceptional mobility experience by combining a premium fleet, personalized service, and unmatched local expertise for every client in Morocco."}
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {locale === "fr" ? "Pourquoi Nous Choisir" : "Why Choose Us"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="w-10 h-10 bg-carbookers-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <achievement.icon className="h-5 w-5 text-carbookers-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {achievement.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedContainer>

          {/* Right Column - Image */}
          <AnimatedContainer direction="left" delay={0.3}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/HeroSection/img5.jpg"
                  alt="MELHOR QUE NADA Premium Fleet"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-carbookers-red-600 rounded-full flex items-center justify-center">
                        <Car className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          MELHOR QUE NADA
                        </h4>
                        <p className="text-sm text-gray-600">
                          {locale === "fr"
                            ? "Excellence Automobile"
                            : "Automotive Excellence"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-carbookers-red-600/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-carbookers-red-400/10 rounded-full blur-3xl"></div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;
