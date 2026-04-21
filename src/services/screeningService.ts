"use client";

const API_BASE_URL = "http://localhost:2000/api";

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
  async rankApplicants(jobId: string, topN: number = 10): Promise<RankingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/applicants/applicant-screening/rank?jobId=${jobId}&topN=${topN}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to rank applicants");
      }

      return await response.json();
    } catch (error) {
      console.error("Screening Service Error:", error);
      throw error;
    }
  }
};
