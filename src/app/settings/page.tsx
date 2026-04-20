export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-3xl font-black text-primary">Settings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Simple placeholders for the integrations and policies your team will wire up next.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="soft-panel p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">LLM integration</p>
          <h3 className="mt-3 text-lg font-bold text-primary">Gemini connection</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Pending backend credentials. UI is ready to display model status, request health, and
            structured screening responses.
          </p>
        </div>

        <div className="soft-panel p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Scoring policy</p>
          <h3 className="mt-3 text-lg font-bold text-primary">Weighted evaluation</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Skills, experience, education, and role relevance stay visible so recruiters can
            challenge the ranking if needed.
          </p>
        </div>

        <div className="soft-panel p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Explainability</p>
          <h3 className="mt-3 text-lg font-bold text-primary">Human review guardrails</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Every shortlist output should show strengths, gaps, and a recommendation note without
            pretending to make the final hiring decision.
          </p>
        </div>
      </div>
    </div>
  );
}
