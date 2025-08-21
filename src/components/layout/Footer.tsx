"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale();

  const quickLinks = [
    { label: t("links.home"), href: `/${locale}` },
    { label: t("links.routes"), href: `/${locale}/vehicles` },
    { label: t("links.faq"), href: `/${locale}/faq` },
    { label: t("links.contact"), href: `/${locale}/contact` },
  ];

  const serviceLinks = [
    { label: t("links.luxuryBuses"), href: `/${locale}/luxury` },
    { label: t("links.airportTransfer"), href: `/${locale}/airport` },
    { label: t("links.weddingBuses"), href: `/${locale}/wedding` },
  ];

  const blogPosts = []; // Removed blog posts array

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/${locale}`}
                className="flex items-center space-x-3 mb-4"
              >
                <Image
                  src="/Logo.png"
                  alt="MELHOR QUE NADA"
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div>
                  <span className="text-xl font-bold text-white">
                    MELHOR QUE NADA
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 leading-relaxed">
                Your trusted partner for convenient and reliable car rental
                services across Morocco.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-3 text-red-500" />
                <span>RUE 8 ENNASR LOT 635 TANGER</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-3 text-red-500" />
                <span>+212612077309</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">
              {t("services")}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>© 2025 MELHOR QUE NADA. All rights reserved.</p>
              <div className="flex space-x-4 mt-2">
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm hover:text-red-500 transition-colors duration-200"
                >
                  {t("policies.privacy")}
                </Link>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm hover:text-red-500 transition-colors duration-200"
                >
                  {t("policies.terms")}
                </Link>
                <Link
                  href={`/${locale}/cookies`}
                  className="text-sm hover:text-red-500 transition-colors duration-200"
                >
                  {t("policies.cookies")}
                </Link>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-300 group"
              >
                <Facebook className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-300 group"
              >
                <Instagram className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-300 group"
              >
                <Twitter className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-300 group"
              >
                <Youtube className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
