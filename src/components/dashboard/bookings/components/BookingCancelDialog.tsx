// src/components/dashboard/bookings/components/BookingCancelDialog.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { BookingActionHandler } from "../types/bookingTypes";

interface BookingCancelDialogProps {
  bookingId: string | null;
  onClose: () => void;
  onConfirm: BookingActionHandler;
  isLoading?: boolean;
}

const BookingCancelDialog: React.FC<BookingCancelDialogProps> = ({
  bookingId,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const t = useTranslations("dashboard");

  const handleConfirm = () => {
    if (bookingId) {
      onConfirm(bookingId);
    }
  };

  return (
    <Dialog open={bookingId !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-lg">
            {t("bookings.cancelConfirmation.title")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t("bookings.cancelConfirmation.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> This action cannot be undone. The booking
            will be marked as cancelled and the vehicle will become available
            again.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {t("bookings.cancelConfirmation.keepBooking")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading
              ? "Cancelling..."
              : t("bookings.cancelConfirmation.cancelBooking")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingCancelDialog;
