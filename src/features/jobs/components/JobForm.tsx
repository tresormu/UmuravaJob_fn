"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, SlidersHorizontal, Sparkles, Target, HelpCircle, Trash2, Bot } from "lucide-react";
import { useUI } from "@/context/UIContext";

export function JobForm() {
  const { setIsAIChatOpen } = useUI();
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
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

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
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Department</span>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Work type</span>
                <input
                  type="text"
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Location</span>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm leading-7 text-primary outline-none focus:ring-2 focus:ring-primary/20"
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

            <div className="mt-6 grid gap-5 md:grid-cols-1">
              <label className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Minimum experience</span>
                <input
                  type="text"
                  value={formData.experienceRange}
                  onChange={(e) => setFormData({ ...formData, experienceRange: e.target.value })}
                  placeholder="e.g. 3-5 years"
                  className="w-full rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
          </div>


          <div className="soft-panel p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-none bg-accent/5 p-2 text-accent">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-primary">Screening questions</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent px-2 py-0.5 bg-accent/5 rounded-full">Optional</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ask candidates specific questions to gather more signals and context.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              {questions.map((q, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-none group">
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-primary shadow-sm">{idx + 1}</span>
                  <p className="flex-1 text-sm font-bold text-primary">{q}</p>
                  <button 
                    onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex gap-3">
                <input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type a question recruiters should ask..."
                  className="flex-1 rounded-none border border-border bg-secondary px-4 py-3.5 text-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button 
                  onClick={() => {
                    if (newQuestion.trim()) {
                      setQuestions([...questions, newQuestion.trim()]);
                      setNewQuestion("");
                    }
                  }}
                  className="btn-secondary btn-md gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button className="btn-secondary btn-lg flex-1">Save draft</button>
            <button className="btn-primary btn-lg flex-1">Start screening setup</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="soft-panel p-6 bg-primary/5 border-primary/10">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center text-primary shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-base">Maximize your job brief</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Our AI can help you draft better requirements and screening questions to attract high-quality matching talent.
                </p>
              </div>
              <button 
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
    </div>
  );
}

