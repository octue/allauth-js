import { Button, useAuthStatus, useUser } from '@octue/allauth-js/react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export default function Home() {
  const { isAuthenticated } = useAuthStatus()
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-allauth-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showLogo>
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user?.email || user?.username}
            </span>
            <Link
              href="/account/logout"
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Logout
            </Link>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-end gap-x-6">
            <Link
              href="/account/login"
              className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-50"
            >
              Log in
            </Link>
            <Button className="font-semibold" href="/account/signup">
              Sign up
            </Button>
          </div>
        )}
      </Header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Demo of allauth-js
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            A complete authentication solution for Next.js + Django Allauth
          </p>
        </div>

        {isAuthenticated ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              You're logged in!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Welcome back, {user?.display || user?.email || user?.username}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/account/settings"
                className="block p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Account Settings
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Manage your account preferences
                </p>
              </Link>
              <Link
                href="/account/settings/emails"
                className="block p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Email Addresses
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Manage your email addresses
                </p>
              </Link>
              <Link
                href="/account/password/change"
                className="block p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Change Password
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Update your password
                </p>
              </Link>
              <Link
                href="/account/settings/sessions"
                className="block p-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Active Sessions
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  View and manage your sessions
                </p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Secure Authentication
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email/password, passwordless, and social authentication
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                React Hooks
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Modern hooks-based architecture for easy integration
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Customizable
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use pre-built components or build your own
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
