"use client";
import React, { useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes";

function Provider({ children }) {

    const [messages, setMessages] = useState()

    return (

            <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </NextThemesProvider>

    )
}

export default Provider