// src/components/dashboard/cars/components/form/ImagesSection.tsx - Enhanced
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Plus, AlertCircle, Image } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ImagesSectionProps {
  mainImage?: File;
  additionalImages: File[];
  errors: Record<string, string>;
  touchedFields?: Set<string>;
  onMainImageChange: (file: File | undefined) => void;
  onAdditionalImagesChange: (files: FileList | null) => void;
  onRemoveAdditionalImage: (index: number) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  mainImage,
  additionalImages,
  errors,
  touchedFields = new Set(),
  onMainImageChange,
  onAdditionalImagesChange,
  onRemoveAdditionalImage,
}) => {
  const t = useTranslations("dashboard");

  // Check if field has error and should show it
  const shouldShowError = (field: string) => {
    return errors[field] && touchedFields.has(field);
  };

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload only JPG, PNG, or WebP images";
    }

    if (file.size > maxSize) {
      return "Image size must be less than 10MB";
    }

    return null;
  };

  // Handle main image selection with validation
  const handleMainImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);

    if (error) {
      alert(error); // You can replace this with a toast notification
      return;
    }

    onMainImageChange(file);
  };

  // Handle additional images selection with validation
  const handleAdditionalImagesSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(`Some files were rejected:\n${errors.join("\n")}`);
    }

    if (validFiles.length > 0) {
      // Create a new FileList-like object with valid files
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));
      onAdditionalImagesChange(dataTransfer.files);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Image className="h-5 w-5" />
          {t("cars.form.sections.images")}
        </h3>

        {/* Main Image */}
        <div className="mb-6" data-error="mainImage">
          <Label htmlFor="mainImage" className="flex items-center gap-2">
            {t("cars.form.mainImage")} *
            {shouldShowError("mainImage") && (
              <Popover>
                <PopoverTrigger>
                  <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3">
                  <div className="text-sm text-red-600">
                    <strong>Main Image Required:</strong>
                    <p className="mt-1">{errors.mainImage}</p>
                    <p className="mt-2 text-gray-600">
                      Please upload a high-quality main image of the vehicle.
                      This will be the primary image displayed in listings.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            {t("cars.form.uploadMainImage")}
          </p>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              shouldShowError("mainImage")
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium break-all px-2">
                    {mainImage.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(mainImage.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">{t("cars.form.mainImage")}</p>
                <p className="text-sm text-gray-500 mb-4">
                  JPG, PNG or WebP (Max 10MB)
                </p>
              </>
            )}
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={(e) => handleMainImageSelect(e.target.files)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("mainImage")?.click()}
              className={
                shouldShowError("mainImage")
                  ? "border-red-500 text-red-600 hover:bg-red-50"
                  : ""
              }
            >
              <Upload className="h-4 w-4 mr-2" />
              {mainImage ? "Change Image" : t("cars.form.chooseImage")}
            </Button>
          </div>
          {shouldShowError("mainImage") && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.mainImage}
            </p>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <Label htmlFor="additionalImages" className="flex items-center gap-2">
            {t("cars.form.additionalImages")}
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Optional
            </span>
          </Label>
          <p className="text-sm text-gray-500 mb-3">
            Upload additional images to showcase different angles and features
            (Max 5 images)
          </p>

          {additionalImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {additionalImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-gray-300 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            id="additionalImages"
            accept="image/*"
            multiple
            onChange={(e) => handleAdditionalImagesSelect(e.target.files)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("additionalImages")?.click()}
            disabled={additionalImages.length >= 5}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {additionalImages.length === 0
              ? t("cars.form.addMoreImages")
              : `Add More (${additionalImages.length}/5)`}
          </Button>

          {additionalImages.length >= 5 && (
            <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Maximum of 5 additional images reached
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagesSection;
