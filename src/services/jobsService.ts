"use client";

import { apiRequest } from "@/services/api";

export type JobIcon = "code" | "design" | "research";

type BackendJob = {
  _id?: string;
  id?: string;
  title: string;
  department?: string;
  employmentType?: string;
  description?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  location?: string;
  recruiterId?: string | { _id?: string; id?: string };
  deadline?: string;
  applicantsCount?: number;
  matchedCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type JobsResponse = {
  success: boolean;
  data: BackendJob[];
};

type JobResponse = {
  success: boolean;
  message?: string;
  data: BackendJob;
};

export interface JobRecord {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  skills: string[];
  experience: number;
  education: string;
  deadline: string;
  recruiterId?: string;
  createdAt?: string;
  updatedAt?: string;
  progress: number;
  applicants: number;
  matched: number;
  icon: JobIcon;
}

export interface JobFormValues {
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  skills: string[];
  experienceRange: string;
  education: string;
  deadline: string;
}

const DEFAULT_FORM_VALUES: JobFormValues = {
  title: "",
  department: "Engineering",
  type: "Full-time",
  location: "Remote",
  description: "",
  skills: [],
  experienceRange: "3 years",
  education: "Not specified",
  deadline: "",
};

const normalizeRecruiterId = (value: BackendJob["recruiterId"]): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.id ?? value._id;
};

const inferIcon = (job: Pick<JobRecord, "title" | "department">): JobIcon => {
  const haystack = `${job.title} ${job.department}`.toLowerCase();

  if (haystack.includes("design")) return "design";
  if (haystack.includes("data") || haystack.includes("research") || haystack.includes("analyst")) {
    return "research";
  }
  return "code";
};

const parseExperienceYears = (value: string): number => {
  const match = value.match(/\d+/);
  return match ? Number.parseInt(match[0] ?? "0", 10) : 0;
};

export const formatExperienceRange = (years: number): string => {
  if (!Number.isFinite(years) || years <= 0) return "0 years";
  if (years === 1) return "1 year";
  return `${years} years`;
};

const mapJob = (job: BackendJob): JobRecord => {
  const mapped: JobRecord = {
    id: job.id ?? job._id ?? job.title,
    title: job.title,
    department: job.department?.trim() || "General",
    type: job.employmentType?.trim() || "Full-time",
    location: job.location?.trim() || "Remote",
    description: job.description?.trim() || "",
    skills: Array.isArray(job.skills) ? job.skills : [],
    experience: Number.isFinite(job.experience) ? Number(job.experience) : 0,
    education: job.education?.trim() || "Not specified",
    deadline: job.deadline ?? "",
    recruiterId: normalizeRecruiterId(job.recruiterId),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    progress: job.applicantsCount ? Math.min(100, Math.round(((job.matchedCount ?? 0) / job.applicantsCount) * 100)) : 0,
    applicants: job.applicantsCount ?? 0,
    matched: job.matchedCount ?? 0,
    icon: "code",
  };

  mapped.icon = inferIcon(mapped);
  return mapped;
};

const serializeJobPayload = (values: JobFormValues) => {
  const payload: Record<string, unknown> = {
    title: values.title.trim(),
    department: values.department.trim(),
    employmentType: values.type.trim(),
    description: values.description.trim(),
    location: values.location.trim(),
    skills: values.skills.map((skill) => skill.trim()).filter(Boolean),
    experience: parseExperienceYears(values.experienceRange),
    education: values.education.trim() || "Not specified",
  };

  if (values.deadline) {
    payload.deadline = values.deadline;
  }

  return payload;
};

const withAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const jobFormValuesFromJob = (job?: JobRecord | null): JobFormValues => {
  if (!job) return DEFAULT_FORM_VALUES;

  return {
    title: job.title,
    department: job.department,
    type: job.type,
    location: job.location,
    description: job.description,
    skills: job.skills,
    experienceRange: formatExperienceRange(job.experience),
    education: job.education,
    deadline: job.deadline ? job.deadline.slice(0, 10) : "",
  };
};

export async function fetchJobs(): Promise<JobRecord[]> {
  const response = await apiRequest<JobsResponse>("/jobs");
  return response.data.map(mapJob);
}

export async function fetchJobById(id: string): Promise<JobRecord> {
  const response = await apiRequest<JobResponse>(`/jobs/${id}`);
  return mapJob(response.data);
}

export async function createJob(
  accessToken: string,
  values: JobFormValues,
): Promise<JobRecord> {
  const response = await apiRequest<JobResponse>("/jobs", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: serializeJobPayload(values),
  });

  return mapJob(response.data);
}

export async function updateJob(
  accessToken: string,
  id: string,
  values: JobFormValues,
): Promise<JobRecord> {
  const response = await apiRequest<JobResponse>(`/jobs/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: serializeJobPayload(values),
  });

  return mapJob(response.data);
}

export async function deleteJob(accessToken: string, id: string): Promise<void> {
  await apiRequest<{ success: boolean; message: string }>(`/jobs/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });
}

export function filterJobsForRecruiter(jobs: JobRecord[], recruiterId?: string): JobRecord[] {
  if (!recruiterId) return jobs;
  return jobs.filter((job) => job.recruiterId === recruiterId);
}
