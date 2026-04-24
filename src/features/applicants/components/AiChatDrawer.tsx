"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, User, BrainCircuit, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { chatWithAI } from "@/services/applicantsService";

interface Message {
    role: "user" | "model";
    parts: [{ text: string }];
}

interface AiChatDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    accessToken: string;
    jobTitle?: string;
}

export function AiChatDrawer({ isOpen, onClose, jobId, accessToken, jobTitle }: AiChatDrawerProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<Message[]>([]);
    const router = useRouter();

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            parts: [{ text: input }],
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const history = messagesRef.current;
            const response = await chatWithAI(accessToken, jobId, input, history);

            if (response.navigate) {
                router.push(response.navigate);
                onClose();
            }

            const aiMessage: Message = {
                role: "model",
                parts: [{ text: response.message }],
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMessage: Message = {
                role: "model",
                parts: [{ text: "I'm sorry, I encountered an error. Please try again." }],
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl z-[101] flex flex-col border-l border-white/20"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-primary uppercase tracking-tight">Recruitment AI</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Context: {jobTitle || "Active Job"}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-secondary rounded-full transition-all"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gray-50/30"
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                    <Sparkles className="w-12 h-12 text-primary" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-black uppercase tracking-widest text-primary">AI Assistant active</p>
                                        <p className="text-xs font-medium max-w-[200px]">Ask about your candidates, skills matching, or hiring advice.</p>
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex flex-col max-w-[85%]",
                                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 rounded-tr-none"
                                            : "bg-white text-primary border border-border shadow-sm rounded-tl-none"
                                    )}>
                                        {msg.parts[0].text}
                                    </div>
                                    <div className="mt-1.5 flex items-center gap-1.5 px-1">
                                        {msg.role === "user" ? (
                                            <>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">You</span>
                                                <User className="w-2.5 h-2.5 opacity-40" />
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-2.5 h-2.5 text-accent" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Umurava AI</span>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-accent"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Brainstorming...</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-border/50 bg-white">
                            <div className="relative group">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask a question about your candidates..."
                                    className="w-full bg-secondary/50 border border-transparent rounded-2xl p-4 pr-14 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all resize-none min-h-[100px]"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        "absolute bottom-4 right-4 p-3 rounded-xl transition-all shadow-lg",
                                        input.trim() && !isLoading
                                            ? "bg-primary text-white shadow-primary/20 hover:scale-110 active:scale-95"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="mt-3 text-[9px] text-center font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                                AI can make mistakes. Please verify important details.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
