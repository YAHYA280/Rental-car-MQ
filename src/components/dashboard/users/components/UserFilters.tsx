// src/components/dashboard/users/components/UserFilters.tsx - UPDATED: Enhanced filters with document status
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
} from "lucide-react";

interface UserFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  // NEW: Additional filter props
  documentFilter?: string;
  onDocumentFilterChange?: (filter: string) => void;
  showAdvanced?: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  documentFilter = "all",
  onDocumentFilterChange,
  showAdvanced = false,
}) => {
  const t = useTranslations("dashboard");

  // Status filters
  const statusFilters = [
    {
      value: "all",
      label: "All Customers",
      icon: Users,
      description: "Show all customers regardless of status",
    },
    {
      value: "active",
      label: "Active",
      icon: CheckCircle,
      description: "Customers with active status",
    },
    {
      value: "inactive",
      label: "Inactive",
      icon: XCircle,
      description: "Customers marked as inactive",
    },
  ];

  // NEW: Document completion filters
  const documentFilters = [
    {
      value: "all",
      label: "All Documents",
      icon: FileText,
      description: "Show all customers regardless of document status",
    },
    {
      value: "complete",
      label: "Complete",
      icon: CheckCircle,
      description: "Customers with all required documents",
    },
    {
      value: "incomplete",
      label: "Incomplete",
      icon: AlertCircle,
      description: "Customers missing some documents",
    },
    {
      value: "no-documents",
      label: "No Documents",
      icon: XCircle,
      description: "Customers with no uploaded documents",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 flex items-center">
          Status:
        </span>
        {statusFilters.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("Status filter button clicked:", filter.value);
                onFilterChange(filter.value);
              }}
              className={`flex items-center gap-2 ${
                selectedFilter === filter.value
                  ? "bg-carbookers-red-600 hover:bg-carbookers-red-700"
                  : ""
              }`}
              title={filter.description}
            >
              <IconComponent className="h-4 w-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* NEW: Document Filters */}
      {onDocumentFilterChange && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            Documents:
          </span>
          {documentFilters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <Button
                key={filter.value}
                variant={
                  documentFilter === filter.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  console.log("Document filter button clicked:", filter.value);
                  onDocumentFilterChange(filter.value);
                }}
                className={`flex items-center gap-2 ${
                  documentFilter === filter.value
                    ? "bg-carbookers-red-600 hover:bg-carbookers-red-700"
                    : ""
                }`}
                title={filter.description}
              >
                <IconComponent className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* NEW: Advanced Filters (Future Enhancement) */}
      {showAdvanced && (
        <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Advanced:</span>

          {/* Registration Source Filter */}
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="admin">Staff Created</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Join Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="MA">Morocco</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="ES">Spain</SelectItem>
              <SelectItem value="other">Other Countries</SelectItem>
            </SelectContent>
          </Select>

          {/* Customer Tier Filter */}
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="platinum">Platinum (€5000+)</SelectItem>
              <SelectItem value="gold">Gold (€2000-€4999)</SelectItem>
              <SelectItem value="silver">Silver (€500-€1999)</SelectItem>
              <SelectItem value="bronze">Bronze (€0-€499)</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onFilterChange("all");
              onDocumentFilterChange?.("all");
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Summary */}
      {(selectedFilter !== "all" || documentFilter !== "all") && (
        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          <span className="font-medium">Active Filters:</span>
          {selectedFilter !== "all" && (
            <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
              Status:{" "}
              {statusFilters.find((f) => f.value === selectedFilter)?.label}
            </span>
          )}
          {documentFilter !== "all" && (
            <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
              Documents:{" "}
              {documentFilters.find((f) => f.value === documentFilter)?.label}
            </span>
          )}
          <button
            onClick={() => {
              onFilterChange("all");
              onDocumentFilterChange?.("all");
            }}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFilters;
