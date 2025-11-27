import { AuthenticatedRoute } from '@octue/allauth-js/nextjs'
import { useUser } from '@octue/allauth-js/react'
import { SettingsLayout } from '@/components/layout/SettingsLayout'

function SettingsPage() {
  const { user } = useUser()

  return (
    <SettingsLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Account Settings
        </h1>

        <div className="space-y-6">
          {/* User Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            <div className="space-y-3">
              {user?.username && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Username:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                </div>
              )}
              {user?.email && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email:
                  </span>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
              )}
              {user?.display && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Display Name:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {user.display}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="/account/settings/emails"
                className="block p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Manage Emails
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Add, verify, and manage email addresses
                </p>
              </a>
              <a
                href="/account/password/change"
                className="block p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Change Password
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Update your account password
                </p>
              </a>
              <a
                href="/account/settings/sessions"
                className="block p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Active Sessions
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  View and manage your active sessions
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}

export default function Settings() {
  return (
    <AuthenticatedRoute>
      <SettingsPage />
    </AuthenticatedRoute>
  )
}
