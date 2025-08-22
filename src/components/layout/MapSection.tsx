"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import AnimatedContainer from "@/components/ui/animated-container";

const MapSection = () => {
  const t = useTranslations("map");

  // Coordinates for Tangier location: 35°45'04.5"N 5°49'50.2"W
  // Converted to decimal: 35.751250, -5.830611
  const latitude = 35.75125;
  const longitude = -5.830611;

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.123456789!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzA0LjUiTiA1wrA0OSc1MC4yIlc!5e0!3m2!1sen!2sma!4v1642123456789!5m2!1sen!2sma`;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedContainer direction="down" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        {/* Map Only */}
        <AnimatedContainer direction="up" delay={0.3}>
          <Card className="border-0 shadow-2xl overflow-hidden max-w-6xl mx-auto">
            <div className="relative h-[600px] w-full">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("locationName")}
                className="absolute inset-0"
              ></iframe>

              {/* Overlay with coordinates */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <p className="text-sm font-semibold text-gray-900">
                  📍 {t("coordinates")}
                </p>
                <p className="text-xs text-gray-600">{t("locationName")}</p>
              </div>
            </div>
          </Card>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default MapSection;
