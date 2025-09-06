// src/components/vehicles/VehicleDetailContent.tsx - Refactored with modular components
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedContainer from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CarData } from "@/components/types";
import { carService } from "@/services/carService";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

// Import the new modular components
import VehicleBreadcrumb from "./components/VehicleBreadcrumb";
import VehicleImageGallery from "./components/VehicleImageGallery";
import VehicleInfoCard from "./components/VehicleInfoCard";
import RentalBookingForm from "./components/RentalBookingForm";
import VehicleStatsCard from "./components/VehicleStatsCard";
import RelatedVehiclesSection from "./components/RelatedVehiclesSection";

interface VehicleDetailContentProps {
  vehicleId: string;
}

interface RentalDetails {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  differentDropoff: boolean;
}

const VehicleDetailContent: React.FC<VehicleDetailContentProps> = ({
  vehicleId,
}) => {
  const searchParams = useSearchParams();

  // State for vehicle data
  const [vehicle, setVehicle] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<CarData[]>([]);

  // State for rental details form
  const [rentalDetails, setRentalDetails] = useState<RentalDetails>({
    pickupLocation: searchParams.get("pickup") || "",
    dropoffLocation: searchParams.get("dropoff") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    pickupTime: searchParams.get("pickupTime") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    differentDropoff: searchParams.get("differentDropoff") === "true",
  });

  // Other state
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch vehicle data from backend
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching vehicle with ID:", vehicleId);

        const response = await carService.getCar(vehicleId);

        if (response.success && response.data) {
          setVehicle(response.data);
          console.log("Vehicle loaded:", response.data);

          // Fetch related vehicles (same brand)
          if (response.data.brand) {
            fetchRelatedVehicles(response.data.brand, vehicleId);
          }
        } else {
          throw new Error(response.message || "Vehicle not found");
        }
      } catch (err: any) {
        console.error("Error fetching vehicle:", err);
        setError(err.message || "Failed to load vehicle");
        toast.error("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  // Fetch related vehicles
  const fetchRelatedVehicles = async (brand: string, excludeId: string) => {
    try {
      const response = await carService.getCars({
        brand: [brand],
        limit: 3,
      });

      if (response.success && response.data) {
        // Filter out current vehicle
        const related = response.data.filter((car) => car.id !== excludeId);
        setRelatedVehicles(related.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching related vehicles:", err);
      // Don't show error for related vehicles, just log it
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleRentalDetailsChange = (details: RentalDetails) => {
    setRentalDetails(details);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbookers-red-600" />
              <p className="text-gray-600">Loading vehicle details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Vehicle not found"}
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/vehicles">
                <Button className="bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white">
                  Back to Vehicles
                </Button>
              </Link>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-gray-300"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <AnimatedContainer direction="down" className="mb-6">
          <VehicleBreadcrumb />
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <AnimatedContainer direction="down">
              <VehicleImageGallery
                vehicle={vehicle}
                isFavorite={isFavorite}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </AnimatedContainer>

            {/* Vehicle Information */}
            <AnimatedContainer direction="up" delay={0.2}>
              <VehicleInfoCard vehicle={vehicle} />
            </AnimatedContainer>

            {/* Related Vehicles */}
            <AnimatedContainer direction="up" delay={0.4}>
              <RelatedVehiclesSection
                vehicle={vehicle}
                relatedVehicles={relatedVehicles}
              />
            </AnimatedContainer>
          </div>

          {/* Right Column - Rental Details & Booking */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatedContainer direction="left" delay={0.3}>
              <RentalBookingForm
                vehicle={vehicle}
                initialDetails={rentalDetails}
                onDetailsChange={handleRentalDetailsChange}
              />
            </AnimatedContainer>

            {/* Vehicle Stats */}
            <AnimatedContainer direction="left" delay={0.5}>
              <VehicleStatsCard vehicle={vehicle} />
            </AnimatedContainer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehicleDetailContent;
