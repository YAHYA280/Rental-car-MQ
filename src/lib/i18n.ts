// src/lib/i18n.ts
import { AbstractIntlMessages } from "next-intl";

const locales = ["en", "fr"] as const;

export async function getMessages(
  locale: string
): Promise<AbstractIntlMessages> {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
}

export { locales };
export type Locale = (typeof locales)[number];
