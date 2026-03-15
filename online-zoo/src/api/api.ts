import { apiFetch } from "./client";
import type {
  PetsResponse,
  PetDetailResponse,
  FeedbackResponse,
  CamerasResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ProfileResponse,
  DonationRequest,
  DonationResponse,
} from "./types";

export async function getPets(): Promise<PetsResponse> {
  return apiFetch<PetsResponse>("/pets");
}

export async function getPetById(id: number): Promise<PetDetailResponse> {
  return apiFetch<PetDetailResponse>(`/pets/${id}`);
}

export async function getFeedback(): Promise<FeedbackResponse> {
  return apiFetch<FeedbackResponse>("/feedback");
}

export async function getCameras(): Promise<CamerasResponse> {
  return apiFetch<CamerasResponse>("/cameras");
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function register(data: RegisterRequest): Promise<void> {
  await apiFetch<unknown>("/auth/register", {
    method: "POST",
    body: data,
  });
}

export async function getProfile(token: string): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/auth/profile", {
    method: "GET",
    token,
  });
}

export async function submitDonation(
  donation: DonationRequest
): Promise<DonationResponse> {
  return apiFetch<DonationResponse>("/donations", {
    method: "POST",
    body: donation,
  });
}
