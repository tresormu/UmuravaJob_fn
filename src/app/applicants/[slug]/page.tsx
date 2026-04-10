import { CandidateDetail } from "@/features/applicants/components/CandidateDetail";
import { candidatesData } from "@/features/applicants/data/candidates";
import { notFound } from "next/navigation";

export default function ApplicantDetailPage({ params }: { params: { slug: string } }) {
  const candidate = candidatesData[params.slug as keyof typeof candidatesData];
  
  if (!candidate) {
    notFound();
  }

  return (
    <div className="p-8">
      <CandidateDetail candidate={candidate} />
    </div>
  );
}
