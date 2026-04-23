"use client";

import { apiRequest } from "@/services/api";

type BackendRecruiter = {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName?: string;
  companyWebsite?: string;
  position?: string;
  phone?: string;
  bio?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
  isEmailVerified?: boolean;
};

export interface RecruiterUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  companyName?: string;
  companyWebsite?: string;
  position?: string;
  phone?: string;
  bio?: string;
  timezone?: string;
  notificationsEnabled: boolean;
  isEmailVerified: boolean;
}

export interface AuthSession {
  user: RecruiterUser;
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  recruiter: BackendRecruiter;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  recruiter: BackendRecruiter;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

interface RefreshResponse extends MessageResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  email: string;
  code: string;
}

const mapRecruiter = (recruiter: BackendRecruiter): RecruiterUser => {
  const id = recruiter.id ?? recruiter._id ?? recruiter.email;

  return {
    id,
    firstName: recruiter.firstName,
    lastName: recruiter.lastName,
    fullName: `${recruiter.firstName} ${recruiter.lastName}`.trim(),
    email: recruiter.email,
    role: recruiter.role,
    companyName: recruiter.companyName,
    companyWebsite: recruiter.companyWebsite,
    position: recruiter.position,
    phone: recruiter.phone,
    bio: recruiter.bio,
    timezone: recruiter.timezone,
    notificationsEnabled: recruiter.notificationsEnabled ?? true,
    isEmailVerified: recruiter.isEmailVerified ?? false,
  };
};

export async function loginRecruiter(email: string, password: string): Promise<{
  message: string;
  session: AuthSession;
}> {
  const response = await apiRequest<LoginResponse>("/recruiters/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return {
    message: response.message,
    session: {
      user: mapRecruiter(response.recruiter),
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  };
}

export async function registerRecruiter(input: RegisterInput): Promise<string> {
  const response = await apiRequest<RegisterResponse>("/recruiters", {
    method: "POST",
    body: input,
  });

  return response.message;
}

export async function verifyRecruiterEmail(input: VerifyEmailInput): Promise<string> {
  const response = await apiRequest<MessageResponse>("/recruiters/auth/verify-email", {
    method: "POST",
    body: input,
  });

  return response.message;
}

export async function resendRecruiterVerification(email: string): Promise<string> {
  const response = await apiRequest<MessageResponse>("/recruiters/auth/resend-verification", {
    method: "POST",
    body: { email },
  });

  return response.message;
}

export async function logoutRecruiter(refreshToken: string): Promise<void> {
  await apiRequest<MessageResponse>("/recruiters/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function refreshRecruiterSession(
  refreshToken: string,
): Promise<Pick<AuthSession, "accessToken" | "refreshToken">> {
  const response = await apiRequest<RefreshResponse>("/recruiters/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}

export async function updateRecruiter(
  accessToken: string,
  id: string,
  data: Partial<RecruiterUser>
): Promise<RecruiterUser> {
  const response = await apiRequest<{ success: boolean; message: string; recruiter: BackendRecruiter }>(
    `/recruiters/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    }
  );

  return mapRecruiter(response.recruiter);
}
