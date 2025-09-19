"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContractDownloadProps {
  bookingId: string;
  bookingNumber: string;
  status: string;
}

const ContractDownload: React.FC<ContractDownloadProps> = ({
  bookingId,
  bookingNumber,
  status,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadContract = async () => {
    if (status !== "confirmed" && status !== "active") {
      toast.error("Contract unavailable", {
        description: "Contract can only be generated for confirmed bookings",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/bookings/${bookingId}/contract`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate contract");
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Contract_${bookingNumber}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      toast.success("Contract downloaded successfully! 📄", {
        description: `Contract for booking ${bookingNumber} has been downloaded`,
      });
    } catch (error) {
      console.error("Contract download error:", error);
      toast.error("Download failed", {
        description: "Failed to generate or download the contract",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Only show download button for confirmed/active bookings
  if (status !== "confirmed" && status !== "active") {
    return (
      <Button variant="outline" size="sm" disabled>
        <FileText className="h-4 w-4 mr-2" />
        Contract N/A
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={downloadContract}
      disabled={isGenerating}
      className="hover:bg-blue-50 hover:border-blue-200"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {isGenerating ? "Generating..." : "Download Contract"}
    </Button>
  );
};

export default ContractDownload;
