"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Sparkles, Trash2, Bot } from "lucide-react";
import { useUI } from "@/context/UIContext";
import type { JobFormValues } from "@/services/jobsService";

interface JobFormProps {
  mode?: "create" | "edit";
  initialValues: JobFormValues;
  onSubmit: (values: JobFormValues) => Promise<string | void>;
}

type Feedback = {
  tone: "error" | "success" | "info";
  message: string;
};

export function JobForm({
  mode = "create",
  initialValues,
  onSubmit,
}: JobFormProps) {
  const { setIsAIChatOpen } = useUI();
  const [formData, setFormData] = useState<JobFormValues>(initialValues);
  const [newSkill, setNewSkill] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleAddSkill = () => {
    const value = newSkill.trim();
    if (!value || formData.skills.includes(value)) return;

    setFormData((current) => ({
      ...current,
      skills: [...current.skills, value],
    }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const updateField = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const message = await onSubmit(formData);
      if (message) {
        setFeedback({ tone: "success", message });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We couldn't save the job brief right now.";
      setFeedback({ tone: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = mode === "create" ? "New role brief" : formData.title || "Update role brief";
  const submitLabel = mode === "create" ? "Publish job brief" : "Save changes";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-8 pb-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Job setup</p>
          <h2 className="text-3xl font-black tracking-tight text-primary">{heading}</h2>
        </div>
        <Link href="/jobs" className="btn-secondary btn-md gap-2 self-start">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>
      </div>

      {feedback && (
        <div
          className={`rounded-[1.5rem] border px-5 py-4 text-sm font-medium ${
            feedback.tone === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : feedback.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-primary/20 bg-primary/5 text-primary"
          }`}
        >
          {feedback.message}
        </div>
      )}

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
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Department</span>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Employment type</span>
                <select
                  value={formData.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Full-time</option>
                  <option>Contract</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Location</span>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Kigali / Remote"
                />
              </label>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Minimum experience</span>
                <input
                  type="text"
                  value={formData.experienceRange}
                  onChange={(e) => updateField("experienceRange", e.target.value)}
                  placeholder="e.g. 3 years"
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Education</span>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => updateField("education", e.target.value)}
                  placeholder="e.g. Bachelor's degree in Computer Science"
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
            <label className="mt-5 block space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Deadline</span>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
                className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="mt-5 block space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Role summary</span>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the mission, outcomes, and what good performance looks like."
                className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm leading-7 text-primary outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          <div className="soft-panel p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-primary">Must-have requirements</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent px-3 py-1 bg-accent/5 rounded-full">
                Required for AI screening
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-bold text-primary"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-white hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a required skill, tool, or evaluation signal"
                className="w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button type="button" onClick={handleAddSkill} className="btn-secondary btn-md gap-2">
                <Plus className="h-4 w-4" />
                Add skill
              </button>
            </div>
          </div>

          <div className="soft-panel p-6 md:p-8 bg-accent/5 border-accent/10">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white p-3 text-accent shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary">Next integration step</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Screening questions, scoring weights, and applicant pipeline wiring come next. For
                  this step, we&apos;re saving the core job brief and requirements end to end.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg flex-1 disabled:opacity-70">
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="soft-panel p-6 bg-primary/5 border-primary/10">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center text-primary shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-base">Refine this brief with AI</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Ask the AI assistant for stronger requirements, clearer descriptions, and sharper
                  evaluation signals before you publish.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAIChatOpen(true)}
                className="btn-primary btn-md w-full gap-2 mt-2"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
