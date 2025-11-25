import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuthStatus, useUser } from "@octue/allauth-js/react"
import { Header } from "./Header"

export interface SettingsLayoutProps {
  children: React.ReactNode
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const router = useRouter()
  const { isAuthenticated } = useAuthStatus()
  const { user } = useUser()

  const navigation = [
    { name: "Account", href: "/account/settings" },
    { name: "Emails", href: "/account/settings/emails" },
    { name: "Password", href: "/account/password/change" },
    { name: "Sessions", href: "/account/settings/sessions" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showLogo>
        {isAuthenticated && user && (
          <>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user.email || user.username}
            </span>
            <Link
              href="/account/logout"
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Logout
            </Link>
          </>
        )}
      </Header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="space-y-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      block px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
