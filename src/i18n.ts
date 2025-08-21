import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  // This can either be defined statically at the top-level or based on the user
  let locale = await requestLocale;

  // Fallback to default locale if not found
  if (!locale) {
    const headersList = await headers();
    locale = headersList.get("x-next-intl-locale") || "en";
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
