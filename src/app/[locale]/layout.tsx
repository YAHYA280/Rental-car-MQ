import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isValidLocale } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Enable static rendering for metadata
  setRequestLocale(locale);

  // Define metadata for each language
  const metadata = {
    en: {
      title: "MELHOR QUE NADA - Premium Car Rental in Tangier, Morocco",
      description:
        "MELHOR QUE NADA location de voiture - Premium car rental service in Tangier. Find us at RUE 8 ENNASR LOT 635 TANGER. We offer luxury cars, SUVs, and economy vehicles with the best rates in Morocco.",
      keywords:
        "car rental Tangier, location voiture Tanger, MELHOR QUE NADA, premium cars Morocco, luxury car rental, airport transfer Tangier",
    },
    fr: {
      title: "MELHOR QUE NADA - Location de Voiture Premium à Tanger, Maroc",
      description:
        "MELHOR QUE NADA location de voiture - Service de location de voitures premium à Tanger. Trouvez-nous au RUE 8 ENNASR LOT 635 TANGER. Nous proposons des voitures de luxe, SUV et véhicules économiques aux meilleurs tarifs au Maroc.",
      keywords:
        "location voiture Tanger, car rental Tangier, MELHOR QUE NADA, voitures premium Maroc, location voiture luxe, transfert aéroport Tanger",
    },
  };

  const currentLang = locale === "fr" ? "fr" : "en";
  const currentMetadata = metadata[currentLang];

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    authors: [{ name: "MELHOR QUE NADA" }],
    creator: "MELHOR QUE NADA",
    publisher: "MELHOR QUE NADA",

    // Open Graph metadata for social sharing
    openGraph: {
      type: "website",
      locale: locale,
      alternateLocale: locale === "en" ? "fr" : "en",
      url: `https://melhorquenada.com/${locale}`,
      siteName: "MELHOR QUE NADA",
      title: currentMetadata.title,
      description: currentMetadata.description,
      images: [
        {
          url: "/Logo.png",
          width: 1200,
          height: 630,
          alt: "MELHOR QUE NADA - Location de Voiture",
        },
      ],
    },

    // Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      site: "@melhorquenada",
      creator: "@melhorquenada",
      title: currentMetadata.title,
      description: currentMetadata.description,
      images: ["/Logo.png"],
    },

    // Additional SEO metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Verification for search engines
    verification: {
      google: "your-google-verification-code", // Replace with actual verification code
      // bing: "your-bing-verification-code",
    },

    // Structured data for local business
    other: {
      "geo.region": "MA-01",
      "geo.placename": "Tangier",
      "geo.position": "35.751250;-5.830611",
      ICBM: "35.751250, -5.830611",
      "business:contact_data:street_address": "RUE 8 ENNASR LOT 635",
      "business:contact_data:locality": "TANGER",
      "business:contact_data:region": "Tanger-Tetouan-Al Hoceima",
      "business:contact_data:postal_code": "90000",
      "business:contact_data:country_name": "Morocco",
      "business:contact_data:phone_number": "+212612077309",
    },

    // Canonical URL
    alternates: {
      canonical: `https://melhorquenada.com/${locale}`,
      languages: {
        en: "https://melhorquenada.com/en",
        fr: "https://melhorquenada.com/fr",
      },
    },

    // Category for app stores
    category: "travel",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering - THIS IS THE KEY FIX
  setRequestLocale(locale);

  let messages;
  try {
    // Load messages for the specific locale
    messages = await getMessages();
  } catch (error) {
    console.error("Failed to load messages for locale:", locale, error);
    notFound();
  }

  return (
    <html lang={locale} className="m-0 p-0">
      <head>
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CarRental",
              name: "MELHOR QUE NADA",
              alternateName: "MELHOR QUE NADA location de voiture",
              description:
                locale === "fr"
                  ? "Service de location de voitures premium à Tanger, Maroc. Nous proposons des voitures de luxe, SUV et véhicules économiques."
                  : "Premium car rental service in Tangier, Morocco. We offer luxury cars, SUVs, and economy vehicles.",
              url: `https://melhorquenada.com/${locale}`,
              telephone: "+212612077309",
              address: {
                "@type": "PostalAddress",
                streetAddress: "RUE 8 ENNASR LOT 635",
                addressLocality: "Tanger",
                addressRegion: "Tanger-Tetouan-Al Hoceima",
                postalCode: "90000",
                addressCountry: "MA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "35.751250",
                longitude: "-5.830611",
              },
              openingHours: "Mo-Su 09:00-18:00",
              priceRange: "$$",
              image: "https://melhorquenada.com/Logo.png",
              sameAs: [
                "https://facebook.com/melhorquenada",
                "https://instagram.com/melhorquenada",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name:
                  locale === "fr"
                    ? "Catalogue de Véhicules"
                    : "Vehicle Catalog",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Car",
                      name:
                        locale === "fr" ? "Voitures de Luxe" : "Luxury Cars",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Car",
                      name: "SUV",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Car",
                      name:
                        locale === "fr"
                          ? "Voitures Économiques"
                          : "Economy Cars",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} m-0 p-0`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
