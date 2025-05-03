import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import ThemeToggle from '../theme-toggle'

function Header() {
  return (
    <div className='p-4 flex justify-between items-center'>
        <Image src="/image.png" alt="logo" width={40} height={40} className="dark:invert"/>
        <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Button variant="ghost">Sign In</Button>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
            </Button>
        </div>
    </div>
  )
}

export default Header