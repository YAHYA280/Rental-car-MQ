// src/components/dashboard/users/EditUserForm.tsx - UPDATED: Removed city, postal code, emergency contact, notes, and referral code
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { UserData, UserFormData } from "@/components/types";

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
    dateOfBirth: "",
    address: "",
    country: "MA",
    driverLicenseNumber: "",
    passportNumber: "",
    passportIssuedAt: "",
    cinNumber: "",
  });

  // Document image states (for new uploads)
  const [newDocumentImages, setNewDocumentImages] = useState<{
    driverLicense?: File;
    passport?: File;
    cin?: File;
  }>({});

  // Track which existing documents to keep
  const [keepExistingDocuments, setKeepExistingDocuments] = useState({
    driverLicense: true,
    passport: true,
    cin: true,
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
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || "",
        country: user.country || "MA",
        driverLicenseNumber: user.driverLicenseNumber || "",
        passportNumber: user.passportNumber || "",
        passportIssuedAt: user.passportIssuedAt || "",
        cinNumber: user.cinNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    // Handle phone number formatting
    if (field === "phone") {
      const cleaned = value.replace(/\D/g, "");
      if (
        cleaned.length <= 10 &&
        (cleaned.startsWith("06") ||
          cleaned.startsWith("07") ||
          cleaned.length < 2)
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
      } else if (cleaned.length > 10) {
        return; // Don't allow more than 10 digits
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle document image uploads
  const handleDocumentImageChange = (
    documentType: "driverLicense" | "passport" | "cin",
    file: File | undefined
  ) => {
    setNewDocumentImages((prev) => ({
      ...prev,
      [documentType]: file,
    }));

    // If uploading new file, we'll replace the existing one
    if (file) {
      setKeepExistingDocuments((prev) => ({
        ...prev,
        [documentType]: false,
      }));
    }

    // Clear any related errors
    const errorKey = `${documentType}Image`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  // Remove existing document
  const removeExistingDocument = (
    documentType: "driverLicense" | "passport" | "cin"
  ) => {
    setKeepExistingDocuments((prev) => ({
      ...prev,
      [documentType]: false,
    }));

    // Also clear any new upload for this document type
    setNewDocumentImages((prev) => ({
      ...prev,
      [documentType]: undefined,
    }));
  };

  // Restore existing document
  const restoreExistingDocument = (
    documentType: "driverLicense" | "passport" | "cin"
  ) => {
    setKeepExistingDocuments((prev) => ({
      ...prev,
      [documentType]: true,
    }));

    // Clear any new upload for this document type
    setNewDocumentImages((prev) => ({
      ...prev,
      [documentType]: undefined,
    }));
  };

  const validateEmail = (email: string): boolean => {
    if (!email || email.trim() === "") return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, "");
    const phoneRegex = /^0[67]\d{8}$/;
    return phoneRegex.test(cleaned);
  };

  // Validate date of birth
  const validateDateOfBirth = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return true; // Optional field
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 100;
  };

  // Simplified form validation (removed emergency contact validation)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid Moroccan phone number";
    }

    // Email validation (optional)
    if (
      formData.email &&
      formData.email.trim() !== "" &&
      !validateEmail(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Date of birth validation
    if (formData.dateOfBirth && !validateDateOfBirth(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Customer must be between 18 and 100 years old";
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
      // Prepare the simplified user data
      const userData: UserFormData = {
        ...formData,
        phone: formData.phone.replace(/\s/g, ""), // Clean phone number
        email:
          formData.email && formData.email.trim() !== ""
            ? formData.email.trim()
            : undefined,
        // Add document images only if new ones are uploaded
        driverLicenseImage: newDocumentImages.driverLicense,
        passportImage: newDocumentImages.passport,
        cinImage: newDocumentImages.cin,
      };

      console.log("Updating user with simplified data:", userData);
      await onSubmit(userData);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get existing document display data
  const getExistingDocumentUrl = (
    documentType: "driverLicense" | "passport" | "cin"
  ): string | null => {
    switch (documentType) {
      case "driverLicense":
        return user.driverLicenseImage?.dataUrl || null;
      case "passport":
        return user.passportImage?.dataUrl || null;
      case "cin":
        return user.cinImage?.dataUrl || null;
      default:
        return null;
    }
  };

  // Enhanced document upload component with existing document handling
  const DocumentUpload = ({
    documentType,
    label,
    description,
    newFile,
    onChange,
  }: {
    documentType: "driverLicense" | "passport" | "cin";
    label: string;
    description: string;
    newFile?: File;
    onChange: (file: File | undefined) => void;
  }) => {
    const existingUrl = getExistingDocumentUrl(documentType);
    const keepExisting = keepExistingDocuments[documentType];
    const hasExisting = !!existingUrl;

    return (
      <div className="space-y-3">
        <Label>{label}</Label>

        {/* Existing Document Display */}
        {hasExisting && keepExisting && !newFile && (
          <div className="space-y-2">
            <p className="text-sm text-green-600 font-medium">
              Current {label}
            </p>
            <div className="relative w-full h-32 border rounded-lg overflow-hidden">
              <Image
                src={existingUrl!}
                alt={`Current ${label}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => removeExistingDocument(documentType)}
                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                  title={`Remove ${label}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Removed Document Notice */}
        {hasExisting && !keepExisting && !newFile && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {label} will be removed when you save changes.
            </p>
            <button
              type="button"
              onClick={() => restoreExistingDocument(documentType)}
              className="text-sm text-red-700 hover:text-red-800 underline mt-1"
            >
              Restore existing {label.toLowerCase()}
            </button>
          </div>
        )}

        {/* New File Upload */}
        {(!hasExisting || !keepExisting || newFile) && (
          <div className="border-2 border-dashed rounded-lg p-4 text-center border-gray-300">
            {newFile ? (
              <div className="space-y-3">
                <div className="w-32 h-24 mx-auto relative">
                  <Image
                    src={URL.createObjectURL(newFile)}
                    alt={`New ${label} Preview`}
                    fill
                    className="object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => onChange(undefined)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 break-all px-2">
                  {newFile.name}
                </p>
                <p className="text-sm text-blue-600">
                  This will replace the existing {label.toLowerCase()}
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {hasExisting ? `Upload New ${label}` : `Upload ${label}`}
                </p>
                <p className="text-xs text-gray-500">{description}</p>
              </>
            )}
            <input
              type="file"
              id={`${documentType}Image`}
              accept="image/*"
              onChange={(e) => onChange(e.target.files?.[0])}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById(`${documentType}Image`)?.click()
              }
              className="mt-2"
            >
              {newFile ? "Change Image" : "Choose Image"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter first name"
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
              <Label htmlFor="lastName">Last Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter last name"
                  className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
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

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
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

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={`pl-10 ${
                    errors.dateOfBirth ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Required for rental contracts
              </p>
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MA">Morocco</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="ES">Spain</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="IT">Italy</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information - Simplified */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter full address"
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Complete address including street, building number, city, etc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driver License */}
            <div>
              <Label htmlFor="driverLicenseNumber">Driver License Number</Label>
              <Input
                id="driverLicenseNumber"
                value={formData.driverLicenseNumber}
                onChange={(e) =>
                  handleInputChange("driverLicenseNumber", e.target.value)
                }
                placeholder="Enter license number"
              />
            </div>

            {/* Passport Number */}
            <div>
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) =>
                  handleInputChange("passportNumber", e.target.value)
                }
                placeholder="Enter passport number"
              />
            </div>

            {/* Passport Issued At */}
            <div>
              <Label htmlFor="passportIssuedAt">Passport Issued At</Label>
              <Input
                id="passportIssuedAt"
                value={formData.passportIssuedAt}
                onChange={(e) =>
                  handleInputChange("passportIssuedAt", e.target.value)
                }
                placeholder="City/Country where issued"
              />
            </div>

            {/* CIN Number */}
            <div>
              <Label htmlFor="cinNumber">CIN Number</Label>
              <Input
                id="cinNumber"
                value={formData.cinNumber}
                onChange={(e) => handleInputChange("cinNumber", e.target.value)}
                placeholder="Enter CIN number"
              />
              <p className="text-xs text-gray-500 mt-1">
                Moroccan National ID Card
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Images */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DocumentUpload
              documentType="driverLicense"
              label="Driver License"
              description="JPG, PNG or WebP (Max 10MB)"
              newFile={newDocumentImages.driverLicense}
              onChange={(file) =>
                handleDocumentImageChange("driverLicense", file)
              }
            />

            <DocumentUpload
              documentType="passport"
              label="Passport"
              description="JPG, PNG or WebP (Max 10MB)"
              newFile={newDocumentImages.passport}
              onChange={(file) => handleDocumentImageChange("passport", file)}
            />

            <DocumentUpload
              documentType="cin"
              label="CIN"
              description="JPG, PNG or WebP (Max 10MB)"
              newFile={newDocumentImages.cin}
              onChange={(file) => handleDocumentImageChange("cin", file)}
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Document Update Tips:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Leave unchanged to keep existing documents</li>
                  <li>• Upload new images to replace existing ones</li>
                  <li>• Use the trash icon to remove existing documents</li>
                  <li>
                    • Supported formats: JPG, PNG, WebP (Max 10MB per file)
                  </li>
                </ul>
              </div>
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
          {isSubmitting ? "Updating Customer..." : "Update Customer"}
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;
