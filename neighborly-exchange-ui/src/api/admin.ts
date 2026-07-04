import apiClient from "./client";
import type { ListingResponse } from "../types/listings";

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  neighborhood?: string;
  reputationScore: number;
  totalExchanges: number;
  createdAt: string;
  isLocked: boolean;
  roles: string[];
}

export interface PlatformStats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalRequests: number;
  completedExchanges: number;
  openRequests: number;
  newUsersThisWeek: number;
  newListingsThisWeek: number;
}

export interface AdminSkill {
  id: number;
  name: string;
  category: string;
}

export const getStats = async (): Promise<PlatformStats> => {
  const response = await apiClient.get<PlatformStats>("/admin/stats");
  return response.data;
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await apiClient.get<AdminUser[]>("/admin/users");
  return response.data;
};

export const toggleLockUser = async (id: number): Promise<{ isLocked: boolean }> => {
  const response = await apiClient.patch<{ isLocked: boolean }>(`/admin/users/${id}/toggle-lock`);
  return response.data;
};

export const getAdminListings = async (): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>("/admin/listings");
  return response.data;
};

export const removeListing = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/listings/${id}`);
};

export const getAdminSkills = async (): Promise<AdminSkill[]> => {
  const response = await apiClient.get<AdminSkill[]>("/admin/skills");
  return response.data;
};

export const addSkill = async (data: { name: string; category: string }): Promise<AdminSkill> => {
  const response = await apiClient.post<AdminSkill>("/admin/skills", data);
  return response.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/skills/${id}`);
};