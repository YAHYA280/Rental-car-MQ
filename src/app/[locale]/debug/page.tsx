// Create this file: src/app/[locale]/debug/page.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function DebugPage() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">i18n Debug Page</h1>

      <div className="space-y-4">
        <div>
          <strong>Current Locale:</strong> {locale}
        </div>

        <div>
          <strong>Current Pathname:</strong> {pathname}
        </div>

        <div>
          <strong>Translation Test:</strong>
          <ul className="ml-4">
            <li>nav.home: {t("home")}</li>
            <li>nav.vehicles: {t("vehicles")}</li>
            <li>nav.about: {t("about")}</li>
            <li>nav.contact: {t("contact")}</li>
          </ul>
        </div>

        <div>
          <strong>Test Other Namespaces:</strong>
          <TestOtherNamespaces />
        </div>
      </div>
    </div>
  );
}

function TestOtherNamespaces() {
  try {
    const heroT = useTranslations("hero");
    const aboutT = useTranslations("about");

    return (
      <ul className="ml-4">
        <li>hero.title: {heroT("title")}</li>
        <li>about.title: {aboutT("title")}</li>
      </ul>
    );
  } catch (error) {
    return (
      <div className="text-red-500">
        Error loading translations: {String(error)}
      </div>
    );
  }
}
