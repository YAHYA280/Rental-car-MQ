// src/app/[locale]/vehicles/page.tsx - Fixed with Suspense boundary
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehiclesPageContent from "@/components/vehicles/VehiclesPageContent";

type Props = {
  params: Promise<{ locale: string }>;
};

function VehiclesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-4">
              <div className="aspect-[4/3] bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default async function VehiclesPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <Suspense fallback={<VehiclesLoading />}>
      <VehiclesPageContent />
    </Suspense>
  );
}
