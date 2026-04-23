"use client";

import { API_BASE_URL } from "@/services/api";

export interface RankedCandidate {
  rank: number;
  applicant_id: string;
  candidate_name: string;
  score: number;
  summary: string;
}

export interface RankingResponse {
  success: boolean;
  message: string;
  ranked_candidates: RankedCandidate[];
}

export const screeningService = {
  async rankApplicants(jobId: string, topN: number = 10, accessToken?: string, prompt?: string): Promise<RankingResponse> {
    try {
      const url = new URL(`${API_BASE_URL}/applicants/applicant-screening/rank`);
      url.searchParams.append("jobId", jobId);
      url.searchParams.append("topN", topN.toString());
      if (prompt) url.searchParams.append("prompt", prompt);

      const response = await fetch(url.toString(), {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to rank applicants");
      }

      return await response.json();
    } catch (error) {
      console.error("Screening Service Error:", error);
      throw error;
    }
  },
  async chatWithAI(accessToken: string, jobId: string, message: string, history: any[] = []): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/recruiter/chat/${jobId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      throw new Error("AI Chat failed");
    }

    return response.json();
  }
};
