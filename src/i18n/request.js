// src/i18n/request.js
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  // Load all translation files
  const navTranslation = (await import(`../messages/${locale}/nav.json`))
    .default;
  const heroTranslation = (await import(`../messages/${locale}/hero.json`))
    .default;
  const aboutTranslation = (await import(`../messages/${locale}/about.json`))
    .default;
  const vehiclesTranslation = (
    await import(`../messages/${locale}/vehicles.json`)
  ).default;
  const testimonialsTranslation = (
    await import(`../messages/${locale}/testimonials.json`)
  ).default;
  const ctaTranslation = (await import(`../messages/${locale}/cta.json`))
    .default;
  const newsletterTranslation = (
    await import(`../messages/${locale}/newsletter.json`)
  ).default;
  const footerTranslation = (await import(`../messages/${locale}/footer.json`))
    .default;

  return {
    locale,
    messages: {
      nav: navTranslation,
      hero: heroTranslation,
      about: aboutTranslation,
      vehicles: vehiclesTranslation,
      testimonials: testimonialsTranslation,
      cta: ctaTranslation,
      newsletter: newsletterTranslation,
      footer: footerTranslation,
    },
  };
});
