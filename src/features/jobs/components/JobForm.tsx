"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, SlidersHorizontal, Sparkles, Target } from "lucide-react";

export function JobForm() {
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    workType: "Full-time",
    location: "Kigali / Remote",
    description: "",
    experienceRange: "3-5 years",
    shortlistSize: "Top 10",
    recruiterNotes: "",
  });

  const [skills, setSkills] = useState(["React.js", "TypeScript", "API integration"]);
  const [softSkills, setSoftSkills] = useState(["Communication", "Ownership"]);
  const [newSkill, setNewSkill] = useState("");
  const [activeSkillType, setActiveSkillType] = useState<"tech" | "soft">("tech");
  const [weights] = useState({ skills: 40, experience: 30, relevance: 20, education: 10 });

  const handleAddSkill = (type: "tech" | "soft") => {
    const value = newSkill.trim();
    if (!value) return;

    if (type === "tech") {
      if (!skills.includes(value)) setSkills([...skills, value]);
    } else if (!softSkills.includes(value)) {
      setSoftSkills([...softSkills, value]);
    }

    setNewSkill("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Job setup</p>
          <h2 className="text-3xl font-black tracking-tight text-primary">
            {formData.title || "New role brief"}
          </h2>
        </div>
        <Link href="/jobs" className="btn-secondary btn-md gap-2 self-start">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <div className="soft-panel p-6 md:p-8">
            <h3 className="text-lg font-bold text-primary">Role basics</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Job title</span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Department</span>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Work type</span>
                <input
                  type="text"
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Location</span>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
            <label className="mt-5 block space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Role summary</span>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the mission, outcomes, and what good performance looks like."
                className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm leading-7 text-primary outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          <div className="soft-panel p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-primary">Must-have requirements</h3>
              <div className="rounded-full bg-secondary p-1">
                <button
                  onClick={() => setActiveSkillType("tech")}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${activeSkillType === "tech" ? "bg-primary text-white" : "text-primary/70"}`}
                >
                  Technical
                </button>
                <button
                  onClick={() => setActiveSkillType("soft")}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${activeSkillType === "soft" ? "bg-primary text-white" : "text-primary/70"}`}
                >
                  Soft skills
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {(activeSkillType === "tech" ? skills : softSkills).map((skill) => (
                <span key={skill} className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-bold text-primary">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a requirement or evaluation signal"
                className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button onClick={() => handleAddSkill("tech")} className="btn-secondary btn-md gap-2">
                <Plus className="h-4 w-4" />
                Add technical
              </button>
              <button onClick={() => handleAddSkill("soft")} className="btn-secondary btn-md gap-2">
                <Plus className="h-4 w-4" />
                Add soft skill
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Experience range</span>
                <input
                  type="text"
                  value={formData.experienceRange}
                  onChange={(e) => setFormData({ ...formData, experienceRange: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Shortlist output</span>
                <input
                  type="text"
                  value={formData.shortlistSize}
                  onChange={(e) => setFormData({ ...formData, shortlistSize: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
          </div>

          <div className="soft-panel p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/5 p-2 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">Recruiter notes for AI screening</h3>
                <p className="text-sm text-muted-foreground">
                  Capture trade-offs, deal-breakers, and context the model should explain clearly.
                </p>
              </div>
            </div>
            <textarea
              rows={7}
              value={formData.recruiterNotes}
              onChange={(e) => setFormData({ ...formData, recruiterNotes: e.target.value })}
              placeholder="Example: Prioritize candidates who have led production frontend work, but allow strong product sense to offset weaker years of experience."
              className="mt-5 w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm leading-7 text-primary outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="soft-panel p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/5 p-2 text-primary">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Scoring blueprint</h3>
                <p className="text-xs text-muted-foreground">Useful for backend handoff and Gemini prompt design.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold capitalize text-primary">{key}</span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="soft-panel p-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-bold">Output expectations</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Rank candidates using a consistent scoring rubric.</li>
              <li>Show strengths, gaps, and role relevance for each shortlisted candidate.</li>
              <li>Keep final hiring decisions with the recruiter, not the model.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-primary p-6 text-white shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Ready for backend integration</p>
            <p className="mt-3 text-sm leading-7 text-white/85">
              This UI is now structured so your teammate can connect form data to API routes,
              persistence, and Gemini orchestration without redesigning the screen.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary btn-lg flex-1">Save draft</button>
            <button className="btn-primary btn-lg flex-1">Start screening setup</button>
          </div>
        </div>
      </div>
    </div>
  );
}
