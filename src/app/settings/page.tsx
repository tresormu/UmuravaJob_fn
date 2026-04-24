"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Lock, 
  ChevronRight,
  Check,
  X,
  Mail,
  KeyRound,
  Shield,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import { updateRecruiter } from "@/services/authService";
import { useRouter } from "next/navigation";

interface SettingsItem {
  id: string;
  label: string;
  value: string;
  type: "text" | "select" | "status" | "badge" | "toggle";
  sensitive?: boolean;
}

interface SettingsSection {
  id: string;
  label: string;
  icon: any;
  description: string;
  items: SettingsItem[];
}

const initialSections: SettingsSection[] = [
  {
    id: "general",
    label: "General Settings",
    icon: SettingsIcon,
    description: "Manage your workspace identity and basic preferences.",
    items: [
      { id: "workspace-name", label: "Workspace Name", value: "Umurava Africa", type: "text" },
      { id: "timezone", label: "Timezone", value: "CAT (GMT+2)", type: "select" },
    ]
  },
  {
    id: "security",
    label: "Security & Access",
    icon: Lock,
    description: "Control who can access this workspace and their permissions.",
    items: [
      { id: "email", label: "Email Address", value: "recruiter@umurava.africa", type: "text", sensitive: true },
      { id: "password", label: "Account Password", value: "••••••••••••", type: "text", sensitive: true },
      { id: "audit-log", label: "Audit Log Access", value: "Admins Only", type: "select" },
    ]
  }
];

type VerificationStep = "idle" | "requesting" | "verifying" | "editing";
type DeleteStep = "idle" | "requesting" | "verifying";

export default function SettingsPage() {
  const { user, accessToken, requestDeleteAccount, confirmDeleteAccount } = useAuth();
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [activeSection, setActiveSection] = useState("general");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setSections(prev => prev.map(section => {
        if (section.id === "general") {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id === "workspace-name") return { ...item, value: user.companyName || "Umurava Africa" };
              if (item.id === "timezone") return { ...item, value: user.timezone || "CAT (GMT+2)" };
              return item;
            })
          };
        }
        if (section.id === "security") {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id === "email") return { ...item, value: user.email };
              return item;
            })
          };
        }
        return section;
      }));
    }
  }, [user]);

  // Credential verification flow
  const [vStep, setVStep] = useState<VerificationStep>("idle");
  const [vCode, setVCode] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Delete account flow
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");
  const [deleteCode, setDeleteCode] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEdit = (id: string, currentValue: string, isSensitive?: boolean) => {
    setEditingItemId(id);
    setTempValue(currentValue);
    setVStep(isSensitive ? "idle" : "editing");
  };

  const handleRequestCode = async () => {
    setIsRequestingCode(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRequestingCode(false);
    setVStep("verifying");
  };

  const handleVerifyCode = async () => {
    setIsRequestingCode(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRequestingCode(false);
    if (vCode === "123456") {
      setVStep("editing");
    } else {
      setShowErrorModal(true);
    }
  };

  const handleDone = async (sectionId: string, itemId: string) => {
    if (!user || !accessToken) return;
    try {
      setIsSaving(true);
      const dataToUpdate: any = {};
      if (itemId === "workspace-name") dataToUpdate.companyName = tempValue;
      if (itemId === "timezone") dataToUpdate.timezone = tempValue;
      if (itemId === "email") dataToUpdate.email = tempValue;

      await updateRecruiter(accessToken, user.id, dataToUpdate);

      setSections(prev => prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item =>
              item.id === itemId ? { ...item, value: tempValue } : item
            )
          };
        }
        return section;
      }));
    } catch (error) {
      console.error("Failed to update setting:", error);
    } finally {
      setIsSaving(false);
      setEditingItemId(null);
      setVStep("idle");
      setVCode("");
    }
  };

  const handleRequestDeleteCode = async () => {
    setIsDeleteLoading(true);
    setDeleteError(null);
    try {
      await requestDeleteAccount();
      setDeleteStep("verifying");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCode.trim()) return;
    setIsDeleteLoading(true);
    setDeleteError(null);
    try {
      await confirmDeleteAccount(deleteCode.trim());
      router.push("/");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Invalid or expired code.");
      setIsDeleteLoading(false);
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tighter">Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground font-medium">Fine-tune your workspace policies and account security.</p>
        </div>
        <button 
          onClick={() => setShowSaveModal(true)}
          className="btn-primary h-12 px-8 gap-3 rounded-xl shadow-lg shadow-primary/10"
        >
           <ShieldCheck className="w-4 h-4" />
           Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-1.5 font-sans">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setEditingItemId(null);
                setVStep("idle");
              }}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-4 group",
                activeSection === section.id 
                  ? "bg-primary text-white shadow-md shadow-primary/10" 
                  : "hover:bg-secondary text-primary"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                activeSection === section.id ? "bg-white/10" : "bg-secondary group-hover:bg-white shadow-sm"
              )}>
                <section.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs uppercase tracking-widest">{section.label}</p>
              </div>
              <ChevronRight className={cn(
                "w-3.5 h-3.5 transition-transform",
                activeSection === section.id ? "translate-x-0" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )} />
            </button>
          ))}

          {/* Danger Zone nav item */}
          <button
            onClick={() => {
              setActiveSection("danger");
              setEditingItemId(null);
              setVStep("idle");
            }}
            className={cn(
              "w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-4 group",
              activeSection === "danger"
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "hover:bg-red-50 text-red-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              activeSection === "danger" ? "bg-white/10" : "bg-red-50 group-hover:bg-white shadow-sm"
            )}>
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xs uppercase tracking-widest">Danger Zone</p>
            </div>
            <ChevronRight className={cn(
              "w-3.5 h-3.5 transition-transform",
              activeSection === "danger" ? "translate-x-0" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            )} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-border/50 rounded-2xl p-8 shadow-sm relative overflow-hidden min-h-[400px]">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <SettingsIcon className="w-48 h-48 rotate-12" />
          </div>

          {activeSection === "danger" ? (
            <div className="relative space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-xl font-black text-red-600 tracking-tight">Danger Zone</h3>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Actions here are permanent and cannot be undone.
                </p>
              </div>

              <div className="border-2 border-red-100 rounded-2xl p-6 space-y-6 bg-red-50/30">
                <div>
                  <p className="text-sm font-black text-red-700 uppercase tracking-widest mb-1">Delete Account</p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Permanently delete your account and all associated data. A verification code will be sent to <span className="font-bold text-primary">{user?.email}</span> to confirm.
                  </p>
                </div>

                {deleteError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {deleteError}
                  </div>
                )}

                {deleteStep === "idle" && (
                  <button
                    onClick={handleRequestDeleteCode}
                    disabled={isDeleteLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-60"
                  >
                    {isDeleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete My Account
                  </button>
                )}

                {deleteStep === "verifying" && (
                  <div className="space-y-4 max-w-sm">
                    <p className="text-xs font-medium text-primary/70">
                      Enter the 6-digit verification code sent to your email to confirm deletion.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="000 000"
                        value={deleteCode}
                        onChange={(e) => setDeleteCode(e.target.value)}
                        className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm font-black tracking-[0.2em] outline-none focus:ring-2 focus:ring-red-200"
                      />
                      <button
                        onClick={handleConfirmDelete}
                        disabled={isDeleteLoading || deleteCode.length < 6}
                        className="px-5 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-60 flex items-center gap-2"
                      >
                        {isDeleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                      </button>
                    </div>
                    <button
                      onClick={() => { setDeleteStep("idle"); setDeleteCode(""); setDeleteError(null); }}
                      className="text-xs text-muted-foreground hover:text-primary font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative space-y-10">
               {currentSection?.items.map((item) => {
                 const isEditingThis = editingItemId === item.id;
                 
                 if (item.sensitive) {
                   return (
                     <div key={item.id} className="bg-secondary/40 border border-border/60 rounded-xl p-6 transition-all hover:border-primary/20">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                {item.id === "email" ? <Mail className="w-3 h-3 text-primary/50" /> : <KeyRound className="w-3 h-3 text-primary/50" />}
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                             </div>
                             
                             {isEditingThis && vStep !== "editing" ? (
                               <div className="space-y-4 max-w-sm animate-in fade-in slide-in-from-left-2 transition-all">
                                  {vStep === "idle" && (
                                    <div className="space-y-3">
                                      <p className="text-xs font-medium text-primary/70">
                                        For your security, we need to verify your access before changing sensitive credentials.
                                      </p>
                                      <button 
                                        onClick={handleRequestCode}
                                        disabled={isRequestingCode}
                                        className="btn-primary btn-sm h-10 w-full rounded-lg gap-2 text-[10px]"
                                      >
                                        {isRequestingCode ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                                        Request Verification Code
                                      </button>
                                    </div>
                                  )}
                                  {vStep === "verifying" && (
                                    <div className="space-y-3">
                                      <p className="text-xs font-medium text-primary/70">
                                        Enter the 6-digit code sent to your email.
                                      </p>
                                      <div className="flex gap-2">
                                        <input 
                                          type="text"
                                          placeholder="000 000"
                                          value={vCode}
                                          onChange={(e) => setVCode(e.target.value)}
                                          className="flex-1 bg-white border border-border rounded-lg px-4 py-2 text-sm font-black tracking-[0.2em] outline-none"
                                        />
                                        <button 
                                          onClick={handleVerifyCode}
                                          disabled={isRequestingCode || vCode.length < 6}
                                          className="btn-primary rounded-lg px-4 text-[10px] font-bold"
                                        >
                                          {isRequestingCode ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify"}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                               </div>
                             ) : isEditingThis && vStep === "editing" ? (
                               <div className="flex items-center gap-2 mt-2 max-w-sm">
                                  <input 
                                    autoFocus
                                    type={item.id === "password" ? "password" : "text"}
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleDone(activeSection, item.id)}
                                    className="flex-1 bg-white border border-border rounded-lg px-4 py-2.5 text-primary font-bold text-sm outline-none focus:ring-2 focus:ring-primary/10"
                                  />
                                  <button 
                                    onClick={() => handleDone(activeSection, item.id)}
                                    className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                               </div>
                             ) : (
                               <p className="text-primary font-bold text-base">{item.value}</p>
                             )}
                          </div>

                          {!isEditingThis && (
                            <button 
                              onClick={() => handleEdit(item.id, item.value, true)}
                              className="btn-base h-10 px-6 bg-white border border-border rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
                            >
                              Edit Credentials
                            </button>
                          )}
                          {isEditingThis && (
                             <button 
                              onClick={() => { setEditingItemId(null); setVStep("idle"); }}
                              className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                       </div>
                     </div>
                   );
                 }

                 return (
                   <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 group px-2">
                     <div className="flex-1 max-w-md">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 group-hover:text-accent transition-colors">
                          {item.label}
                        </p>
                        {isEditingThis ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input 
                              autoFocus
                              type="text"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleDone(activeSection, item.id)}
                              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-primary font-bold text-sm outline-none focus:ring-2 focus:ring-primary/10"
                            />
                            <button 
                              onClick={() => handleDone(activeSection, item.id)}
                              className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setEditingItemId(null)}
                              className="p-2 text-primary/30 rounded-lg hover:text-primary"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-primary font-bold text-base">{item.value}</p>
                        )}
                     </div>
                     
                     <div className="flex items-center gap-4">
                        {!isEditingThis && (
                          <button 
                            onClick={() => handleEdit(item.id, item.value)}
                            className="px-4 py-2 bg-secondary/50 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                          >
                            {item.type === "select" ? "Change" : "Edit"}
                          </button>
                        )}
                     </div>
                   </div>
                 );
               })}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={() => setShowSaveModal(false)}
        title="Apply changes to workspace?"
        description="Your new configuration will be applied across the entire workspace immediately."
        confirmLabel="Yes, Proceed"
        variant="primary"
      />

      <ConfirmationModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => setShowErrorModal(false)}
        title="Invalid Verification Code"
        description="The code you entered is incorrect or has expired. Please check your email and try again."
        confirmLabel="Try Again"
        variant="danger"
      />
    </div>
  );
}
