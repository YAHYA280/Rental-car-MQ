// src/components/dashboard/users/DashboardUsersContent.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import UserStatsGrid from "./components/UserStatsGrid";
import UserFilters from "./components/UserFilters";
import UsersTable from "./components/UsersTable";
import UserDetailsModal from "./components/UserDetailsModal";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";

// Define proper types
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  driverLicenseImage?: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverLicenseImage?: File;
}

const DashboardUsersContent = () => {
  const t = useTranslations("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null);

  // Mock users data - removed blocked status
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "+212612345678",
      joinDate: "2024-01-15",
      status: "active",
      totalBookings: 12,
      totalSpent: 2450,
      lastBooking: "2024-12-10",
      driverLicenseImage: "/licenses/sarah-license.jpg",
    },
    {
      id: "2",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@email.com",
      phone: "+212623456789",
      joinDate: "2024-02-20",
      status: "active",
      totalBookings: 8,
      totalSpent: 1680,
      lastBooking: "2024-12-08",
      driverLicenseImage: "/licenses/michael-license.jpg",
    },
    {
      id: "3",
      firstName: "Emma",
      lastName: "Davis",
      email: "emma.davis@email.com",
      phone: "+212634567890",
      joinDate: "2024-03-10",
      status: "inactive",
      totalBookings: 3,
      totalSpent: 420,
      lastBooking: "2024-10-15",
      driverLicenseImage: "/licenses/emma-license.jpg",
    },
    {
      id: "4",
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed.hassan@email.com",
      phone: "+212645678901",
      joinDate: "2024-04-05",
      status: "active",
      totalBookings: 15,
      totalSpent: 3200,
      lastBooking: "2024-11-28",
      driverLicenseImage: "/licenses/ahmed-license.jpg",
    },
    {
      id: "5",
      firstName: "Fatima",
      lastName: "Al-Zahra",
      email: "fatima.alzahra@email.com",
      phone: "+212656789012",
      joinDate: "2024-05-18",
      status: "active",
      totalBookings: 6,
      totalSpent: 980,
      lastBooking: "2024-12-05",
      driverLicenseImage: "/licenses/fatima-license.jpg",
    },
  ]);

  // Filter users based on search and filter criteria
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesFilter =
      selectedFilter === "all" || user.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    setUserToDelete(null);
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
      const newUserData: UserData = {
        id: `user-${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
        totalBookings: 0,
        totalSpent: 0,
        lastBooking: "",
        driverLicenseImage: formData.driverLicenseImage
          ? "/licenses/placeholder-license.jpg"
          : undefined,
      };

      setUsers((prevUsers) => [...prevUsers, newUserData]);
      setIsAddUserDialogOpen(false);
      console.log("User added successfully:", newUserData);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async (formData: UserFormData): Promise<void> => {
    try {
      if (!userToEdit) return;

      const updatedUserData: UserData = {
        ...userToEdit,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        driverLicenseImage: formData.driverLicenseImage
          ? "/licenses/updated-license.jpg"
          : userToEdit.driverLicenseImage,
      };

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userToEdit.id ? updatedUserData : user
        )
      );

      setIsEditUserDialogOpen(false);
      setUserToEdit(null);
      console.log("User updated successfully:", updatedUserData);
    } catch (error) {
      console.error("Error updating user:", error);
    }
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <UserFilters
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>
            {t("users.customerDirectory")} ({filteredUsers.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={filteredUsers}
            onViewDetails={handleViewUserDetails}
            onEditUser={handleEditUser}
            onDeleteUser={setUserToDelete}
          />
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
