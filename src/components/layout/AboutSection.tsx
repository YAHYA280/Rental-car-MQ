"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Shield,
  Clock,
  Star,
  DollarSign,
  Award,
  Users,
} from "lucide-react";
import AnimatedContainer from "@/components/ui/animated-container";

const AboutSection = () => {
  const t = useTranslations("about");
  const tHero = useTranslations("hero");

  const features = [
    {
      icon: Car,
      title: t("features.wideSelection.title"),
      description: t("features.wideSelection.description"),
    },
    {
      icon: Shield,
      title: t("features.safeSecure.title"),
      description: t("features.safeSecure.description"),
    },
    {
      icon: Clock,
      title: t("features.support.title"),
      description: t("features.support.description"),
    },
    {
      icon: Star,
      title: t("features.topRated.title"),
      description: t("features.topRated.description"),
    },
    {
      icon: DollarSign,
      title: t("features.bestPrice.title"),
      description: t("features.bestPrice.description"),
    },
    {
      icon: Award,
      title: t("features.premiumQuality.title"),
      description: t("features.premiumQuality.description"),
    },
  ];

  const stats = [
    {
      icon: Car,
      number: tHero("stats.availableCars"),
      label: tHero("stats.availableCarsLabel"),
    },
    {
      icon: Users,
      number: tHero("stats.happyCustomers"),
      label: tHero("stats.happyCustomersLabel"),
    },
    {
      icon: Star,
      number: tHero("stats.clientRating"),
      label: tHero("stats.clientRatingLabel"),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <AnimatedContainer direction="down" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <AnimatedContainer
                key={index}
                delay={index * 0.2}
                className="h-full"
              >
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                  <CardContent className="p-6">
                    {/* Horizontal layout: Icon and content side by side */}
                    <div className="flex items-center gap-4">
                      {/* Icon container - fixed width */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-carbookers-red-600 rounded-full flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="flex-grow">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {stat.number}
                        </div>
                        <div className="text-gray-600 font-medium text-sm">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedContainer>
            ))}
          </div>
        </AnimatedContainer>

        {/* Header */}
        <AnimatedContainer direction="down" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        {/* Features Grid - Updated for horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <AnimatedContainer
              key={index}
              delay={index * 0.1}
              className="h-full"
            >
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Horizontal layout: Icon and content side by side */}
                  <div className="flex items-start gap-4 flex-grow">
                    {/* Icon container - fixed width */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-carbookers-red-600 transition-colors duration-300 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>

        {/* CTA Button */}
        <AnimatedContainer direction="up" delay={0.8} className="text-center">
          <Button
            size="lg"
            className="bg-black hover:bg-carbookers-red-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {t("cta")}
          </Button>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default AboutSection;
