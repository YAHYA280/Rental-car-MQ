// STEP 2B: Replace src/components/dashboard/users/DashboardUsersContent.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Import components
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import UserStatsGrid from "./components/UserStatsGrid";
import UserFilters from "./components/UserFilters";
import UsersTable from "./components/UsersTable";
import UserDetailsModal from "./components/UserDetailsModal";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";

// Import service
import { userService } from "@/services/userService";

// FIXED: Updated UserData interface to match backend exactly
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  driverLicenseNumber?: string;
  driverLicenseImage?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;
  status: "active" | "inactive" | "blocked";
  totalBookings: number;
  totalSpent: number;
  averageRating?: number;
  lastBookingDate?: string;
  source: "website" | "admin" | "referral" | "social" | "other";
  referralCode: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  driverLicenseNumber?: string;
  driverLicenseImage?: File;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: Record<string, any>;
  status?: "active" | "inactive" | "blocked";
  notes?: string;
}

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  tier?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

const DashboardUsersContent = () => {
  const t = useTranslations("dashboard");

  // State management
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [total, setTotal] = useState(0);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // FIXED: Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const apiFilters: UserFilters = {
        page: 1,
        limit: 50,
      };

      // Add search term to API call
      if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
        apiFilters.search = debouncedSearchTerm.trim();
        console.log("Searching for:", debouncedSearchTerm.trim());
      }

      // Add filter to API call
      if (selectedFilter !== "all") {
        apiFilters.status = selectedFilter;
      }

      console.log("API Filters being sent:", apiFilters);

      const response = await userService.getUsers(apiFilters);
      console.log("API Response:", response);

      if (response.success && response.data) {
        setUsers(response.data);
        setTotal(response.total || response.data.length);
        setPagination(response.pagination);
        console.log(`Loaded ${response.data.length} users`);
      } else {
        console.error("API returned unsuccessful response:", response);
        toast.error("Failed to fetch users");
        setUsers([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "Failed to fetch users");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedFilter]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await userService.deleteUser(userId);

      if (response.success) {
        toast.success("User deleted successfully");
        await fetchUsers();
        setUserToDelete(null);
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleViewUserDetails = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleEditUser = (user: UserData) => {
    setUserToEdit(user);
    setIsEditUserDialogOpen(true);
  };

  const handleAddUser = async (formData: UserFormData): Promise<void> => {
    try {
      console.log("Submitting user data:", formData);

      const response = await userService.createUser(formData);

      if (response.success) {
        toast.success("User created successfully");
        setIsAddUserDialogOpen(false);
        await fetchUsers();
      } else {
        throw new Error(response.message || "Failed to create user");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
      throw error;
    }
  };

  const handleUpdateUser = async (formData: UserFormData): Promise<void> => {
    try {
      if (!userToEdit) return;

      console.log("Updating user data:", formData);

      const response = await userService.updateUser(userToEdit.id, formData);

      if (response.success) {
        toast.success("User updated successfully");
        setIsEditUserDialogOpen(false);
        setUserToEdit(null);
        await fetchUsers();
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
      throw error;
    }
  };

  const handleSearchChange = (value: string) => {
    console.log("Search input changed to:", value);
    setSearchTerm(value);
  };

  const handleFilterChange = (filter: string) => {
    console.log("Filter changed to:", filter);
    setSelectedFilter(filter);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("users.title")}
          </h1>
          <p className="text-gray-600">{t("users.subtitle")}</p>
        </div>
        <Dialog
          open={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
        >
          <Button
            className="bg-carbookers-red-600 hover:bg-carbookers-red-700 flex items-center gap-2"
            onClick={() => setIsAddUserDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t("users.addNew")}
          </Button>
          <DialogContent className="w-[min(800px,95vw)] sm:max-w-[min(800px,95vw)] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("users.form.title")}</DialogTitle>
              <DialogDescription>
                {t("users.form.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-1">
              <AddUserForm
                onSubmit={handleAddUser}
                onClose={() => setIsAddUserDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <UserStatsGrid users={users} />

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("common.searchUsers")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              {loading && debouncedSearchTerm && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            <UserFilters
              selectedFilter={selectedFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
          {/* Debug info */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-xs text-gray-500">
              Debug: Search="{debouncedSearchTerm}" Filter="{selectedFilter}"
              Total={total}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("users.customerDirectory")} ({total} users)
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbookers-red-600" />
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchTerm || selectedFilter !== "all"
                  ? "No users found matching your criteria"
                  : "No users found"}
              </p>
              {(searchTerm || selectedFilter !== "all") && (
                <p className="text-sm text-gray-500 mt-2">
                  Try clearing your search or changing filters
                </p>
              )}
            </div>
          ) : (
            <UsersTable
              users={users}
              onViewDetails={handleViewUserDetails}
              onEditUser={handleEditUser}
              onDeleteUser={setUserToDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onEdit={handleEditUser}
      />

      {/* Edit User Modal */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent className="w-[min(800px,95vw)] sm:max-w-[min(800px,95vw)] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user information and details
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-1">
            {userToEdit && (
              <EditUserForm
                user={userToEdit}
                onSubmit={handleUpdateUser}
                onClose={() => {
                  setIsEditUserDialogOpen(false);
                  setUserToEdit(null);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={userToDelete !== null}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => userToDelete && handleDeleteUser(userToDelete)}
      />
    </div>
  );
};

export default DashboardUsersContent;
