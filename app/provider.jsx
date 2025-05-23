"use client";
import React, { useState } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessageContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CodeContext } from '@/context/CodeContext';

function Provider({ children }) {
    const [messages, setMessages] = useState([]);
    const [userDetail, setUserDetail] = useState();
    const [code, setCode] = useState({});

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                <MessageContext.Provider value={{ messages, setMessages }}>
                    <CodeContext.Provider value={{ code, setCode }}>
                        <NextThemesProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </NextThemesProvider>
                    </CodeContext.Provider>
                </MessageContext.Provider>
            </UserDetailContext.Provider>
        </GoogleOAuthProvider>
    );
}


export default Provider;
