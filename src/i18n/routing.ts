// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/vehicles": {
      en: "/vehicles",
      fr: "/vehicules",
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
export type Locale = (typeof routing.locales)[number];
