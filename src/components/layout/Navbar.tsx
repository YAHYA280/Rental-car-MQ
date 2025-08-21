"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, X, Phone, MapPin, Clock, Globe } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${currentPath}`);
  };

  const menuItems = [
    { label: t("home"), href: `/${locale}` },
    { label: t("vehicles"), href: `/${locale}/vehicles` },
    { label: t("about"), href: `/${locale}/about` },
    { label: t("contact"), href: `/${locale}/contact` },
  ];

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-elhor-deep-red text-white py-2 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Tangier, Morocco</span>
              <span className="sm:hidden">Tangier</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">9:00am - 6:00pm</span>
              <span className="sm:hidden">9am-6pm</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+212 123 456 789</span>
              <span className="sm:hidden">+212 123 456</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <Select value={locale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-16 h-6 text-xs border-none bg-transparent text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="fr">FR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="bg-elhor-red p-2 rounded">
                <span className="text-white font-bold text-lg sm:text-xl">
                  CB
                </span>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-white">
                  Car
                </span>
                <span className="text-elhor-red ml-1 text-lg sm:text-xl">
                  Bookers
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-white hover:text-elhor-red transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button className="bg-elhor-red hover:bg-elhor-dark-red text-white font-semibold px-6">
                {t("signIn")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-elhor-red p-2"
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
            <div className="md:hidden py-4 border-t border-gray-700 animate-in slide-in-from-top duration-200">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white hover:text-elhor-red transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button className="bg-elhor-red hover:bg-elhor-dark-red text-white w-fit font-semibold mt-4">
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
