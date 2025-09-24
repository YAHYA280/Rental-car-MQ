// src/components/dashboard/users/AddUserForm.tsx - UPDATED: Replaced phone input with PhoneInput component
"use client";

import React, { useState } from "react";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Upload,
  X,
  Mail,
  User,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
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
    // Enhanced personal information
    dateOfBirth: "",
    address: "",
    country: "MA", // Default to Morocco
    // Document information
    driverLicenseNumber: "",
    passportNumber: "",
    passportIssuedAt: "",
    cinNumber: "",
  });

  // Document image states
  const [documentImages, setDocumentImages] = useState<{
    driverLicense?: File;
    passport?: File;
    cin?: File;
  }>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // NEW: Handle phone number change from PhoneInput
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }));

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  // Handle document image uploads
  const handleDocumentImageChange = (
    documentType: "driverLicense" | "passport" | "cin",
    file: File | undefined
  ) => {
    setDocumentImages((prev) => ({
      ...prev,
      [documentType]: file,
    }));

    // Clear any related errors
    const errorKey = `${documentType}Image`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email || email.trim() === "") return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // UPDATED: Simplified phone validation using PhoneInput's built-in validation
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone || phone.trim() === "") return false; // Phone is required

    // PhoneInput returns in E.164 format (+212612345678)
    // Check if it's a valid format and reasonable length
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 16;
  };

  // Validate date of birth
  const validateDateOfBirth = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return true; // Optional field
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 100;
  };

  // UPDATED: Form validation with improved phone validation
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
      newErrors.phone = "Please enter a valid phone number with country code";
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
        // Phone is already in E.164 format from PhoneInput
        email:
          formData.email && formData.email.trim() !== ""
            ? formData.email.trim()
            : undefined,
        // Add document images
        driverLicenseImage: documentImages.driverLicense,
        passportImage: documentImages.passport,
        cinImage: documentImages.cin,
      };

      console.log("Submitting simplified user data:", userData);
      await onSubmit(userData);

      // Reset form on success
      setFormData({
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
      setDocumentImages({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Document upload component
  const DocumentUpload = ({
    documentType,
    label,
    description,
    currentFile,
    onChange,
  }: {
    documentType: string;
    label: string;
    description: string;
    currentFile?: File;
    onChange: (file: File | undefined) => void;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={`${documentType}Image`}>{label} (Optional)</Label>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="border-2 border-dashed rounded-lg p-4 text-center border-gray-300">
        {currentFile ? (
          <div className="space-y-3">
            <div className="w-32 h-24 mx-auto relative">
              <Image
                src={URL.createObjectURL(currentFile)}
                alt={`${label} Preview`}
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
              {currentFile.name}
            </p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload {label}</p>
            <p className="text-xs text-gray-500">JPG, PNG or WebP (Max 10MB)</p>
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
          {currentFile ? "Change Image" : "Choose Image"}
        </Button>
      </div>
    </div>
  );

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
            </div>

            {/* UPDATED: Phone input using PhoneInput component */}
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <PhoneInput
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  defaultCountry="MA"
                  placeholder="Enter phone number"
                  className={errors.phone ? "border-red-500" : ""}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
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
              description="Upload driver license image"
              currentFile={documentImages.driverLicense}
              onChange={(file) =>
                handleDocumentImageChange("driverLicense", file)
              }
            />

            <DocumentUpload
              documentType="passport"
              label="Passport"
              description="Upload passport image"
              currentFile={documentImages.passport}
              onChange={(file) => handleDocumentImageChange("passport", file)}
            />

            <DocumentUpload
              documentType="cin"
              label="CIN"
              description="Upload CIN image"
              currentFile={documentImages.cin}
              onChange={(file) => handleDocumentImageChange("cin", file)}
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Document Upload Tips:</p>
                <ul className="mt-1 space-y-1">
                  <li>
                    • All document images are optional during customer creation
                  </li>
                  <li>
                    • You can upload documents later from the customer details
                    page
                  </li>
                  <li>
                    • Supported formats: JPG, PNG, WebP (Max 10MB per file)
                  </li>
                  <li>• Ensure documents are clearly visible and readable</li>
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
          {isSubmitting ? "Creating Customer..." : "Create Customer"}
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
