import { ScreeningWorkspace } from "@/features/screening/components/ScreeningWorkspace";

interface ScreeningPageProps {
  searchParams?: { role?: string | string[] };
}

export default function ScreeningPage({ searchParams }: ScreeningPageProps) {
  const role = Array.isArray(searchParams?.role) ? searchParams?.role[0] : searchParams?.role;
  return (
    <div className="mx-auto max-w-[1480px]">
      <ScreeningWorkspace role={role} />
    </div>
  );
}
