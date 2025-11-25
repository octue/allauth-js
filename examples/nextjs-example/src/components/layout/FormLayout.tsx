import Link from "next/link"
import React from "react"
import { AllauthLogo } from "./AllauthLogo"

export interface FormLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Link href="/">
                <AllauthLogo className="h-12 w-auto" />
              </Link>
            </div>
            {title && (
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
