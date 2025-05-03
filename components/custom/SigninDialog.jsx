"use client"

import React, { useContext } from 'react'
import axios from 'axios'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import { UserDetailContext } from '@/context/UserDetailContext'

function SigninDialog({ openDialog, closeDialog }) {
    const { setUserDetail } = useContext(UserDetailContext)

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse?.access_token}`
                        }
                    }
                )
                setUserDetail(userInfo.data)
                closeDialog(false)
            } catch (error) {
                console.error("Failed to fetch user info:", error)
            }
        },
        onError: (errorResponse) => console.error(errorResponse),
          redirect_uri: "http://localhost:3000"

    });

    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle />
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="font-bold text-2xl text-center text-gray-900 dark:text-white">
                            {Lookup.SIGNIN_HEADING}
                        </h2>
                        <DialogDescription className="mt-2 text-center text-gray-500 dark:text-gray-400">
                            {Lookup.SIGNIN_SUBHEADING}
                        </DialogDescription>

                        <Button
                          onClick={googleLogin}
                            className="bg-blue-500 my-3 text-white hover:bg-blue-400 dark:text-white"
                        >
                          Sign in with Google
                        </Button>
                        <DialogDescription className='text-gray-500 dark:text-gray-400'>
                            {Lookup?.SIGNIN_AGREEMENT_TEXT}
                        </DialogDescription>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SigninDialog