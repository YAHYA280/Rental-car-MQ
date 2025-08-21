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
    { label: t("links.businessTravel"), href: `/${locale}/business` },
  ];

  const blogPosts = [
    {
      title: "5 Best Car Rental Deals",
      date: "Jan 12, 2025",
      image: "🚗",
    },
    {
      title: "Why What Is A Rent Car?",
      date: "Jan 10, 2025",
      image: "🔧",
    },
    {
      title: "The Best Ways To Pay Drivers",
      date: "Jan 08, 2025",
      image: "💳",
    },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/${locale}`}
                className="flex items-center space-x-2 mb-4"
              >
                <div className="bg-elhor-red p-2 rounded">
                  <span className="text-white font-bold text-xl">CB</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">Car</span>
                  <span className="text-elhor-red ml-1">Bookers</span>
                </div>
              </Link>
              <p className="text-gray-400 leading-relaxed">
                {t("description")}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-3 text-elhor-red" />
                <span>{t("address")}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-3 text-elhor-red" />
                <span>{t("phone")}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-3 text-elhor-red" />
                <span>{t("email")}</span>
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
                    className="text-gray-300 hover:text-elhor-red transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-elhor-red rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
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
                    className="text-gray-300 hover:text-elhor-red transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-elhor-red rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Recent Posts</h4>
            <div className="space-y-4">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-elhor-red/20 rounded flex items-center justify-center text-2xl group-hover:bg-elhor-red/30 transition-colors duration-200">
                    {post.image}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-medium mb-1 hover:text-elhor-red cursor-pointer transition-colors duration-200 text-sm">
                      {post.title}
                    </h5>
                    <p className="text-xs text-gray-400">
                      Posted on {post.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>{t("copyright")}</p>
              <div className="flex space-x-4 mt-2">
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm hover:text-elhor-red transition-colors duration-200"
                >
                  {t("policies.privacy")}
                </Link>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm hover:text-elhor-red transition-colors duration-200"
                >
                  {t("policies.terms")}
                </Link>
                <Link
                  href={`/${locale}/cookies`}
                  className="text-sm hover:text-elhor-red transition-colors duration-200"
                >
                  {t("policies.cookies")}
                </Link>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-elhor-red/20 rounded-full flex items-center justify-center hover:bg-elhor-red transition-colors duration-300 group"
              >
                <Facebook className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-elhor-red/20 rounded-full flex items-center justify-center hover:bg-elhor-red transition-colors duration-300 group"
              >
                <Instagram className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-elhor-red/20 rounded-full flex items-center justify-center hover:bg-elhor-red transition-colors duration-300 group"
              >
                <Twitter className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-elhor-red/20 rounded-full flex items-center justify-center hover:bg-elhor-red transition-colors duration-300 group"
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
