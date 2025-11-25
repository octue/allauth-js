export { AuthContextProvider } from './AuthContext'
export type { AuthContextValue } from './AuthContext'
export {
  useAuth,
  useAuthChange,
  useAuthStatus,
  useConfig,
  useEmails,
  useProviders,
  useSessions,
  useSetErrors,
  useUser,
} from './hooks'
export type { UseUserResult } from './hooks'

// Export components for use in consumer apps
export { Button } from './components/common/Button'
export type { ButtonProps } from './components/common/Button'

// Export settings components
export { ChangePassword } from './components/settings/ChangePassword'
export { EmailsTable } from './components/settings/EmailsTable'
export { EmailsTableSkeleton } from './components/settings/EmailsTableSkeleton'
export { ProvidersTable } from './components/settings/ProvidersTable'
export { SessionsTable } from './components/settings/SessionsTable'
export { SessionsTableSkeleton } from './components/settings/SessionsTableSkeleton'

// Export icon components
export { BadgeCheck } from './components/icons/BadgeCheck'
export { Dark } from './components/icons/Dark'
export { ExclamationTriangle } from './components/icons/ExclamationTriangle'
export { Light } from './components/icons/Light'
export { Logout } from './components/icons/Logout'
export { Return } from './components/icons/Return'
