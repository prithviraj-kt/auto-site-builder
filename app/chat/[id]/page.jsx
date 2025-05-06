"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { MessageContext } from "@/context/MessagesContext";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, Code, Sparkles, Bot, User, History, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import run from "@/configs/AIModel";
import generateCode from "@/configs/GenerateCode";
import Link from "next/link";
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Split from 'react-split';
import { useTheme } from 'next-themes';
import Lookup from "@/data/Lookup";
import { CodeContext } from '@/context/CodeContext';

function formatAIContent(content) {
    // Try to pretty-print JSON if possible
    try {
        const obj = JSON.parse(content);
        return <pre className="whitespace-pre-wrap break-words text-xs md:text-sm bg-muted/30 rounded p-2 overflow-x-auto">{JSON.stringify(obj, null, 2)}</pre>;
    } catch {
        // Otherwise, just show as text
        return <span>{content}</span>;
    }
}

export default function ChatPage({ params }) {
    const { messages, setMessages } = useContext(MessageContext);
    const { code, setCode } = useContext(CodeContext);
    const bottomRef = useRef(null);
    const inputRef = useRef();
    const [isThinking, setIsThinking] = useState(false);
    const [codeOutput, setCodeOutput] = useState("// Your generated code will appear here");
    const initialAITriggered = useRef(false);
    const { theme: systemTheme, resolvedTheme } = useTheme();
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);
    const [view, setView] = useState('code'); // 'code' or 'preview'
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
    const [dirtyFiles, setDirtyFiles] = useState({});
    const [inputValue, setInputValue] = useState("");
    const previewRef = useRef();
    const [previewLoading, setPreviewLoading] = useState(false);

    const DEFAULT_QUESTION = "How can you help me with React development?";

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (
            messages &&
            messages.length === 1 &&
            messages[0].role === 'user' &&
            !initialAITriggered.current &&
            !messages.find(m => m.role === 'ai')
        ) {
            initialAITriggered.current = true;
            handleSend(messages[0].content, true);
        }
    }, [messages]);

    useEffect(() => {
        setMounted(true);
        setTheme(resolvedTheme || systemTheme || 'light');
    }, [resolvedTheme, systemTheme]);

    const handleSend = async (customInput = null, skipUserMessage = false) => {
        const input = customInput || inputRef.current?.value.trim();
        if (!input) return;

        if (!skipUserMessage) {
            const userMessage = { role: "user", content: input };
            setMessages(prev => [...prev, userMessage]);
        }

        if (!customInput) inputRef.current.value = "";

        setIsThinking(true);

        try {
            const chatHistory = messages.map(msg => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            }));

            const result = await run(messages, input);
            const aiReply = result.response.text();

            const aiMessage = { role: "ai", content: aiReply };
            setMessages(prev => [...prev, aiMessage]);
            setCodeOutput(`// Based on input: "${input}"\n\n${aiReply}`);

            // --- Generate code files ---
            const codeFiles = await generateCode(messages, input, code);
            if (codeFiles && typeof codeFiles === 'object') {
                setFiles(codeFiles);
                setCode(codeFiles);
            } else {
                setFiles(Lookup?.DEFAULT_FILE);
                setCode(Lookup?.DEFAULT_FILE);
            }
        } catch (err) {
            const errorMsg = { role: "ai", content: "Sorry, something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMsg]);
        }

        setIsThinking(false);
    };

    // Track file changes for dirty indicator
    const handleFileChange = (fileName, code) => {
        setFiles(prev => ({ ...prev, [fileName]: { ...prev[fileName], code } }));
        setDirtyFiles(prev => ({ ...prev, [fileName]: true }));
    };

    const handleSwitchView = (v) => {
        setView(v);
        if (v === 'preview') setPreviewLoading(true);
    };

    if (!mounted) return null; // Hydration fix

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen w-full"
        >
            <Split
                className="h-screen w-full font-sans"
                sizes={[35, 65]}
                minSize={[280, 320]}
                gutterSize={5}
                snapOffset={0}
                direction="horizontal"
                style={{ display: 'flex', width: '100%', height: '100vh', background: 'var(--background)' }}
                gutterStyle={() => ({
                    background: theme === 'dark' ? '#222' : '#e5e7eb',
                    width: '5px',
                    cursor: 'col-resize',
                    borderRadius: '4px',
                    boxShadow: theme === 'dark' ? '0 0 4px #0008' : '0 0 4px #8882',
                    transition: 'background 0.2s',
                })}
            >
                {/* Chat Sidebar */}
                <aside className="flex flex-col bg-background/90 dark:bg-background/80 backdrop-blur-xl border-r border-border shadow-xl h-full">
                    <div className="flex items-center justify-between mb-4 pt-6 px-6">
                        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-base font-semibold">Back to Home</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                                <Sparkles className="w-6 h-6 text-primary" />
                            </motion.div>
                            <h2 className="text-xl font-bold tracking-tight">Code Assistant</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2 px-6 text-muted-foreground">
                        <History className="w-4 h-4" />
                        <span className="text-sm font-medium">Current Conversation</span>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
                        <AnimatePresence>
                            {(messages || []).map((msg, index) => (
                                <motion.div
                                    key={index}
                                    className={cn(
                                        "message opacity-0 translate-y-5 p-3 rounded-2xl max-w-[90%] relative shadow border border-border/40",
                                        msg.role === "user"
                                            ? theme === 'dark'
                                                ? "bg-gradient-to-r from-blue-700 to-indigo-800 text-white ml-auto"
                                                : "bg-gradient-to-r from-blue-500 to-blue-400 text-white ml-auto"
                                            : theme === 'dark'
                                                ? "bg-card/80 text-card-foreground"
                                                : "bg-white/90 text-gray-900"
                                    )}
                                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.97 }}
                                    transition={{ duration: 0.3, delay: index * 0.08 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <motion.div
                                            className={cn("p-2 rounded-full mt-1 shadow border border-border/40", msg.role === "user"
                                                ? theme === 'dark'
                                                    ? "bg-gradient-to-r from-blue-700 to-indigo-800 text-white"
                                                    : "bg-gradient-to-r from-blue-500 to-blue-400 text-white"
                                                : "bg-emerald-500 text-white")}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </motion.div>
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                                                {msg.role === "user" ? "You" : "Code Assistant"}
                                            </p>
                                            <p className="text-base leading-relaxed whitespace-pre-line">{msg.role === "ai" ? formatAIContent(msg.content) : msg.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isThinking && (
                            <motion.div
                                className="message opacity-0 p-3 rounded-2xl max-w-[90%] bg-card/80 shadow border border-border/40"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-emerald-500 text-white shadow border border-border/40">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <motion.div
                                        className="flex space-x-2"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    >
                                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                                        <span className="text-base text-muted-foreground">Thinking...</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                    <motion.div
                        className="pt-2 pb-6 px-6 mt-auto border-t border-border/40 bg-background/90 rounded-b-2xl shadow-inner"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex gap-2 items-center">
                            <Input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Ask about coding..."
                                className="flex-1 bg-background/80 border border-border/40 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-base shadow-sm"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && inputValue.trim()) handleSend(inputValue);
                                }}
                            />
                            {inputValue.trim() && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={() => { handleSend(inputValue); setInputValue(""); }}
                                        className={cn(
                                            "shadow-lg px-5 py-3 rounded-xl text-lg border-none focus:outline-none transition-all",
                                            theme === 'dark'
                                                ? "bg-gradient-to-r from-blue-700 to-indigo-800 text-white hover:from-blue-800 hover:to-indigo-900"
                                                : "bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:from-blue-600 hover:to-blue-500"
                                        )}
                                        disabled={isThinking}
                                    >
                                        <SendHorizonal className="w-5 h-5" />
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Code Assistant can help with debugging, explanations, and code generation
                        </p>
                    </motion.div>
                </aside>
                {/* Code/Output Area */}
                <section className="flex flex-col h-full w-full bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-100/80 dark:from-[#18181b] dark:via-[#232336] dark:to-[#18181b] backdrop-blur-xl p-0 rounded-xl shadow-2xl border border-border/40 transition-all duration-500">
                    <div className="flex items-center gap-2 px-8 pt-6 pb-2">
                        <button
                            className={`px-3 py-1.5 rounded-l-lg font-medium text-sm transition-all focus:outline-none ${view === 'code' ? 'bg-blue-600 text-white' : 'bg-muted text-foreground hover:bg-accent'}`}
                            onClick={() => handleSwitchView('code')}
                            aria-pressed={view === 'code'}
                        >
                            Code
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-r-lg font-medium text-sm transition-all focus:outline-none border-l border-border ${view === 'preview' ? 'bg-blue-600 text-white' : 'bg-muted text-foreground hover:bg-accent'}`}
                            onClick={() => handleSwitchView('preview')}
                            aria-pressed={view === 'preview'}
                        >
                            Preview
                        </button>
                        {view === 'preview' && (
                            <button
                                className="ml-4 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-sm shadow hover:bg-blue-700 transition-all"
                                onClick={() => {
                                    if (previewRef.current && previewRef.current.iframe) {
                                        window.open(previewRef.current.iframe.src, '_blank');
                                    }
                                }}
                            >
                                Open Output in New Tab
                            </button>
                        )}
                    </div>
                    <div className="flex-1 min-h-0 w-full p-2 pt-0 flex flex-col h-full relative">
                        <SandpackProvider
                            files={files}
                            customSetup={{ dependencies: { ...Lookup.DEPENDANCY } }}
                            options={{ externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'] }}
                            template="react"
                            theme={theme === 'dark' ? 'dark' : 'light'}
                            autorun
                        >
                            <SandpackLayout style={{ height: '100%', minHeight: 0, flex: 1, display: 'flex', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
                                <SandpackFileExplorer style={{height:'100%', borderRadius: '1rem 0 0 1rem'}} />
                                {view === 'code' ? (
                                    <SandpackCodeEditor
                                        style={{ minWidth: 0, flex: 1, fontSize: 15, borderRadius: '0 1rem 1rem 0', background: 'rgba(255,255,255,0.95)' }}
                                        showLineNumbers
                                        showTabs
                                    />
                                ) : (
                                    <div className="relative flex-1 min-w-0 h-full">
                                        {previewLoading && (
                                            <motion.div
                                                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-blue-200/80 via-white/80 to-purple-200/80 dark:from-[#232336]/80 dark:via-[#18181b]/80 dark:to-[#232336]/80 backdrop-blur-lg rounded-xl shadow-xl"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                                <span className="text-lg font-semibold text-blue-700 dark:text-blue-300 animate-pulse">Loading Preview...</span>
                                            </motion.div>
                                        )}
                                        <SandpackPreview
                                            ref={previewRef}
                                            style={{ minWidth: 0, flex: 1, height: '100%', borderRadius: '0 1rem 1rem 0', background: theme === 'dark' ? '#18181b' : '#fff', boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)' }}
                                            showNavigator={true}
                                            onLoad={() => setPreviewLoading(false)}
                                        />
                                    </div>
                                )}
                            </SandpackLayout>
                        </SandpackProvider>
                    </div>
                </section>
            </Split>
        </motion.div>
    );
}
