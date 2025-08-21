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
      <body className={`${inter.className} m-0 p-0`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
