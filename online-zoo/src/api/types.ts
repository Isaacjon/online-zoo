export interface Pet {
  id: number;
  name: string;
  commonName: string;
  description: string;
}

export interface PetDetail {
  id: number;
  commonName: string;
  scientificName: string;
  type: string;
  size: string;
  diet: string;
  habitat: string;
  range: string;
  latitude: string;
  longitude: string;
  description: string;
  detailedDescription: string;
}

export interface PetsResponse {
  data: Pet[];
}

export interface PetDetailResponse {
  data: PetDetail;
}

export interface Feedback {
  id: number;
  city: string;
  month: string;
  year: string;
  text: string;
  name: string;
}

export interface FeedbackResponse {
  data: Feedback[];
}

export interface Camera {
  id: number;
  petId: number;
  text: string;
}

export interface CamerasResponse {
  data: Camera[];
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    user: Omit<UserProfile, "id"> & { id?: number };
  };
}

export interface RegisterRequest {
  login: string;
  password: string;
  name: string;
  email: string;
}

export interface UserProfile {
  id: number;
  login: string;
  name: string;
  email: string;
}

export interface ProfileResponse {
  data: UserProfile;
}

export interface DonationRequest {
  name: string;
  email: string;
  amount: number;
  petId: number;
}

export interface DonationResponse {
  message?: string;
}

export interface ApiError {
  message?: string;
  error?: string;
}
