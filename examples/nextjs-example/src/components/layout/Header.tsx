import type React from 'react'

import Link from 'next/link'

import { AllauthLogo } from './AllauthLogo'
import { ThemeToggle } from './ThemeToggle'

export interface HeaderProps {
  children?: React.ReactNode
  showLogo?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  children,
  showLogo = false,
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            {showLogo && <AllauthLogo className="h-8 w-auto" />}
          </Link>
          <div className="flex items-center space-x-4">
            {children}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
