// src/app/sitemap.ts - Updated for new architecture without contact page

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.melhorquenada.com";

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
        },
      },
    },
    // About page
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/about`,
          fr: `${baseUrl}/fr/a-propos`,
        },
      },
    },
    // Vehicles listing page
    {
      url: `${baseUrl}/vehicles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/vehicles`,
          fr: `${baseUrl}/fr/vehicules`,
        },
      },
    },
    // Individual vehicle pages - Add dynamic vehicle URLs
    ...vehicleUrls.map((vehicleId) => ({
      url: `${baseUrl}/vehicles/${vehicleId}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/vehicles/${vehicleId}`,
          fr: `${baseUrl}/fr/vehicules/${vehicleId}`,
        },
      },
    })),
  ];
}

// Generate vehicle IDs for sitemap
const vehicleUrls = [
  "1", // Cupra Formentor
  "2", // Dacia Duster 2025
  "3", // Dacia Jogger
  "4", // Dacia Logan
  "5", // Dacia Sandero Stepway
  "6", // Dacia Sandero Streetway
  "7", // Volkswagen Golf 8
  "8", // Hyundai Accent
  "9", // Hyundai Tucson
  "10", // KIA Sportage 2024
  "11", // Mercedes G63 AMG
  "12", // Opel Corsa
  "13", // Peugeot 208
  "14", // Peugeot 208 Hybride
  "15", // Porsche Macan
  "16", // Renault CLIO 5
  "17", // SEAT IBIZA FR
  "18", // Volkswagen Touareg
];
