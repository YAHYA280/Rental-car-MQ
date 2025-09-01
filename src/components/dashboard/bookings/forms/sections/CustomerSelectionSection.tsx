// src/components/dashboard/bookings/forms/sections/CustomerSelectionSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone } from "lucide-react";
import { UserData } from "../../types/bookingTypes";

interface CustomerSelectionSectionProps {
  users: UserData[];
  selectedCustomerId: string;
  selectedCustomer: UserData | undefined;
  onCustomerChange: (customerId: string) => void;
  error?: string;
}

const CustomerSelectionSection: React.FC<CustomerSelectionSectionProps> = ({
  users,
  selectedCustomerId,
  selectedCustomer,
  onCustomerChange,
  error,
}) => {
  const t = useTranslations("dashboard");

  // Debug logging
  console.log("CustomerSelectionSection:", {
    usersCount: users.length,
    selectedCustomerId,
    selectedCustomer,
    error,
  });

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Information
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="customerId">Select Customer *</Label>
            <Select value={selectedCustomerId} onValueChange={onCustomerChange}>
              <SelectTrigger className={error ? "border-red-500" : ""}>
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 rounded-full bg-carbookers-red-600 flex items-center justify-center text-white font-semibold text-xs">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Show selected customer details */}
          {selectedCustomer && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Selected Customer
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedCustomer.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      selectedCustomer.status === "active"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {selectedCustomer.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSelectionSection;
