export { AuthContextProvider } from './AuthContext'
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

// Note: don't export the components, consumer apps may not use them so there's no point increasing the bundle size
