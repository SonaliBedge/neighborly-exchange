import apiClient from "./client";
import type { Skill, CreateListingRequest, ListingResponse } from "../types/listings";

export const getSkills = async (): Promise<Skill[]> => {
  const response = await apiClient.get<Skill[]>("/skills");
  return response.data;
};

export const getListings = async (): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>("/listings");
  return response.data;
};

export const createListing = async (data: CreateListingRequest): Promise<ListingResponse> => {
  const response = await apiClient.post<ListingResponse>("/listings", data);
  return response.data;
};