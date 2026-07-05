export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  neighborhood?: string;
  profileImageUrl?: string;
  reputationScore: number;
  totalExchanges: number;
  createdAt: string;
  skillsOffered: string[];
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  neighborhood?: string;
}