// src/components/dashboard/bookings/forms/sections/NotesSection.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, X } from "lucide-react";

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onNotesChange,
}) => {
  const t = useTranslations("dashboard");
  const [showQuickNotes, setShowQuickNotes] = useState(false);

  // Debug logging
  console.log("NotesSection:", { notes, showQuickNotes });

  // Predefined quick notes
  const quickNotes = [
    "VIP customer - ensure premium service",
    "First-time customer - verify documentation",
    "Repeat customer - apply loyalty discount",
    "Special occasion - birthday/anniversary",
    "Business customer - provide invoice",
    "Long-term rental - weekly inspection",
    "Airport pickup - confirm flight details",
    "Hotel delivery required",
    "Customer prefers WhatsApp communication",
    "Vehicle requires fuel top-up",
    "Check vehicle condition thoroughly",
    "Customer has mobility requirements",
  ];

  // Add quick note to existing notes
  const addQuickNote = (quickNote: string) => {
    const currentNotes = notes.trim();
    const newNotes = currentNotes
      ? `${currentNotes}\n• ${quickNote}`
      : `• ${quickNote}`;
    onNotesChange(newNotes);
  };

  // Character count
  const characterCount = notes.length;
  const maxCharacters = 500;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Additional Notes
        </h3>

        <div className="space-y-4">
          {/* Main Notes Textarea */}
          <div>
            <Label htmlFor="notes">Internal Notes (Optional)</Label>
            <p className="text-sm text-gray-500 mb-2">
              Add any special instructions or notes for this booking
            </p>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Enter any special instructions, customer preferences, or important details for this booking..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carbookers-red-500 focus:border-transparent resize-none transition-colors"
              rows={4}
              maxLength={maxCharacters}
            />

            {/* Character Counter */}
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">
                {characterCount}/{maxCharacters} characters
              </div>
              {characterCount > maxCharacters * 0.8 && (
                <div className="text-xs text-amber-600">
                  {maxCharacters - characterCount} characters remaining
                </div>
              )}
            </div>
          </div>

          {/* Quick Notes Toggle */}
          <div className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowQuickNotes(!showQuickNotes)}
              className="flex items-center gap-2"
            >
              {showQuickNotes ? (
                <>
                  <X className="h-4 w-4" />
                  Hide Quick Notes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Quick Notes
                </>
              )}
            </Button>

            {/* Quick Notes Grid */}
            {showQuickNotes && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-600">
                  Click on any note below to add it to your booking notes:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {quickNotes.map((quickNote, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addQuickNote(quickNote)}
                      className="justify-start text-left h-auto py-2 px-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 border border-gray-200 hover:border-blue-300"
                    >
                      <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="flex-1">{quickNote}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes Preview */}
          {notes.trim() && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes Preview
              </h4>
              <div className="text-sm text-blue-800 whitespace-pre-wrap max-h-24 overflow-y-auto">
                {notes}
              </div>
              <div className="mt-2 pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  These notes will be visible to all staff members handling this
                  booking.
                </p>
              </div>
            </div>
          )}

          {/* Notes Guidelines */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">
              Notes Guidelines:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start gap-1">
                <span className="text-green-600">•</span>
                <span>Include customer preferences and special requests</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-green-600">•</span>
                <span>Note any vehicle-specific requirements</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-green-600">•</span>
                <span>Mention delivery/pickup preferences</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-green-600">•</span>
                <span>Add contact preferences (WhatsApp, email, phone)</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-amber-600">⚠</span>
                <span>Keep notes professional and relevant</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
