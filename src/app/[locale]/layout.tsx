// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Define locales as a constant for type safety
const locales = ["en", "fr"] as const;
type Locale = (typeof locales)[number];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate dynamic metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // You can use translations for metadata
  const t = await getTranslations({ locale, namespace: "nav" });

  return {
    title: "CarBookers - Premium Car Rental Service",
    description:
      "Premium car rental service in Morocco. Rent luxury and economy cars with the best rates.",
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
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  let messages;
  try {
    // Providing all messages to the client side
    messages = await getMessages();
  } catch (error) {
    console.error("Failed to load messages:", error);
    notFound();
  }

  return (
    <html lang={locale} className="m-0 p-0">
      <body className={`${inter.className} m-0 p-0`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
