// src/components/dashboard/cars/components/form/ImagesSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Plus } from "lucide-react";

interface ImagesSectionProps {
  mainImage?: File;
  additionalImages: File[];
  errors: Record<string, string>;
  onMainImageChange: (file: File | undefined) => void;
  onAdditionalImagesChange: (files: FileList | null) => void;
  onRemoveAdditionalImage: (index: number) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  mainImage,
  additionalImages,
  errors,
  onMainImageChange,
  onAdditionalImagesChange,
  onRemoveAdditionalImage,
}) => {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("cars.form.sections.images")}
        </h3>

        {/* Main Image */}
        <div className="mb-6">
          <Label htmlFor="mainImage">{t("cars.form.mainImage")} *</Label>
          <p className="text-sm text-gray-500 mb-2">
            {t("cars.form.uploadMainImage")}
          </p>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              errors.mainImage ? "border-red-500" : "border-gray-300"
            }`}
          >
            {mainImage ? (
              <div className="space-y-3">
                <div className="w-32 h-24 mx-auto relative">
                  <img
                    src={URL.createObjectURL(mainImage)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onMainImageChange(undefined)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{mainImage.name}</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">{t("cars.form.mainImage")}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("cars.form.imageFormats")}
                </p>
              </>
            )}
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={(e) => onMainImageChange(e.target.files?.[0])}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("mainImage")?.click()}
            >
              {t("cars.form.chooseImage")}
            </Button>
          </div>
          {errors.mainImage && (
            <p className="text-red-500 text-sm mt-1">{errors.mainImage}</p>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <Label htmlFor="additionalImages">
            {t("cars.form.additionalImages")}
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            {t("cars.form.additionalImagesDescription")}
          </p>

          {additionalImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {additionalImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            id="additionalImages"
            accept="image/*"
            multiple
            onChange={(e) => onAdditionalImagesChange(e.target.files)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("additionalImages")?.click()}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("cars.form.addMoreImages")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagesSection;
