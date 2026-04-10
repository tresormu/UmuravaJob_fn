"use client";

import { useState } from "react";
import { ChevronRight, ArrowLeft, X, Plus, Activity, Target, ShieldCheck, SlidersHorizontal, ListChecks } from "lucide-react";
import { cn } from "@/utils/cn";

export function JobForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    workType: "Full-time Remote",
    description: "",
    calibration: "",
    persona: "",
    aiPrompt: "",
  });

  const [skills, setSkills] = useState(["React.js", "TypeScript", "Node.js"]);
  const [softSkills, setSoftSkills] = useState(["Communication", "Problem Solving"]);
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [experience, setExperience] = useState([5, 8]);
  const [matchScore, setMatchScore] = useState(85);
  const [weights, setWeights] = useState({ technical: 50, behavioral: 30, experience: 20 });

  const steps = [
    { id: "01", label: "Role Essentials" },
    { id: "02", label: "Requirements" },
    { id: "03", label: "Analysis Context" },
  ];

  const handleAddSkill = (type: "tech" | "soft") => {
    if (!newSkill) return;
    if (type === "tech") {
      if (!skills.includes(newSkill)) setSkills([...skills, newSkill]);
    } else {
      if (!softSkills.includes(newSkill)) setSoftSkills([...softSkills, newSkill]);
    }
    setNewSkill("");
    setIsAddingSkill(false);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      {/* breadcrumbs-like Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[9px] md:text-[10px] uppercase font-bold text-primary opacity-60 tracking-widest mb-1">Configuration / New Role</p>
          <h2 className="text-2xl md:text-4xl font-bold text-primary tracking-tight">{formData.title || "Untitled Search"}</h2>
        </div>
        
        {/* Step Indicator Dashboard */}
        <div className="flex bg-white p-1 rounded-2xl border border-border shadow-sm overflow-x-auto no-scrollbar max-w-full">
          {steps.map((s, i) => (
            <div 
              key={s.id}
              onClick={() => i + 1 < step && setStep(i + 1)}
              className={cn(
                "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap",
                step === i + 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <span className="text-[10px] font-bold opacity-60">{s.id}</span>
              <span className="text-xs md:text-sm font-bold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content Area Dashboard */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* STEP 1: Core Essentials */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 md:space-y-8">
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-border shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                     <ListChecks className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-primary uppercase text-[10px] tracking-[0.2em]">Position Overview</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Target Job Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Full-Stack Engineer"
                      className="w-full bg-[#F8FAFB] border border-border rounded-xl px-5 py-3 md:py-4 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-primary font-bold text-sm md:text-base placeholder:font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Department</label>
                      <select 
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-[#F8FAFB] border border-border rounded-xl px-5 py-3 md:py-4 focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer font-bold text-primary text-sm md:text-base"
                      >
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Product</option>
                      </select>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Work Type</label>
                      <select 
                         value={formData.workType}
                         onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                         className="w-full bg-[#F8FAFB] border border-border rounded-xl px-5 py-3 md:py-4 focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer font-bold text-primary text-sm md:text-base"
                      >
                        <option>Full-time Remote</option>
                        <option>Hybrid</option>
                        <option>On-site</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Role Objective</label>
                    <textarea 
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Define the primary impact of this role..."
                      className="w-full bg-[#F8FAFB] border border-border rounded-xl px-5 py-3 md:py-4 focus:ring-2 focus:ring-primary/10 outline-none resize-none font-medium text-primary text-sm md:text-base leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-10 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                     <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-primary uppercase text-[10px] tracking-[0.2em]">Core Competencies</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map(skill => (
                    <div key={skill} className="bg-white text-primary border border-border px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-3 shadow-sm">
                      {skill}
                      <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsAddingSkill(true)}
                    className="border border-dashed border-border px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all active:scale-95 bg-[#F8FAFB]"
                  >
                    + Define New Competency
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills & Persona Dashboard */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 md:space-y-8">
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-border shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                     <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-primary uppercase text-[10px] tracking-[0.2em]">Team Fit & Behavioral Traits</h3>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {softSkills.map(skill => (
                    <div key={skill} className="bg-white text-primary border border-border px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-3 shadow-sm">
                      {skill}
                      <button onClick={() => setSoftSkills(softSkills.filter(s => s !== skill))} className="hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                      </button>
                    </div>
                  ))}
                  <button className="border border-dashed border-border px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all bg-[#F8FAFB]">
                    + Add Trait
                  </button>
                </div>

                <div className="space-y-4 pt-8 border-t border-border">
                  <div className="space-y-2.5">
                    <label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Ideal Talent Persona</label>
                    <textarea 
                      rows={8}
                      value={formData.persona}
                      onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                      placeholder="Define the ideal psychological and professional profile..."
                      className="w-full bg-[#F8FAFB] border border-border rounded-xl px-5 py-3 md:py-4 focus:ring-2 focus:ring-primary/10 outline-none resize-none font-medium text-primary text-sm md:text-base leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-10 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                     <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-primary uppercase text-[10px] tracking-[0.2em]">Operational Culture</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                   {["Innovation-Led", "Output-Focused", "Collaborative", "High-Ownership"].map(trait => (
                     <button key={trait} className="p-5 bg-[#F8FAFB] border border-border rounded-2xl text-left hover:border-primary hover:bg-white transition-all group flex items-center justify-between">
                        <span className="font-bold text-primary/60 group-hover:text-primary transition-colors text-sm md:text-base tracking-tight">{trait}</span>
                        <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-primary transition-colors"></div>
                     </button>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AI Context Dashboard */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 md:space-y-8">
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-border shadow-sm space-y-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                     <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-primary uppercase text-[10px] tracking-[0.2em]">Requirement Weighting</h3>
                </div>
                
                <div className="space-y-8">
                  {Object.entries(weights).map(([key, value]) => (
                    <div key={key} className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{key} Importance</span>
                         <span className="text-sm font-bold text-primary">{value}%</span>
                      </div>
                      <div className="h-2 bg-[#F8FAFB] rounded-full relative">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary p-6 md:p-10 rounded-3xl text-white shadow-lg shadow-primary/10 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-x-12 -translate-y-12"></div>
                 <div className="flex items-center gap-3 mb-6 relative z-10">
                    <Activity className="w-5 h-5 opacity-60" />
                    <h3 className="font-bold text-sm md:text-base uppercase tracking-widest">Alignment Logic (Special Tags)</h3>
                 </div>
                 <textarea 
                    value={formData.aiPrompt}
                    onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
                    rows={6}
                    placeholder="Provide specific analysis directives for the matching engine..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-xs md:text-sm placeholder:text-white/30 outline-none focus:bg-white/15 transition-all text-white resize-none h-44 leading-relaxed font-medium"
                 />
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR: Configuration Area Dashboard */}
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
             <div className="flex items-center gap-2 mb-8">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                 <h3 className="font-bold text-primary text-xs uppercase tracking-widest">Profile Index</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#F8FAFB] text-primary rounded-xl border border-border">
                     <Target className="w-4 h-4 opacity-40" />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Target Score</h5>
                    <p className="font-bold text-sm text-primary">{matchScore}% Accuracy</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#F8FAFB] text-primary rounded-xl border border-border">
                     <Activity className="w-4 h-4 opacity-40" />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Experience Span</h5>
                    <p className="font-bold text-sm text-primary">{experience[0]} - {experience[1]} YRS</p>
                  </div>
                </div>
                {step > 1 && (
                  <div className="flex items-start gap-4 animate-in slide-in-from-top-2">
                    <div className="p-2.5 bg-[#F8FAFB] text-primary rounded-xl border border-border">
                       <ShieldCheck className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Validation</h5>
                      <p className="font-bold text-sm text-accent">ENABLED</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex justify-between items-center mb-2.5">
                   <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Setup Progress</span>
                   <span className="text-xs font-bold text-primary">{step === 3 ? "Analysis Ready" : step === 2 ? "75%" : "35%"}</span>
                </div>
                <div className="h-1.5 bg-[#F8FAFB] rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: step === 3 ? "100%" : step === 2 ? "75%" : "35%" }} />
                </div>
              </div>
          </div>

          {step === 1 && (
             <div className="bg-primary p-6 md:p-10 rounded-3xl text-white shadow-lg shadow-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform duration-1000 group-hover:-translate-x-2"></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <Activity className="w-5 h-5 opacity-40" />
                    <h3 className="font-bold text-sm md:text-base uppercase tracking-widest">Alignment Strategy</h3>
                </div>
                <textarea 
                  value={formData.calibration}
                  onChange={(e) => setFormData({ ...formData, calibration: e.target.value })}
                  rows={8}
                  placeholder="Define specific alignment criteria for this search..."
                  className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-xs md:text-sm placeholder:text-white/30 underline-none focus:bg-white/15 transition-all text-white resize-none leading-relaxed font-medium"
                />
             </div>
          )}
        </div>
      </div>

      {/* Footer Actions Dashboard */}
      <div className="fixed bottom-0 left-0 lg:left-[288px] right-0 h-20 md:h-28 bg-white/95 border-t border-border flex items-center justify-between px-6 md:px-16 z-40">
         <div className="flex-1">
            {step > 1 && (
               <button 
                  onClick={handleBack}
                  className="flex items-center gap-3 text-primary font-bold hover:gap-5 transition-all h-12 text-sm md:text-base group"
               >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous</span>
               </button>
            )}
         </div>

         <div className="flex items-center gap-3 md:gap-6">
            <button className="btn-secondary btn-lg border-border animate-in fade-in">
              Save Draft
            </button>
            <button 
              onClick={handleNext}
              className="btn-primary btn-lg gap-3 md:gap-4 group"
            >
              <span>{step === 3 ? "Initialize Search" : "Continue"}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
}
