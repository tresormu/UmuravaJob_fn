"use client";

import { User2, Mail, MapPin, Briefcase, Calendar, Shield, LogOut, Edit3, CheckCircle2, Save, X as CloseIcon, Code2, Palette, Microscope, Building2, Phone, Globe, Bell, Clock, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { cn } from "@/utils/cn";

const managedJobs = [
  { id: 1, title: "Senior Frontend Engineer", department: "Engineering", type: "Full-time", location: "Kigali", applicants: 62, matched: 12, icon: Code2, color: "text-blue-500" },
  { id: 2, title: "Product Designer", department: "Design", type: "Contract", location: "Remote", applicants: 31, matched: 8, icon: Palette, color: "text-purple-500" },
  { id: 3, title: "Data Analyst", department: "Operations", type: "Full-time", location: "Hybrid", applicants: 93, matched: 14, icon: Microscope, color: "text-emerald-500" },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [user, setUser] = useState({
    firstName: "Shema",
    lastName: "Aimé",
    role: "recruiter",
    position: "Senior Lead Recruiter",
    companyName: "Umurava Africa",
    companyWebsite: "https://umurava.africa",
    phone: "+250 788 000 000",
    bio: "Passionate about connecting top African talent with global opportunities. 5+ years of experience in technical recruitment and talent management.",
    timezone: "Africa/Kigali",
    notificationsEnabled: true,
    joined: "January 2024",
  });

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    position: user.position,
    companyName: user.companyName,
    companyWebsite: user.companyWebsite,
    phone: user.phone,
    bio: user.bio,
    timezone: user.timezone,
    notificationsEnabled: user.notificationsEnabled,
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleUpdate = () => {
    setUser({ ...user, ...formData });
    setIsEditing(false);
    setIsConfirming(false);
  };

  const handleLogout = () => {
    // Implement actual logout logic here (e.g., clearing tokens, redirecting)
    console.log("User logged out");
    setIsLoggingOut(false);
    window.location.href = "/login"; // Example redirect
  };

  const scrollToEdit = () => {
    setIsEditing(true);
    const element = document.getElementById("recruiter-details");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Hero Header */}
      <section className="relative h-auto min-h-[16rem] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 bg-primary">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,1),transparent)]"></div>
        <div className="absolute top-0 right-0 p-12">
            <div className="w-64 h-64 bg-accent/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-2xl"
            >
              <div className="w-full h-full rounded-[1.8rem] bg-secondary flex items-center justify-center text-primary text-4xl font-black">
                {user.firstName.charAt(0)}
              </div>
            </motion.div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-black text-white tracking-tighter"
              >
                {user.firstName} {user.lastName}
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 text-white/70 text-sm font-bold uppercase tracking-widest"
              >
                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-accent" /> {user.position}</div>
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-accent" /> {user.companyName}</div>
              </motion.div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToEdit}
              className="px-6 py-3 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-accent hover:text-white transition-all flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          </div>
        </div>
      </section>

      <div id="recruiter-details" className="space-y-8">
        <div className="premium-card p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
            <div>
              <h3 className="text-2xl font-black text-primary tracking-tight">Recruiter Details</h3>
              <p className="text-sm font-bold text-muted-foreground mt-1">Manage your professional identity and posted opportunities</p>
            </div>
            {!isEditing ? (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-accent transition-all"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsConfirming(true)}
                  className="px-6 py-3 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-primary transition-all"
                >
                  <Save className="w-4 h-4" />
                  Update Profile
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-secondary text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-border transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="mt-10">
            {isEditing ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Professional Position</label>
                  <input 
                    type="text" 
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Company Website</label>
                  <input 
                    type="text" 
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Timezone</label>
                  <input 
                    type="text" 
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                  />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Professional Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold resize-none"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex items-center gap-3 p-4 bg-secondary/30 rounded-2xl border border-border">
                  <button 
                    onClick={() => setFormData({ ...formData, notificationsEnabled: !formData.notificationsEnabled })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.notificationsEnabled ? "bg-accent" : "bg-border"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      formData.notificationsEnabled ? "left-7" : "left-1"
                    )} />
                  </button>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Enable Desktop Notifications</span>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <User2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</p>
                      <p className="font-bold text-primary">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Position</p>
                      <p className="font-bold text-primary">{user.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company</p>
                      <p className="font-bold text-primary">{user.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website</p>
                      <p className="font-bold text-primary truncate max-w-[150px]">{user.companyWebsite}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                      <p className="font-bold text-primary">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timezone</p>
                      <p className="font-bold text-primary">{user.timezone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Notifications</p>
                      <p className="font-bold text-primary">{user.notificationsEnabled ? "Enabled" : "Disabled"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined At</p>
                      <p className="font-bold text-primary">{user.joined}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-secondary/20 rounded-none border border-border/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Info className="w-24 h-24 text-primary" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-4">Professional Bio</h4>
                  <p className="text-primary font-medium leading-relaxed max-w-4xl">
                    {user.bio}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-4 group w-full md:w-auto">
                 <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Shield className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Role</p>
                   <p className="font-bold text-primary uppercase text-xs tracking-tighter">System Administrator • Recruiter</p>
                 </div>
               </div>
               <div className="flex items-center justify-end w-full md:w-auto">
                  <button 
                    onClick={() => setIsLoggingOut(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all group shadow-sm"
                  >
                    Logout from Dashboard
                    <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="premium-card p-8">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
            <h3 className="text-xl font-black text-primary tracking-tight">Active Job Postings</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-accent">Real-time Updates</p>
          </div>
          
          <div className="mt-8 space-y-4">
            {managedJobs.map((job, idx) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                className="flex items-center justify-between p-6 bg-secondary/30 rounded-none border border-border/30 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <job.icon className={cn("w-7 h-7", job.color)} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 bg-secondary px-2 py-0.5 rounded-lg">{job.department}</span>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{job.type} • {job.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-12 mr-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-primary">{job.applicants}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Applicants</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-600">{job.matched}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Matched</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={handleUpdate}
        title="Confirm Profile Update"
        description="Are you sure you want to update your profile credentials? These changes will be reflected across your workspace immediately."
        confirmLabel="Yes, Update Info"
        variant="warning"
      />

      <ConfirmationModal 
        isOpen={isLoggingOut}
        onClose={() => setIsLoggingOut(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out of your recruiter dashboard? You will need to sign in again to access your managed jobs and applicants."
        confirmLabel="Yes, Log Me Out"
        variant="danger"
      />
    </div>
  );
}
