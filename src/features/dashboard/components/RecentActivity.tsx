export function RecentActivity() {
  const activities = [
    {
      title: "12 New Applicants",
      description: "UX Designer role • 2 hours ago",
      type: "new",
    },
    {
      title: "Interview Scheduled",
      description: "Alex Johnson • Tomorrow, 10:00 AM",
      type: "event",
    },
    {
      title: "Screening Complete",
      description: "Backend Team Lead • Yesterday",
      type: "complete",
    },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-border premium-shadow h-full flex flex-col">
      <h3 className="font-bold text-lg text-primary mb-8">Recent Activity</h3>
      
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
        View Timeline
      </button>
    </div>
  );
}
