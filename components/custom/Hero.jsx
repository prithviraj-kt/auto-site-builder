"use client";

import React, { useState, useContext } from 'react'
import Lookup from '@/data/Lookup'
import { Button } from "../ui/button";
import { ArrowRight, Sparkles, Lightbulb } from "lucide-react";
import Link from "next/link";
import { MessageContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import SigninDialog from './SigninDialog';

import { useRouter } from 'next/navigation';
function Hero() {

    const router = useRouter();

    const [userInput, setUserInput] = useState();
    const { messages, setMessages } = useContext(MessageContext);
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    // const [openDialog, setOpenDialog] = useState(false)
    const onGenerate = (input) => {
        // if (!userDetail?.name) {
        //     setOpenDialog(true)
        //     return
        // }
        setUserInput(input);
        // Clear existing messages and set only the new one
        setMessages([{
            role: 'user',
            content: input
        }]);
        // Add a small delay to ensure state updates before navigation
        setTimeout(() => {
            router.push('/chat/1');
        }, 100);
    }
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl mx-auto text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-4">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">AI-Powered Content Creation</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {Lookup.HERO_HEADING}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mb-3 max-w-2xl mx-auto">
                    {Lookup.HERO_DESC}
                </p>
                <Link
                    href="/pricing"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group text-sm"
                >
                    View Pricing
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative">
                        <textarea
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            className="min-h-[150px] w-full p-4 text-base rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 focus-visible:ring-2 focus-visible:ring-ring resize-none transition-all duration-200"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        {userInput && (
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUserInput('')}
                                    className="hover:bg-background/80"
                                >
                                    Clear
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => onGenerate(userInput)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    Generate <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span>Try these suggestions:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Lookup.SUGGSTIONS.map((suggestion, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left justify-start truncate"
                                onClick={() => onGenerate(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    {/* <SigninDialog openDialog={openDialog} closeDialog={(v)=>setOpenDialog(false)} /> */}
                </div>
            </div>
        </div>
    );
}

export default Hero