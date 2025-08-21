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
import { motion } from "framer-motion";
import AnimatedContainer from "@/components/ui/animated-container";

const AboutSection = () => {
  const t = useTranslations("about");
  const tHero = useTranslations("hero");

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

  const stats = [
    {
      icon: Car,
      number: tHero("stats.availableCars"),
      label: tHero("stats.availableCarsLabel"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200",
    },
    {
      icon: Users,
      number: tHero("stats.happyCustomers"),
      label: tHero("stats.happyCustomersLabel"),
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-200",
    },
    {
      icon: Star,
      number: tHero("stats.clientRating"),
      label: tHero("stats.clientRatingLabel"),
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-200",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <AnimatedContainer direction="down" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <AnimatedContainer
                key={index}
                delay={index * 0.2}
                className="h-full"
              >
                <motion.div
                  className={`text-center ${stat.bgColor} backdrop-blur-sm rounded-2xl p-8 border-2 ${stat.borderColor} group hover:scale-105 transition-all duration-300`}
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  }}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-medium text-lg">
                    {stat.label}
                  </div>
                </motion.div>
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
