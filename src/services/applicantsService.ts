"use client";

import { apiRequest } from "@/services/api";

type BackendApplicant = {
  _id?: string;
  id?: string;
  jobId?: string;
  recruiterId?: string;
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeText?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  structuredProfile?: {
    skills?: string[];
    experience?: string[];
    education?: string[];
    certifications?: string[];
    projects?: string[];
  };
  parsedData?: {
    skills?: string[];
    experienceYears?: number;
    education?: string[];
    certifications?: string[];
    projects?: string[];
    jobTitles?: string[];
    companies?: string[];
  };
  normalized?: {
    skillScore?: number;
    experienceScore?: number;
    educationScore?: number;
  };
  status: "applied" | "screened" | "shortlisted" | "rejected";
  source: string;
  isDuplicate?: boolean;
  isParsed?: boolean;
  parsedAt?: string;
  recruiterNotes?: string;
  tags?: string[];
  aiScore?: number;
  aiSummary?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApplicantsListResponse = {
  applicants: BackendApplicant[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};

type ApplicantResponse = {
  applicant: BackendApplicant;
};

type ApplicantMutationResponse = {
  message: string;
  applicant?: BackendApplicant;
};

export interface ApplicantRecord {
  id: string;
  jobId?: string;
  name: string;
  role: string;
  score: number;
  scoreLabel: "Elite" | "High" | "Good";
  tags: string[];
  workflowStatus: "applied" | "screened" | "shortlisted" | "rejected";
  isShortlisted: boolean;
  email?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeText?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  education: string[];
  experience: string[];
  certifications: string[];
  projects: string[];
  skills: string[];
  recruiterNotes?: string;
  source: string;
  aiSummary?: string;
  isDuplicate: boolean;
  isParsed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const withAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

const normalizeScore = (applicant: BackendApplicant): number => {
  if (typeof applicant.aiScore === "number") return Math.round(applicant.aiScore);

  const normalizedScores = applicant.normalized
    ? [
      applicant.normalized.skillScore,
      applicant.normalized.experienceScore,
      applicant.normalized.educationScore,
    ].filter((value): value is number => typeof value === "number")
    : [];

  if (normalizedScores.length > 0) {
    const average =
      normalizedScores.reduce((sum, value) => sum + value, 0) / normalizedScores.length;
    return Math.round(average);
  }

  return applicant.status === "shortlisted" ? 85 : applicant.status === "screened" ? 72 : 60;
};

const scoreLabelFromValue = (score: number): "Elite" | "High" | "Good" => {
  if (score >= 90) return "Elite";
  if (score >= 75) return "High";
  return "Good";
};

const deriveRole = (applicant: BackendApplicant): string => {
  const jobTitle = applicant.parsedData?.jobTitles?.[0];
  if (jobTitle) return jobTitle;

  const headline = applicant.structuredProfile?.experience?.[0];
  if (headline) return headline;

  return applicant.status === "shortlisted" ? "Shortlisted Candidate" : "Applicant";
};

export const mapApplicant = (applicant: BackendApplicant): ApplicantRecord => {
  const score = normalizeScore(applicant);
  const skills = applicant.structuredProfile?.skills ?? applicant.parsedData?.skills ?? [];
  const tags = applicant.tags?.length ? applicant.tags : skills.slice(0, 4);

  return {
    id: applicant.id ?? applicant._id ?? applicant.fullName,
    jobId: applicant.jobId,
    name: applicant.fullName,
    role: deriveRole(applicant),
    score,
    scoreLabel: scoreLabelFromValue(score),
    tags,
    workflowStatus: applicant.status,
    isShortlisted: applicant.status === "shortlisted",
    email: applicant.email,
    phone: applicant.phone,
    location: applicant.location,
    resumeUrl: applicant.resumeUrl,
    resumeFileName: applicant.resumeFileName,
    resumeText: applicant.resumeText,
    linkedInUrl: applicant.linkedInUrl,
    portfolioUrl: applicant.portfolioUrl,
    education: applicant.structuredProfile?.education ?? applicant.parsedData?.education ?? [],
    experience: applicant.structuredProfile?.experience ?? [],
    certifications:
      applicant.structuredProfile?.certifications ?? applicant.parsedData?.certifications ?? [],
    projects: applicant.structuredProfile?.projects ?? applicant.parsedData?.projects ?? [],
    skills,
    recruiterNotes: applicant.recruiterNotes,
    source: applicant.source,
    aiSummary: applicant.aiSummary,
    isDuplicate: applicant.isDuplicate ?? false,
    isParsed: applicant.isParsed ?? false,
    createdAt: applicant.createdAt,
    updatedAt: applicant.updatedAt,
  };
};

export async function fetchApplicants(
  accessToken: string,
  jobId?: string,
): Promise<ApplicantRecord[]> {
  const query = jobId ? `?jobId=${encodeURIComponent(jobId)}` : "";
  const response = await apiRequest<ApplicantsListResponse>(`/applicants${query}`, {
    headers: withAuthHeaders(accessToken),
  });

  return response.applicants.map(mapApplicant);
}

export async function fetchApplicantById(
  accessToken: string,
  id: string,
): Promise<ApplicantRecord> {
  const response = await apiRequest<ApplicantResponse>(`/applicants/${id}`, {
    headers: withAuthHeaders(accessToken),
  });

  return mapApplicant(response.applicant);
}

export async function updateApplicantStatus(
  accessToken: string,
  id: string,
  status: ApplicantRecord["workflowStatus"],
): Promise<ApplicantRecord> {
  const response = await apiRequest<ApplicantMutationResponse>(`/applicants/${id}`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
    body: { status },
  });

  if (!response.applicant) {
    throw new Error("Applicant update did not return the updated record.");
  }

  return mapApplicant(response.applicant);
}

export async function deleteApplicant(
  accessToken: string,
  id: string,
): Promise<void> {
  await apiRequest<ApplicantMutationResponse>(`/applicants/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });
}

export async function uploadApplicantPdfs(
  accessToken: string,
  jobId: string,
  files: File[],
): Promise<BackendApplicant[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2000/api"}/applicants/applicant-screening/pdf?jobId=${jobId}`, {
    method: "POST",
    headers: {
      ...withAuthHeaders(accessToken),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to upload PDFs");
  }

  const result = await response.json();
  return result.results.map((r: any) => r.savedApplicant);
}
