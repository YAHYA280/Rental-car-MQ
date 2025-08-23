import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server"; // ADD getTranslations
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

  // GET SEO TRANSLATIONS - ADD THESE LINES
  const tSeo = await getTranslations("seo");

  // Use translations instead of hardcoded strings
  const metadata = {
    en: {
      title: tSeo("homeTitle"), // Uses translation
      description:
        "MELHOR QUE NADA premium car rental in Tangier, Morocco. Luxury vehicles, reliable service, and competitive rates. Located at RUE 8 ENNASR LOT 635 TANGER.",
      keywords:
        "MELHOR QUE NADA, Melhor Que Nada, Melhor Que, Melhor, car rental Morocco, rental cars Tangier, luxury car rental Morocco, location voiture maroc",
    },
    fr: {
      title: tSeo("homeTitle"), // Uses translation
      description:
        "MELHOR QUE NADA location de voiture premium à Tanger, Maroc. Véhicules de luxe, service fiable et tarifs compétitifs. Situés au RUE 8 ENNASR LOT 635 TANGER.",
      keywords:
        "MELHOR QUE NADA, Melhor Que Nada, Melhor Que, Melhor, location voiture maroc, location voiture tanger, location luxe maroc, rental cars morocco",
    },
  };

  const currentLang = locale === "fr" ? "fr" : "en";
  const currentMetadata = metadata[currentLang];

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    authors: [{ name: tSeo("brandName") }],
    creator: tSeo("brandName"),
    publisher: tSeo("brandName"),

    // Enhanced Open Graph metadata
    openGraph: {
      type: "website",
      locale: locale,
      alternateLocale: locale === "en" ? "fr" : "en",
      url: `https://www.melhorquenada.com/${locale}`,
      siteName: tSeo("brandName"),
      title: currentMetadata.title,
      description: currentMetadata.description,
      images: [
        {
          url: "https://www.melhorquenada.com/Logo.png",
          width: 1200,
          height: 630,
          alt: `${tSeo("brandName")} - Premium Car Rental Morocco`, // USE TRANSLATION
        },
      ],
    },

    // Enhanced Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      site: "@melhorquenada",
      creator: "@melhorquenada",
      title: currentMetadata.title,
      description: currentMetadata.description,
      images: ["https://www.melhorquenada.com/Logo.png"],
    },

    // Enhanced robots metadata
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

    // Verification for search engines (you'll need to get these codes)
    verification: {
      google: "XOzwAyuy0DZYEOCc0J44HOu4hGtbcdDzSeK2s5HQgQg", // Replace with actual verification code from Google Search Console
    },

    // Enhanced structured data for local business
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
      // Add brand-specific meta tags
      "application-name": tSeo("brandName"), // USE TRANSLATION
      "apple-mobile-web-app-title": tSeo("brandName"), // USE TRANSLATION
      "theme-color": "#dc2626",
    },

    // Enhanced canonical URL and alternates
    alternates: {
      canonical: `https://www.melhorquenada.com/${locale}`,
      languages: {
        en: "https://www.melhorquenada.com/en",
        fr: "https://www.melhorquenada.com/fr",
        "x-default": "https://www.melhorquenada.com/en",
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

  // GET TRANSLATIONS FOR SCHEMA - ADD THESE LINES
  const tSeo = await getTranslations("seo");

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
        {/* Enhanced Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CarRental",
              name: tSeo("brandName"), // USE TRANSLATION
              alternateName: ["Melhor Que Nada", "Melhor Que", "Melhor"],
              description:
                locale === "fr"
                  ? `${tSeo(
                      "brandName"
                    )} - Service de location de voitures premium à Tanger, Maroc. Nous proposons des voitures de luxe, SUV et véhicules économiques avec un service d'excellence.`
                  : `${tSeo(
                      "brandName"
                    )} - Premium car rental service in Tangier, Morocco. We offer luxury cars, SUVs, and economy vehicles with excellent service.`,
              url: `https://www.melhorquenada.com/${locale}`,
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
              image: "https://www.melhorquenada.com/Logo.png",
              logo: "https://www.melhorquenada.com/Logo.png",
              sameAs: [
                "https://facebook.com/melhorquenada",
                "https://instagram.com/melhorquenada",
              ],
              areaServed: [
                {
                  "@type": "Country",
                  name: "Morocco",
                },
                {
                  "@type": "City",
                  name: "Tangier",
                },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name:
                  locale === "fr"
                    ? `${tSeo("brandName")} - Catalogue de Véhicules`
                    : `${tSeo("brandName")} - Vehicle Catalog`,
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Car",
                      name:
                        locale === "fr" ? "Voitures de Luxe" : "Luxury Cars",
                      description: `Premium luxury vehicles by ${tSeo(
                        "brandName"
                      )}`, // USE TRANSLATION
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Car",
                      name: "SUV",
                      description: "Spacious SUVs for families and groups",
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
                      description: "Affordable and reliable vehicles",
                    },
                  },
                ],
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "150",
              },
              serviceArea: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: "35.751250",
                  longitude: "-5.830611",
                },
                geoRadius: "50000",
              },
            }),
          }}
        />

        {/* Additional Local Business Schema for better local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.melhorquenada.com",
              name: tSeo("brandName"), // USE TRANSLATION
              image: "https://www.melhorquenada.com/Logo.png",
              telephone: "+212612077309",
              address: {
                "@type": "PostalAddress",
                streetAddress: "RUE 8 ENNASR LOT 635",
                addressLocality: "Tangier",
                addressRegion: "Tanger-Tetouan-Al Hoceima",
                postalCode: "90000",
                addressCountry: "MA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "35.751250",
                longitude: "-5.830611",
              },
              url: "https://www.melhorquenada.com",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "09:00",
                closes: "18:00",
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
