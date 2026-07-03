export interface Skill {
  id: number;
  name: string;
  category: string;
}

export interface CreateListingRequest {
  skillId: number;
  title: string;
  description: string;
  availability?: string;
  lookingFor?: string;
}

export interface ListingResponse {
  id: number;
  title: string;
  description: string;
  availability?: string;
  lookingFor?: string;
  isActive: boolean;
  createdAt: string;
  skillName: string;
  skillCategory: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userReputationScore: number;
}