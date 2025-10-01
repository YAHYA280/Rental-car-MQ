// src/hooks/useUsers.ts - Users Management Hook
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { UserData, UserFormData, UserFiltersType } from "@/components/types";

interface UseUsersReturn {
  users: UserData[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    current: number;
    totalPages: number;
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  } | null;
  getUsers: (filters?: UserFiltersType) => Promise<void>;
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

export const useUsers = (
  initialFilters: UserFiltersType = {}
): UseUsersReturn => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] =
    useState<UseUsersReturn["pagination"]>(null);
  const [filters, setFilters] = useState<UserFiltersType>(initialFilters);

  const getUsers = useCallback(
    async (newFilters?: UserFiltersType) => {
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create user";
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user";
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete user";
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user status";
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to upload driver license";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
