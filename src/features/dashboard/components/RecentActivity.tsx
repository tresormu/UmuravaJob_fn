export function RecentActivity() {
  const activities = [
    {
      title: "Structured profiles imported",
      description: "24 Umurava profiles mapped to Frontend Engineer role",
      type: "new",
    },
    {
      title: "Shortlist ready for review",
      description: "Top 10 candidates prepared with reasoning notes",
      type: "event",
    },
    {
      title: "Resume batch parsing completed",
      description: "External PDF applicants normalized for recruiter review",
      type: "complete",
    },
  ];

  return (
    <div className="soft-panel flex h-full flex-col p-8">
      <h3 className="mb-8 text-lg font-bold text-primary">Recent activity</h3>
      
      <div className="space-y-8 flex-1">
        {activities.map((activity, i) => (
          <div key={i} className="flex gap-4 relative">
            {i !== activities.length - 1 && (
              <div className="absolute left-[7px] top-6 w-[2px] h-10 bg-secondary" />
            )}
            <div className="w-4 h-4 rounded-full border-2 border-primary bg-white z-10" />
            <div>
              <p className="text-sm font-bold text-primary leading-none mb-1">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-auto pt-6 text-primary font-bold text-xs uppercase tracking-widest hover:underline text-center w-full">
        View workflow
      </button>
    </div>
  );
}
