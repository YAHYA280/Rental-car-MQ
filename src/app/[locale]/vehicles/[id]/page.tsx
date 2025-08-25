import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleDetailContent from "@/components/vehicles/VehicleDetailContent";

interface VehicleDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

function VehicleDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Loading */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Loading */}
            <div className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse"></div>

            {/* Content Loading */}
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>

              {/* Specs loading */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Loading */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { locale, id } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <Suspense fallback={<VehicleDetailLoading />}>
      <VehicleDetailContent vehicleId={id} />
    </Suspense>
  );
}
