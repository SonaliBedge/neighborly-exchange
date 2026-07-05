import apiClient from "./client";
import type { UserProfile, UpdateProfileRequest } from "../types/profile";

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>("/profile/me");
  return response.data;
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await apiClient.put<UserProfile>("/profile/me", data);
  return response.data;
};