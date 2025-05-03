"use client";

import React, { useContext, useEffect, useRef } from "react";
import { MessageContext } from "@/context/MessagesContext";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage({ params }) {
    const { messages, setMessages } = useContext(MessageContext);
    const bottomRef = useRef(null);
    const inputRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        const input = inputRef.current.value.trim();
        if (!input) return;
        setMessages((prev) => [
            ...prev,
            { role: "user", content: input },
            { role: "ai", content: `AI response to: ${input}` }, // Mocked response
        ]);
        inputRef.current.value = "";
    };

    return (
        <motion.div
            className="flex h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Sidebar (Chat Area) */}
            <div className="w-1/3 flex flex-col bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-300 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Chat History</h2>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-md max-w-[90%] ${
                                msg.role === "user"
                                    ? "bg-blue-100 dark:bg-blue-800 self-end text-right ml-auto"
                                    : "bg-white dark:bg-gray-800"
                            } shadow-sm`}
                        >
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {msg.role === "user" ? "You" : "AI"}:
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{msg.content}</p>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Chat Input */}
                <div className="pt-3 mt-3 border-t border-gray-300 dark:border-gray-700">
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSend();
                            }}
                        />
                        <Button onClick={handleSend} variant="default" className="flex items-center gap-1">
                            <SendHorizonal className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Code Output Area */}
            <div className="w-2/3 p-6 overflow-y-auto bg-white dark:bg-black">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Code Output Area</h2>
                <div className="w-full h-[500px] border rounded-xl bg-gray-50 dark:bg-gray-900 p-6 shadow-inner transition-all">
                    <p className="text-gray-700 dark:text-gray-300">
                        This is where your generated code and output will be shown.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
