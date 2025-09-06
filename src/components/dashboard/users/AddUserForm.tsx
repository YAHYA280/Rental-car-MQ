// src/components/dashboard/users/AddUserForm.tsx - FIXED: Consistent with EditUserForm improvements
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Phone, Mail, User } from "lucide-react";
import { UserFormData } from "@/components/types";
import Image from "next/image";

interface AddUserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onClose }) => {
  const t = useTranslations("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    // FIXED: Handle phone number formatting
    if (field === "phone") {
      // Remove all non-numeric characters
      const cleaned = value.replace(/\D/g, "");

      // Format as 06 XX XX XX XX if it starts with 06 or 07
      if (
        cleaned.length <= 10 &&
        (cleaned.startsWith("06") || cleaned.startsWith("07"))
      ) {
        let formatted = cleaned;
        if (cleaned.length > 2) {
          formatted = cleaned.substring(0, 2);
          if (cleaned.length > 2) formatted += " " + cleaned.substring(2, 4);
          if (cleaned.length > 4) formatted += " " + cleaned.substring(4, 6);
          if (cleaned.length > 6) formatted += " " + cleaned.substring(6, 8);
          if (cleaned.length > 8) formatted += " " + cleaned.substring(8, 10);
        }
        value = formatted;
      } else if (cleaned.length <= 10) {
        // Allow typing but don't format invalid numbers
        value = cleaned;
      } else {
        // Don't allow more than 10 digits
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDriverLicenseChange = (file: File | undefined) => {
    setFormData((prev) => ({
      ...prev,
      driverLicenseImage: file,
    }));
    if (errors.driverLicenseImage) {
      setErrors((prev) => ({ ...prev, driverLicenseImage: "" }));
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email || email.trim() === "") return true; // FIXED: Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // FIXED: Remove spaces and validate Moroccan phone format
    const cleaned = phone.replace(/\s/g, "");
    const phoneRegex = /^0[67]\d{8}$/;
    return phoneRegex.test(cleaned);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim())
      newErrors.firstName = t("users.form.validation.firstNameRequired");
    if (!formData.lastName.trim())
      newErrors.lastName = t("users.form.validation.lastNameRequired");

    // FIXED: Email validation - only validate if provided
    if (
      formData.email &&
      formData.email.trim() !== "" &&
      !validateEmail(formData.email)
    ) {
      newErrors.email = t("users.form.validation.emailFormat");
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t("users.form.validation.phoneRequired");
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = t("users.form.validation.phoneFormat");
    }

    // FIXED: Driver license is now optional - no validation error

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // FIXED: Clean the phone number before submitting (remove spaces)
      const cleanedFormData = {
        ...formData,
        phone: formData.phone.replace(/\s/g, ""),
        // FIXED: Set empty email to undefined so backend handles it as null
        email:
          formData.email && formData.email.trim() !== ""
            ? formData.email.trim()
            : undefined,
      };

      await onSubmit(cleanedFormData);
      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {t("users.form.sections.basicInfo")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t("users.form.firstName")} *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder={t("users.form.placeholders.firstName")}
                  className={`pl-10 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">{t("users.form.lastName")} *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder={t("users.form.placeholders.lastName")}
                  className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* FIXED: Email is now optional */}
            <div>
              <Label htmlFor="email">{t("users.form.email")} (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("users.form.placeholders.email")}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Email is optional but recommended for notifications
              </p>
            </div>

            {/* FIXED: Phone with proper formatting */}
            <div>
              <Label htmlFor="phone">{t("users.form.phone")} *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="06 XX XX XX XX"
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Moroccan mobile number (06 or 07)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FIXED: Driver License Upload - Now Optional */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {t("users.form.sections.driverLicense")}
          </h3>

          <div>
            <Label htmlFor="driverLicenseImage">
              {t("users.form.driverLicense")} (Optional)
            </Label>
            <p className="text-sm text-gray-500 mb-3">
              Driver license can be uploaded now or later
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center border-gray-300`}
            >
              {formData.driverLicenseImage ? (
                <div className="space-y-3">
                  <div className="w-48 h-32 mx-auto relative">
                    <Image
                      src={URL.createObjectURL(formData.driverLicenseImage)}
                      alt="Driver License Preview"
                      fill
                      className="object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleDriverLicenseChange(undefined)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 break-all px-2">
                    {formData.driverLicenseImage.name}
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-base text-gray-600 mb-2">
                    {t("users.form.uploadDriverLicense")}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("users.form.imageFormats")}
                  </p>
                </>
              )}
              <input
                type="file"
                id="driverLicenseImage"
                accept="image/*"
                onChange={(e) => handleDriverLicenseChange(e.target.files?.[0])}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("driverLicenseImage")?.click()
                }
              >
                {formData.driverLicenseImage
                  ? t("users.form.changeImage")
                  : t("users.form.chooseImage")}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Driver license can be uploaded later if needed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("common.loading") : t("users.form.submit")}
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
