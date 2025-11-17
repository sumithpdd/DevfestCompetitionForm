export interface Submission {
  id?: string;
  fullName: string;
  email: string;
  githubUrl: string;
  appPurpose: string;
  screenshots: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  interests?: string[];
  userId: string;
  userEmail: string;
  createdAt: Date;
  updatedAt?: Date;
  status?: "draft" | "submitted";
  place?: "first" | "second" | "third" | null;
}

