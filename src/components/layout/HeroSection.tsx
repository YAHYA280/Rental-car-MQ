"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Users,
  Star,
  MapPin,
  Calendar,
  Clock,
  Search,
  Navigation,
  RotateCcw,
} from "lucide-react";
import AnimatedContainer from "@/components/ui/animated-container";

const HeroSection = () => {
  const t = useTranslations("hero");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchData, setSearchData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    differentDropoff: false,
  });

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

  // Auto-change background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Generate particles with stable positions
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${(i * 6.7 + 10) % 100}%`,
      top: `${(i * 4.3 + 15) % 100}%`,
      delay: i * 0.2,
      duration: 3 + (i % 4),
    }));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    // Handle search logic here
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 10, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>

        {/* Animated particles */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
                y: [-10, 10, -10],
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
        <div className="text-center space-y-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <AnimatedContainer direction="down" delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block text-white mb-2">Find Your</span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Perfect Ride
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover premium vehicles for every journey. From luxury cars to
              family SUVs, we have the perfect vehicle waiting for you.
            </p>
          </AnimatedContainer>

          {/* Search Component */}
          <AnimatedContainer direction="up" delay={0.6}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl max-w-5xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="space-y-6">
                {/* Location Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pickup Location */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="pickup"
                      className="text-white font-medium flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-blue-400" />
                      Pickup Location
                    </Label>
                    <div className="relative">
                      <Input
                        id="pickup"
                        type="text"
                        placeholder="Enter pickup location"
                        value={searchData.pickupLocation}
                        onChange={(e) =>
                          handleInputChange("pickupLocation", e.target.value)
                        }
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 h-12 pl-4 focus:bg-white/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Dropoff Location */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="dropoff"
                        className="text-white font-medium flex items-center gap-2 flex-1"
                      >
                        <Navigation className="h-4 w-4 text-green-400" />
                        Drop-off Location
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleInputChange(
                            "differentDropoff",
                            !searchData.differentDropoff
                          )
                        }
                        className="text-xs text-blue-300 hover:text-blue-200 hover:bg-white/10"
                      >
                        {searchData.differentDropoff
                          ? "Same as pickup"
                          : "Different location"}
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="dropoff"
                        type="text"
                        placeholder={
                          searchData.differentDropoff
                            ? "Enter drop-off location"
                            : "Same as pickup"
                        }
                        value={
                          searchData.differentDropoff
                            ? searchData.dropoffLocation
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange("dropoffLocation", e.target.value)
                        }
                        disabled={!searchData.differentDropoff}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 h-12 pl-4 focus:bg-white/30 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pickup Date */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="pickup-date"
                      className="text-white font-medium flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 text-purple-400" />
                      Pickup Date
                    </Label>
                    <Input
                      id="pickup-date"
                      type="date"
                      value={searchData.pickupDate}
                      onChange={(e) =>
                        handleInputChange("pickupDate", e.target.value)
                      }
                      className="bg-white/20 border-white/30 text-white h-12 focus:bg-white/30 transition-all"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Pickup Time */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="pickup-time"
                      className="text-white font-medium flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-purple-400" />
                      Pickup Time
                    </Label>
                    <Select
                      value={searchData.pickupTime}
                      onValueChange={(value) =>
                        handleInputChange("pickupTime", value)
                      }
                    >
                      <SelectTrigger className="bg-white/20 border-white/30 text-white h-12 focus:bg-white/30">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Return Date */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="return-date"
                      className="text-white font-medium flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4 text-orange-400" />
                      Return Date
                    </Label>
                    <Input
                      id="return-date"
                      type="date"
                      value={searchData.returnDate}
                      onChange={(e) =>
                        handleInputChange("returnDate", e.target.value)
                      }
                      className="bg-white/20 border-white/30 text-white h-12 focus:bg-white/30 transition-all"
                      min={
                        searchData.pickupDate ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>

                  {/* Return Time */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="return-time"
                      className="text-white font-medium flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-orange-400" />
                      Return Time
                    </Label>
                    <Select
                      value={searchData.returnTime}
                      onValueChange={(value) =>
                        handleInputChange("returnTime", value)
                      }
                    >
                      <SelectTrigger className="bg-white/20 border-white/30 text-white h-12 focus:bg-white/30">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                  >
                    <Search className="h-5 w-5" />
                    Search Available Cars
                  </Button>
                </div>
              </form>
            </div>
          </AnimatedContainer>

          {/* Stats Section */}
          <AnimatedContainer direction="up" delay={0.8}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-white/20">
              <motion.div
                className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-full mb-4 border border-blue-400/30">
                  <Car className="h-7 w-7 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {t("stats.availableCars")}
                </div>
                <div className="text-gray-300 font-medium">
                  {t("stats.availableCarsLabel")}
                </div>
              </motion.div>

              <motion.div
                className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/20 rounded-full mb-4 border border-purple-400/30">
                  <Users className="h-7 w-7 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {t("stats.happyCustomers")}
                </div>
                <div className="text-gray-300 font-medium">
                  {t("stats.happyCustomersLabel")}
                </div>
              </motion.div>

              <motion.div
                className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-pink-500/20 rounded-full mb-4 border border-pink-400/30">
                  <Star className="h-7 w-7 text-pink-400" />
                </div>
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {t("stats.clientRating")}
                </div>
                <div className="text-gray-300 font-medium">
                  {t("stats.clientRatingLabel")}
                </div>
              </motion.div>
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
