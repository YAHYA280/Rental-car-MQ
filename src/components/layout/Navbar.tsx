"use client";

import React, { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, X, Phone, MapPin, Clock, Globe } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: "en" | "fr") => {
    if (newLocale === locale || isPending) return;

    startTransition(() => {
      // Use next-intl's router for proper locale switching
      router.replace(pathname, { locale: newLocale });
    });
  };

  const menuItems = [
    { label: t("home"), href: "/" as const },
    { label: t("vehicles"), href: "/vehicles" as const },
    { label: t("about"), href: "/about" as const },
    { label: t("contact"), href: "/contact" as const },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/Logo.png"
                alt="MELHOR QUE NADA"
                width={140}
                height={140}
                className="rounded hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-red-500 transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Language Switcher */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-white" />
                <Select
                  value={locale}
                  onValueChange={handleLanguageChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-20 h-8 text-sm border border-white/20 bg-transparent text-white hover:bg-white/10">
                    <SelectValue>
                      {isPending ? "..." : locale.toUpperCase()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="fr">FR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6">
                {t("signIn")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-red-500 p-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-red-500 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Language Switcher */}
                <div className="flex items-center space-x-2 py-2">
                  <Globe className="h-4 w-4 text-white" />
                  <Select
                    value={locale}
                    onValueChange={(newLocale: "en" | "fr") => {
                      handleLanguageChange(newLocale);
                      setIsMenuOpen(false);
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-24 h-8 text-sm border border-white/20 bg-transparent text-white">
                      <SelectValue>
                        {isPending ? "..." : locale.toUpperCase()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="fr">FR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="bg-red-600 hover:bg-red-700 text-white w-fit font-semibold mt-4">
                  {t("signIn")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
