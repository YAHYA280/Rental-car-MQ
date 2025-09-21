// src/components/dashboard/users/AddUserForm.tsx - UPDATED: Complete support for all new fields
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
import {
  Upload,
  X,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  FileText,
  Users,
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
    // NEW: Enhanced personal information
    dateOfBirth: "",
    address: "",
    city: "",
    postalCode: "",
    country: "MA", // Default to Morocco
    // NEW: Document information
    driverLicenseNumber: "",
    passportNumber: "",
    passportIssuedAt: "",
    cinNumber: "",
    // Additional information
    notes: "",
  });

  // NEW: Document image states
  const [documentImages, setDocumentImages] = useState<{
    driverLicense?: File;
    passport?: File;
    cin?: File;
  }>({});

  // NEW: Emergency contact state
  const [emergencyContact, setEmergencyContact] = useState<{
    name: string;
    phone: string;
    relationship: string;
  }>({
    name: "",
    phone: "",
    relationship: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    // Handle phone number formatting
    if (field === "phone" || field === "emergencyPhone") {
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

    // Handle emergency contact fields
    if (field.startsWith("emergency")) {
      const contactField = field.replace("emergency", "").toLowerCase();
      if (contactField === "phone") {
        setEmergencyContact((prev) => ({ ...prev, phone: value }));
      } else {
        setEmergencyContact((prev) => ({ ...prev, [contactField]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // NEW: Handle document image uploads
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

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, "");
    const phoneRegex = /^0[67]\d{8}$/;
    return phoneRegex.test(cleaned);
  };

  // NEW: Validate date of birth
  const validateDateOfBirth = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return true; // Optional field
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 100;
  };

  // NEW: Comprehensive form validation
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

    // NEW: Date of birth validation
    if (formData.dateOfBirth && !validateDateOfBirth(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Customer must be between 18 and 100 years old";
    }

    // NEW: Emergency contact validation (if any field is filled, all should be filled)
    if (
      emergencyContact.name ||
      emergencyContact.phone ||
      emergencyContact.relationship
    ) {
      if (!emergencyContact.name.trim()) {
        newErrors.emergencyName = "Emergency contact name is required";
      }
      if (!emergencyContact.phone.trim()) {
        newErrors.emergencyPhone = "Emergency contact phone is required";
      } else if (!validatePhoneNumber(emergencyContact.phone)) {
        newErrors.emergencyPhone = "Please enter a valid phone number";
      }
      if (!emergencyContact.relationship.trim()) {
        newErrors.emergencyRelationship = "Relationship is required";
      }
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
      // Prepare the complete user data
      const userData: UserFormData = {
        ...formData,
        phone: formData.phone.replace(/\s/g, ""), // Clean phone number
        email:
          formData.email && formData.email.trim() !== ""
            ? formData.email.trim()
            : undefined,
        // NEW: Add document images
        driverLicenseImage: documentImages.driverLicense,
        passportImage: documentImages.passport,
        cinImage: documentImages.cin,
        // NEW: Add emergency contact if provided
        emergencyContact:
          emergencyContact.name ||
          emergencyContact.phone ||
          emergencyContact.relationship
            ? emergencyContact
            : undefined,
      };

      console.log("Submitting enhanced user data:", userData);
      await onSubmit(userData);

      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        city: "",
        postalCode: "",
        country: "MA",
        driverLicenseNumber: "",
        passportNumber: "",
        passportIssuedAt: "",
        cinNumber: "",
        notes: "",
      });
      setDocumentImages({});
      setEmergencyContact({ name: "", phone: "", relationship: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: Document upload component
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

            {/* NEW: Date of Birth */}
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

            {/* NEW: Country */}
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

      {/* NEW: Address Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
                Complete address including street, building number, etc.
              </p>
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                placeholder="Enter postal code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW: Document Information */}
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

      {/* NEW: Document Images */}
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

      {/* NEW: Emergency Contact */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Emergency Contact (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                value={emergencyContact.name}
                onChange={(e) =>
                  handleInputChange("emergencyName", e.target.value)
                }
                placeholder="Full name"
                className={errors.emergencyName ? "border-red-500" : ""}
              />
              {errors.emergencyName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emergencyName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                value={emergencyContact.phone}
                onChange={(e) =>
                  handleInputChange("emergencyPhone", e.target.value)
                }
                placeholder="06 XX XX XX XX"
                className={errors.emergencyPhone ? "border-red-500" : ""}
              />
              {errors.emergencyPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emergencyPhone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="emergencyRelationship">Relationship</Label>
              <Select
                value={emergencyContact.relationship}
                onValueChange={(value) =>
                  handleInputChange("emergencyRelationship", value)
                }
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.emergencyRelationship ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.emergencyRelationship && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emergencyRelationship}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW: Additional Notes */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information about the customer..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Internal notes for staff reference only
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
