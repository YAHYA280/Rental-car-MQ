"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Loader2 } from "lucide-react";
import AnimatedContainer from "@/components/ui/animated-container";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CarData } from "@/components/types";
import { carService } from "@/services/carService";

const PopularVehicles = () => {
  const t = useTranslations("vehicles");

  const [vehicles, setVehicles] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await carService.getCars({
          page: 1,
          limit: 12, // Get 12 vehicles for a good scroll experience
          available: true, // Only show available vehicles
        });

        if (response.success && response.data) {
          setVehicles(response.data);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Triple vehicles for seamless infinite scroll
  const duplicatedVehicles =
    vehicles.length > 0 ? [...vehicles, ...vehicles, ...vehicles] : [];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbookers-red-600" />
              <p className="text-gray-600">{t("loading")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">{t("noVehicles")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedContainer
          direction="down"
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("title")}
            </h2>
            <p className="text-xl text-gray-600">{t("subtitle")}</p>
          </div>
          <Link href="/vehicles">
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 border-2 border-black text-black hover:bg-black hover:text-white font-semibold px-6 py-3"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </AnimatedContainer>

        {/* Vehicles Infinite Scroll */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-vehicles gap-8">
            {duplicatedVehicles.map((vehicle, index) => (
              <div
                key={`${vehicle.id}-${index}`}
                className="flex-shrink-0 w-80"
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group">
                  <div className="relative overflow-hidden">
                    {/* Car Image */}
                    <div className="h-64 relative overflow-hidden">
                      <Image
                        src={
                          typeof vehicle.mainImage === "string"
                            ? vehicle.mainImage
                            : vehicle.mainImage?.dataUrl ||
                              (typeof vehicle.images?.[0] === "string"
                                ? vehicle.images[0]
                                : vehicle.images?.[0]?.dataUrl) ||
                              "/placeholder-car.jpg"
                        }
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Subtle edge gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/30 group-hover:opacity-75 transition-opacity duration-300"></div>

                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                      {/* Brand overlay */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm font-medium opacity-90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                          {vehicle.brand}
                        </div>
                      </div>
                    </div>

                    {/* Brand Badge */}
                    <Badge className="absolute top-4 left-4 bg-white text-gray-900 font-semibold shadow-lg">
                      {vehicle.brand}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    {/* Car Info */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-gray-600 text-sm">{vehicle.year}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          €{vehicle.price}
                        </div>
                        <div className="text-sm text-gray-600">{t("day")}</div>
                      </div>
                    </div>

                    {/* Features */}
                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features
                            .slice(0, 2)
                            .map((feature: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Link
                      href={{
                        pathname: "/vehicles/[id]",
                        params: { id: vehicle.id },
                      }}
                    >
                      <Button className="w-full bg-black hover:bg-red-600 text-white font-semibold py-3 transition-all duration-300">
                        {t("viewDetails")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}
        <AnimatedContainer
          direction="up"
          delay={0.8}
          className="md:hidden text-center mt-8"
        >
          <Link href="/vehicles">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-2 border-black text-black hover:bg-black hover:text-white font-semibold px-6 py-3 mx-auto"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </AnimatedContainer>
      </div>

      <style jsx>{`
        @keyframes scroll-vehicles {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll-vehicles {
          animation: scroll-vehicles 32s linear infinite;
          will-change: transform;
        }

        .animate-scroll-vehicles:hover {
          animation-play-state: paused;
        }

        /* Mobile - faster scroll */
        @media (max-width: 767px) {
          .animate-scroll-vehicles {
            animation: scroll-vehicles 18s linear infinite;
          }
        }

        /* Desktop - faster scroll (1.25x speed) */
        @media (min-width: 768px) {
          .animate-scroll-vehicles {
            animation: scroll-vehicles 32s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default PopularVehicles;
