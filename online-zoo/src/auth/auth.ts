import {
  getProfile as fetchProfile,
  login as apiLogin,
  register as apiRegister,
} from "../api/api";
import type { UserProfile } from "../api/types";
import type { RegisterRequest } from "../api/types";

const AUTH_TOKEN_KEY = "online-zoo-auth-token";
const AUTH_PROFILE_KEY = "online-zoo-auth-profile";

let cachedProfile: UserProfile | null = null;

export function getToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    cachedProfile = null;
  } catch {
    return;
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_PROFILE_KEY);
    cachedProfile = null;
  } catch {
    return;
  }
}

export function getProfile(): UserProfile | null {
  if (cachedProfile) return cachedProfile;
  try {
    const stored = localStorage.getItem(AUTH_PROFILE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as UserProfile;
    cachedProfile = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function setProfile(profile: UserProfile | null): void {
  cachedProfile = profile;
  try {
    if (profile) {
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(AUTH_PROFILE_KEY);
    }
  } catch {
    return;
  }
}

export function isLoggedIn(): boolean {
  return getToken() !== null && getProfile() !== null;
}

export async function login(
  credentials: { login: string; password: string }
): Promise<void> {
  const response = await apiLogin(credentials);
  const { access_token, user } = response.data;
  setToken(access_token);
  setProfile({ id: 0, ...user });
}

export async function register(data: RegisterRequest): Promise<void> {
  const response = await apiRegister(data);
  const { access_token, user } = response.data;
  setToken(access_token);
  setProfile({ id: 0, ...user });
}

export async function initAuth(): Promise<void> {
  const token = getToken();
  if (!token) {
    setProfile(null);
    return;
  }

  try {
    const response = await fetchProfile(token);
    setProfile(response.data);
  } catch {
    clearToken();
  }
}
