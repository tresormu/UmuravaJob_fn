"use client";

import { useRouter } from "next/navigation";
import { JobForm } from "@/features/jobs/components/JobForm";
import { useAuth } from "@/context/AuthContext";
import { createJob, jobFormValuesFromJob } from "@/services/jobsService";

export default function CreateJobPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  return (
    <div className="pb-20">
      <JobForm
        mode="create"
        initialValues={jobFormValuesFromJob(null)}
        onSubmit={async (values) => {
          if (!accessToken) {
            throw new Error("Your session expired. Sign in again to create a job.");
          }

          await createJob(accessToken, values);
          router.push("/jobs");
          return "Job brief published successfully.";
        }}
      />
    </div>
  );
}
