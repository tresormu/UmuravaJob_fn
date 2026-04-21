"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Save, Sparkles, Briefcase, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UpdateJobPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    type: "Full-time",
    location: "",
    description: "",
  });

  useEffect(() => {
    // Mock fetching job data
    const title = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    setFormData(prev => ({
      ...prev,
      title,
      department: "Engineering",
      location: "Remote",
      description: "We are looking for a highly skilled professional to join our fast-growing team. The ideal candidate will have extensive experience in the field and a passion for excellence."
    }));
  }, [slug]);

  const handleSave = () => {
    console.log("Saving job updates:", formData);
    router.push("/jobs");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10">
      <div className="flex items-center justify-between">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Jobs
        </Link>
        <div className="flex gap-4">
          <button onClick={handleSave} className="btn-primary btn-md gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Edit Mode</span>
        </div>
        <h2 className="text-4xl font-black text-primary tracking-tighter">Update Job Brief</h2>
        <p className="text-muted-foreground font-medium">Refine your role requirements and screening parameters.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-1">
        <section className="soft-panel p-8 md:p-10 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-secondary/50 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-muted-foreground/50 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Department</label>
              <input 
                type="text" 
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full bg-secondary/50 border border-border/50 rounded-2xl py-4 px-6 text-sm font-bold placeholder:text-muted-foreground/50 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                placeholder="e.g. Product Engineering"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-secondary/50 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                  placeholder="e.g. Kigali, Rwanda / Remote"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Employment Type</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-secondary/50 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 appearance-none transition-all"
                >
                  <option>Full-time</option>
                  <option>Contract</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Job Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={6}
              className="w-full bg-secondary/50 border border-border/50 rounded-3xl py-6 px-6 text-sm font-medium leading-relaxed outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
              placeholder="Describe the role, responsibilities, and key signals for the AI to track..."
            />
          </div>
        </section>

        <section className="bg-primary rounded-[3rem] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles className="w-48 h-48 rotate-12" />
          </div>
          <div className="relative space-y-6">
            <h3 className="text-2xl font-black tracking-tight">AI Scoring Blueprint</h3>
            <p className="text-white/70 font-medium text-sm leading-relaxed max-w-md">
              Updating these fields will automatically re-calibrate the AI screening model for all current and future applicants.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Skills Fit", "Experience", "Cultural Alignment", "Education"].map(tag => (
                <span key={tag} className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
