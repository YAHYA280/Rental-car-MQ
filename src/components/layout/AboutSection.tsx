"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Shield, Clock, Star, DollarSign, Award } from "lucide-react";
import AnimatedContainer from "@/components/ui/animated-container";

const AboutSection = () => {
  const t = useTranslations("about");

  const features = [
    {
      icon: Car,
      title: t("features.wideSelection.title"),
      description: t("features.wideSelection.description"),
      color: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: Shield,
      title: t("features.safeSecure.title"),
      description: t("features.safeSecure.description"),
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-200",
    },
    {
      icon: Clock,
      title: t("features.support.title"),
      description: t("features.support.description"),
      color: "bg-red-100 text-red-600",
      borderColor: "border-red-200",
    },
    {
      icon: Star,
      title: t("features.topRated.title"),
      description: t("features.topRated.description"),
      color: "bg-yellow-100 text-yellow-600",
      borderColor: "border-yellow-200",
    },
    {
      icon: DollarSign,
      title: t("features.bestPrice.title"),
      description: t("features.bestPrice.description"),
      color: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      icon: Award,
      title: t("features.premiumQuality.title"),
      description: t("features.premiumQuality.description"),
      color: "bg-indigo-100 text-indigo-600",
      borderColor: "border-indigo-200",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedContainer direction="down" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <AnimatedContainer
              key={index}
              delay={index * 0.1}
              className="h-full"
            >
              <Card
                className={`h-full hover:shadow-xl transition-all duration-300 border-2 ${feature.borderColor} group hover:scale-105`}
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>

        {/* CTA Button */}
        <AnimatedContainer direction="up" delay={0.8} className="text-center">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("cta")}
          </Button>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default AboutSection;
