// src/hooks/useUsers.ts - Users Management Hook
import { useState, useEffect, useCallback } from "react";
import { User, UserFormData, UserFilters } from "@/lib/api";
import { toast } from "sonner";
import { userService } from "@/services/userService";

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: any;
  getUsers: (filters?: UserFilters) => Promise<void>;
  createUser: (userData: UserFormData) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<UserFormData>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  updateUserStatus: (
    id: string,
    status: "active" | "inactive" | "blocked"
  ) => Promise<boolean>;
  uploadDriverLicense: (id: string, file: File) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (initialFilters: UserFilters = {}): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const getUsers = useCallback(
    async (newFilters?: UserFilters) => {
      setLoading(true);
      setError(null);

      try {
        const filtersToUse = newFilters || filters;
        const response = await userService.getUsers(filtersToUse);

        setUsers(response.data || []);
        setTotal(response.total || 0);
        setPagination(response.pagination || null);

        if (newFilters) {
          setFilters(newFilters);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch users";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const createUser = useCallback(
    async (userData: UserFormData): Promise<boolean> => {
      try {
        const response = await userService.createUser(userData);

        if (response.success) {
          toast.success(response.message || "User created successfully");
          await getUsers(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to create user");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to create user";
        toast.error(errorMessage);
        console.error("Error creating user:", err);
        return false;
      }
    },
    [getUsers]
  );

  const updateUser = useCallback(
    async (id: string, userData: Partial<UserFormData>): Promise<boolean> => {
      try {
        const response = await userService.updateUser(id, userData);

        if (response.success) {
          toast.success(response.message || "User updated successfully");
          await getUsers(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to update user");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to update user";
        toast.error(errorMessage);
        console.error("Error updating user:", err);
        return false;
      }
    },
    [getUsers]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await userService.deleteUser(id);

        if (response.success) {
          toast.success(response.message || "User deleted successfully");
          await getUsers(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to delete user");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete user";
        toast.error(errorMessage);
        console.error("Error deleting user:", err);
        return false;
      }
    },
    [getUsers]
  );

  const updateUserStatus = useCallback(
    async (
      id: string,
      status: "active" | "inactive" | "blocked"
    ): Promise<boolean> => {
      try {
        const response = await userService.updateUserStatus(id, status);

        if (response.success) {
          toast.success(`User status updated to ${status}`);
          await getUsers(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to update user status");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to update user status";
        toast.error(errorMessage);
        console.error("Error updating user status:", err);
        return false;
      }
    },
    [getUsers]
  );

  const uploadDriverLicense = useCallback(
    async (id: string, file: File): Promise<boolean> => {
      try {
        const response = await userService.uploadDriverLicense(id, file);

        if (response.success) {
          toast.success("Driver license uploaded successfully");
          await getUsers(); // Refresh the list
          return true;
        } else {
          toast.error(response.message || "Failed to upload driver license");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to upload driver license";
        toast.error(errorMessage);
        console.error("Error uploading driver license:", err);
        return false;
      }
    },
    [getUsers]
  );

  const refreshUsers = useCallback(() => getUsers(), [getUsers]);

  // Initial load
  useEffect(() => {
    getUsers();
  }, []);

  return {
    users,
    loading,
    error,
    total,
    pagination,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    uploadDriverLicense,
    refreshUsers,
  };
};
