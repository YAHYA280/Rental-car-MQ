// src/components/dashboard/users/EditUserForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Phone, Mail, User } from "lucide-react";

// Types
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  driverLicenseImage?: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverLicenseImage?: File;
}

interface EditUserFormProps {
  user: UserData;
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onSubmit,
  onClose,
}) => {
  const t = useTranslations("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
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
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Morocco phone format: +212XXXXXXXXX or 212XXXXXXXXX or 0XXXXXXXXX
    const phoneRegex = /^(\+212|212|0)[5-7]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim())
      newErrors.firstName = t("users.form.validation.firstNameRequired");
    if (!formData.lastName.trim())
      newErrors.lastName = t("users.form.validation.lastNameRequired");
    if (!formData.email.trim()) {
      newErrors.email = t("users.form.validation.emailRequired");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("users.form.validation.emailFormat");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("users.form.validation.phoneRequired");
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = t("users.form.validation.phoneFormat");
    }

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
      await onSubmit(formData);
    } catch (error) {
      console.error("Error updating user:", error);
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

            <div>
              <Label htmlFor="email">{t("users.form.email")} *</Label>
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
            </div>

            <div>
              <Label htmlFor="phone">{t("users.form.phone")} *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={t("users.form.placeholders.phone")}
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver License */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {t("users.form.sections.driverLicense")}
          </h3>

          {/* Current Driver License Display */}
          {user.driverLicenseImage && (
            <div className="mb-4">
              <Label className="text-base">Current Driver License</Label>
              <div className="w-full max-w-md h-48 relative rounded-lg overflow-hidden border mt-2">
                <img
                  src={user.driverLicenseImage}
                  alt="Current Driver License"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* New Driver License Upload */}
          <div>
            <Label htmlFor="driverLicenseImage">
              {t("users.form.newDriverLicense")} (Optional)
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              Leave empty to keep the current driver license image
            </p>
            <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300">
              {formData.driverLicenseImage ? (
                <div className="space-y-3">
                  <div className="w-48 h-32 mx-auto relative">
                    <img
                      src={URL.createObjectURL(formData.driverLicenseImage)}
                      alt="New Driver License Preview"
                      className="w-full h-full object-cover rounded-lg border"
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
                    Upload New Driver License
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    JPG, PNG or WebP (Max 10MB)
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
                {formData.driverLicenseImage ? "Change Image" : "Choose Image"}
              </Button>
            </div>
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
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700 w-full sm:w-auto order-1 sm:order-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update User"}
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;
