// src/i18n/routing.ts - Updated with dynamic routes
import { defineRouting } from "next-intl/routing";

// Define locales as const assertion for better type inference
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/vehicles": {
      en: "/vehicles",
      fr: "/vehicules",
    },
    "/vehicles/[id]": {
      en: "/vehicles/[id]",
      fr: "/vehicules/[id]",
    },
    "/about": {
      en: "/about",
      fr: "/a-propos",
    },
    "/contact": {
      en: "/contact",
      fr: "/contact",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;

// Type guard function for locale validation
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
