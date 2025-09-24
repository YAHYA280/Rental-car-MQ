// src/components/dashboard/users/components/DocumentUploadModal.tsx - Complete with download functionality
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  UserData,
  DocumentUploadData,
  SingleDocumentUpload,
} from "@/components/types";
import { userService } from "@/services/userService";

interface DocumentUploadModalProps {
  user: UserData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [uploading, setUploading] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<{
    driverLicense?: File;
    passport?: File;
    cin?: File;
  }>({});

  const [documentNumbers, setDocumentNumbers] = useState({
    driverLicenseNumber: user?.driverLicenseNumber || "",
    passportNumber: user?.passportNumber || "",
    passportIssuedAt: user?.passportIssuedAt || "",
    cinNumber: user?.cinNumber || "",
  });

  if (!user) return null;

  // Download document function
  const downloadDocument = (dataUrl: string, documentType: string) => {
    try {
      const link = document.createElement("a");
      link.href = dataUrl;

      const customerName = `${user.firstName}_${user.lastName}`;
      const timestamp = new Date().toISOString().split("T")[0];
      const extension = dataUrl.split(";")[0].split("/")[1] || "jpg";

      link.download = `${customerName}_${documentType}_${timestamp}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${documentType} document downloaded successfully`);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Error downloading document. Please try again.");
    }
  };

  // View document in new tab function
  const viewDocument = (dataUrl: string, documentType: string) => {
    try {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${documentType} - ${user.firstName} ${user.lastName}</title>
              <style>
                body { 
                  margin: 0; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh; 
                  background: #f0f0f0;
                }
                img { 
                  max-width: 100%; 
                  max-height: 100vh; 
                  object-fit: contain; 
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="${documentType}" />
            </body>
          </html>
        `);
        toast.success(`${documentType} document opened in new tab`);
      }
    } catch (error) {
      console.error("Error viewing document:", error);
      toast.error("Error viewing document. Please try again.");
    }
  };

  const handleFileChange = (
    documentType: "driverLicense" | "passport" | "cin",
    file: File | undefined
  ) => {
    setDocumentFiles((prev) => ({
      ...prev,
      [documentType]: file,
    }));
  };

  const handleNumberChange = (field: string, value: string) => {
    setDocumentNumbers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const removeFile = (documentType: "driverLicense" | "passport" | "cin") => {
    setDocumentFiles((prev) => ({
      ...prev,
      [documentType]: undefined,
    }));
  };

  const removeExistingDocument = async (
    documentType: "driverLicense" | "passport" | "cin"
  ) => {
    try {
      setUploading(true);
      await userService.removeDocument(user.id, documentType);
      toast.success(
        `${
          documentType === "driverLicense"
            ? "Driver license"
            : documentType === "passport"
            ? "Passport"
            : "CIN"
        } removed successfully`
      );
      onSuccess();
    } catch (error: any) {
      console.error("Error removing document:", error);
      toast.error(error.message || "Failed to remove document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      const numberUpdates: any = {};
      let hasNumberUpdates = false;

      if (
        documentNumbers.driverLicenseNumber !== (user.driverLicenseNumber || "")
      ) {
        numberUpdates.driverLicenseNumber = documentNumbers.driverLicenseNumber;
        hasNumberUpdates = true;
      }
      if (documentNumbers.passportNumber !== (user.passportNumber || "")) {
        numberUpdates.passportNumber = documentNumbers.passportNumber;
        hasNumberUpdates = true;
      }
      if (documentNumbers.passportIssuedAt !== (user.passportIssuedAt || "")) {
        numberUpdates.passportIssuedAt = documentNumbers.passportIssuedAt;
        hasNumberUpdates = true;
      }
      if (documentNumbers.cinNumber !== (user.cinNumber || "")) {
        numberUpdates.cinNumber = documentNumbers.cinNumber;
        hasNumberUpdates = true;
      }

      if (hasNumberUpdates) {
        await userService.updateUser(user.id, numberUpdates);
      }

      const filesToUpload = Object.values(documentFiles).filter(Boolean);
      if (filesToUpload.length > 0) {
        const uploadData: DocumentUploadData = {};

        if (documentFiles.driverLicense) {
          uploadData.driverLicenseImage = documentFiles.driverLicense;
        }
        if (documentFiles.passport) {
          uploadData.passportImage = documentFiles.passport;
        }
        if (documentFiles.cin) {
          uploadData.cinImage = documentFiles.cin;
        }

        await userService.uploadMultipleDocuments(user.id, uploadData);

        const uploadedDocs = [];
        if (documentFiles.driverLicense) uploadedDocs.push("Driver License");
        if (documentFiles.passport) uploadedDocs.push("Passport");
        if (documentFiles.cin) uploadedDocs.push("CIN");

        toast.success(
          `Documents uploaded successfully: ${uploadedDocs.join(", ")}`
        );
      } else if (hasNumberUpdates) {
        toast.success("Document information updated successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error uploading documents:", error);
      toast.error(error.message || "Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

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

  // Document section with download functionality
  const DocumentSection = ({
    documentType,
    title,
    numberValue,
    numberField,
    numberLabel,
    additionalNumberField,
    additionalNumberValue,
    additionalNumberLabel,
  }: {
    documentType: "driverLicense" | "passport" | "cin";
    title: string;
    numberValue: string;
    numberField: string;
    numberLabel: string;
    additionalNumberField?: string;
    additionalNumberValue?: string;
    additionalNumberLabel?: string;
  }) => {
    const existingUrl = getExistingDocumentUrl(documentType);
    const newFile = documentFiles[documentType];

    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {title}
        </h4>

        <div>
          <Label htmlFor={numberField}>{numberLabel}</Label>
          <Input
            id={numberField}
            value={numberValue}
            onChange={(e) => handleNumberChange(numberField, e.target.value)}
            placeholder={`Enter ${numberLabel.toLowerCase()}`}
          />
        </div>

        {additionalNumberField && (
          <div>
            <Label htmlFor={additionalNumberField}>
              {additionalNumberLabel}
            </Label>
            <Input
              id={additionalNumberField}
              value={additionalNumberValue || ""}
              onChange={(e) =>
                handleNumberChange(additionalNumberField, e.target.value)
              }
              placeholder={`Enter ${additionalNumberLabel?.toLowerCase()}`}
            />
          </div>
        )}

        {/* Existing Document Display with Download */}
        {existingUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-green-600 font-medium">
                Current {title}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeExistingDocument(documentType)}
                className="text-red-600 hover:text-red-700"
                disabled={uploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-full h-32 border rounded-lg overflow-hidden">
              <Image
                src={existingUrl}
                alt={`Current ${title}`}
                fill
                className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => viewDocument(existingUrl, title)}
              />
            </div>

            {/* Action buttons for existing documents */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => viewDocument(existingUrl, title)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Size
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadDocument(
                    existingUrl,
                    title.toLowerCase().replace(/\s+/g, "_")
                  )
                }
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>
            {existingUrl ? `Upload New ${title}` : `Upload ${title}`}
          </Label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center border-gray-300">
            {newFile ? (
              <div className="space-y-3">
                <div className="w-32 h-24 mx-auto relative">
                  <Image
                    src={URL.createObjectURL(newFile)}
                    alt={`New ${title} Preview`}
                    fill
                    className="object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(documentType)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 break-all px-2">
                  {newFile.name}
                </p>
                {existingUrl && (
                  <p className="text-sm text-blue-600">
                    This will replace the existing {title.toLowerCase()}
                  </p>
                )}
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload {title} Image
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG or WebP (Max 10MB)
                </p>
              </>
            )}
            <input
              type="file"
              id={`${documentType}Upload`}
              accept="image/*"
              onChange={(e) =>
                handleFileChange(documentType, e.target.files?.[0])
              }
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById(`${documentType}Upload`)?.click()
              }
              className="mt-2"
            >
              {newFile ? "Change Image" : "Choose Image"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const hasChanges = () => {
    const hasFileChanges = Object.values(documentFiles).some(Boolean);
    const hasNumberChanges =
      documentNumbers.driverLicenseNumber !==
        (user.driverLicenseNumber || "") ||
      documentNumbers.passportNumber !== (user.passportNumber || "") ||
      documentNumbers.passportIssuedAt !== (user.passportIssuedAt || "") ||
      documentNumbers.cinNumber !== (user.cinNumber || "");

    return hasFileChanges || hasNumberChanges;
  };

  return (
    <Dialog open={user !== null} onOpenChange={onClose}>
      <DialogContent className="w-[min(900px,95vw)] sm:max-w-[min(900px,95vw)] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manage Documents - {user.firstName} {user.lastName}
          </DialogTitle>
          <DialogDescription>
            Upload and manage customer identification documents and numbers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto px-1">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">
                  Document Management
                </h4>
                <p className="text-sm text-blue-800 mt-1">
                  Keep customer documents up to date for contract generation and
                  compliance. All documents are securely stored and encrypted.
                </p>
              </div>
            </div>
          </div>

          <DocumentSection
            documentType="driverLicense"
            title="Driver License"
            numberValue={documentNumbers.driverLicenseNumber}
            numberField="driverLicenseNumber"
            numberLabel="Driver License Number"
          />

          <DocumentSection
            documentType="passport"
            title="Passport"
            numberValue={documentNumbers.passportNumber}
            numberField="passportNumber"
            numberLabel="Passport Number"
            additionalNumberField="passportIssuedAt"
            additionalNumberValue={documentNumbers.passportIssuedAt}
            additionalNumberLabel="Issued At (City/Country)"
          />

          <DocumentSection
            documentType="cin"
            title="CIN (National ID)"
            numberValue={documentNumbers.cinNumber}
            numberField="cinNumber"
            numberLabel="CIN Number"
          />
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            className="bg-carbookers-red-600 hover:bg-carbookers-red-700"
            onClick={handleSubmit}
            disabled={uploading || !hasChanges()}
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
