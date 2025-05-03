"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { MessageContext } from "@/context/MessagesContext";
import { motion, AnimatePresence, stagger, useAnimate } from "framer-motion";
import { SendHorizonal, Code, Sparkles, Bot, User, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ChatPage({ params }) {
    const { messages, setMessages } = useContext(MessageContext);
    const bottomRef = useRef(null);
    const inputRef = useRef();
    const [isThinking, setIsThinking] = useState(false);
    const [scope, animate] = useAnimate();
    const [codeOutput, setCodeOutput] = useState("// Your generated code will appear here\n// Select a conversation or ask the AI to generate some code");

    // Enhanced animation for message entry
    useEffect(() => {
        if (messages.length > 0) {
            animate(
                ".message",
                { opacity: 1, y: 0 },
                { delay: stagger(0.1), duration: 0.3 }
            );
        }
    }, [messages, animate]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        const input = inputRef.current.value.trim();
        if (!input) return;
        
        // Add user message
        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        inputRef.current.value = "";
        
        // Simulate AI thinking
        setIsThinking(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add AI response (mocked)
        const aiResponse = { 
            role: "ai", 
            content: `Here's a response to your query about "${input}". I can help you with code generation, debugging, or explanations.` 
        };
        setMessages(prev => [...prev, aiResponse]);
        
        // Update code output (mocked)
        setCodeOutput(`// Generated code based on: "${input}"\n\nfunction example() {\n  // Your code here\n  console.log("Hello, world!");\n  return "Response to: ${input}";\n}`);
        
        setIsThinking(false);
    };

    return (
        <motion.div
            className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            ref={scope}
        >
            {/* Sidebar (Chat Area) */}
            <motion.div 
                className="w-1/3 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 border-r border-gray-200 dark:border-gray-700 shadow-lg"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                    </motion.div>
                    <motion.h2 
                        className="text-xl font-bold text-gray-800 dark:text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Code Assistant
                    </motion.h2>
                </div>

                {/* Chat History Header */}
                <motion.div 
                    className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <History className="w-4 h-4" />
                    <span className="text-sm font-medium">Current Conversation</span>
                </motion.div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-4">
                    {/* <AnimatePresence> */}
                        {/* {messages.length === 0 && (
                            <motion.div
                                className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 dark:text-gray-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Sparkles className="w-10 h-10 mb-4 text-indigo-300 dark:text-indigo-500" />
                                <h3 className="text-lg font-medium mb-2">Welcome to Code Assistant</h3>
                                <p className="text-sm max-w-xs">
                                    Start a conversation by typing your coding question below.
                                </p>
                            </motion.div>
                        )} */}

                        {messages.map((msg, index) => (
                            <motion.div
                            key={index}
                                className={cn(
                                    "message opacity-0 translate-y-5 p-3 rounded-xl max-w-[90%] relative",
                                    msg.role === "user"
                                        ? "bg-indigo-100 dark:bg-indigo-900/70 ml-auto shadow-indigo-100 dark:shadow-none"
                                        : "bg-white dark:bg-gray-700/70 shadow-sm dark:shadow-gray-800/50"
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-start gap-2">
                                    <div className={cn(
                                        "p-1 rounded-full mt-1",
                                        msg.role === "user" 
                                            ? "bg-indigo-500 text-white" 
                                            : "bg-emerald-500 text-white"
                                    )}>
                                        {msg.role === "user" ? (
                                            <User className="w-3 h-3" />
                                        ) : (
                                            <Bot className="w-3 h-3" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            {msg.role === "user" ? "You" : "Code Assistant"}
                                        </p>
                                        <p className="text-sm text-gray-800 dark:text-gray-100">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        
                        {isThinking && (
                            <motion.div
                                className="message opacity-0 p-3 rounded-xl max-w-[90%] bg-white dark:bg-gray-700/70 shadow-sm dark:shadow-gray-800/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-full bg-emerald-500 text-white">
                                        <Bot className="w-3 h-3" />
                                    </div>
                                    <div className="flex space-x-1">
                                        <motion.div
                                            className="w-2 h-2 bg-gray-400 rounded-full"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.2 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 bg-gray-400 rounded-full"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: 0.2, repeatDelay: 0.2 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 bg-gray-400 rounded-full"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: 0.4, repeatDelay: 0.2 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        <div ref={bottomRef} />
                    {/* </AnimatePresence> */}
                </div>

                {/* Chat Input */}
                <motion.div 
                    className="pt-3 mt-auto border-t border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Ask about coding..."
                            className="flex-1 bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSend();
                            }}
                        />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                onClick={handleSend} 
                                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-indigo-200 dark:shadow-none"
                                disabled={isThinking}
                            >
                                <SendHorizonal className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Code Assistant can help with debugging, explanations, and code generation
                    </p>
                </motion.div>
            </motion.div>

            {/* Main Code Output Area */}
            <motion.div 
                className="w-2/3 p-6 overflow-y-auto bg-white dark:bg-gray-900/80 backdrop-blur-sm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            >
                <motion.div
                    className="flex items-center gap-3 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Code className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Code Output</h2>
                </motion.div>

                <motion.div
                    className="w-full h-full min-h-[500px] border rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 shadow-inner transition-all overflow-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.pre 
                        className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {codeOutput}
                    </motion.pre>
                    
                    {messages.length === 0 && (
                        <motion.div
                            className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Code className="w-10 h-10 mb-4 text-emerald-300 dark:text-emerald-500" />
                            <h3 className="text-lg font-medium mb-2">Interactive Code Playground</h3>
                            <p className="text-sm max-w-md">
                                The code generated from your conversations will appear here. You can test, modify, and run the code directly in this environment.
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Action Buttons */}
                {messages.length > 0 && (
                    <motion.div 
                        className="flex gap-3 mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button variant="outline" className="border-indigo-500 text-indigo-600 dark:text-indigo-400">
                            Copy Code
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                            Run Code
                        </Button>
                        <Button variant="outline" className="ml-auto">
                            Save to Project
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}