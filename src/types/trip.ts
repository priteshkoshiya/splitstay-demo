export type GenderPreference = 'male' | 'female' | 'anyone';

export interface UserProfile {
  id: string;
  name: string;
  photo: string;
  languages: string[];
}

export interface TripDraftForm {
  tripName: string;
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  isFlexible: boolean;
  languagesSpoken: string[];
  openToMatch: GenderPreference;
  tripVibe: string;
  accommodationType: string;
  accommodationLink: string;
  personalNote: string;
  userProfile: UserProfile;
  /** Optional: shown on cards; user-entered or auto */
  price?: string;
}

export interface Trip extends TripDraftForm {
  id: number;
  createdAt: string; // ISO datetime
  status: 'active' | 'archived';
}

export interface CityOption {
  id: string;
  name: string;
  region?: string;
  country?: string;
}


