import { createContext, useEffect, useState } from 'react'

import { getAuth, getConfig } from '../core'
import type {
  AuthChangeEvent,
  AuthData,
  AuthResponse,
  ConfigurationResponse,
  URLConfig,
} from '../core/types'

interface AuthContextProviderProps {
  children: React.ReactNode
  urls?: URLConfig
}

export interface AuthContextValue {
  auth: AuthResponse | undefined
  config: ConfigurationResponse | undefined
  urls?: URLConfig
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthContextProvider = ({
  children,
  urls,
}: AuthContextProviderProps) => {
  const [auth, setAuth] = useState<AuthResponse | undefined>(undefined)
  const [config, setConfig] = useState<ConfigurationResponse | undefined>(
    undefined
  )

  useEffect(() => {
    function onAuthChanged(e: AuthChangeEvent<AuthData>) {
      setAuth((auth) => {
        if (typeof auth === 'undefined') {
          console.log('Authentication status loaded')
        } else {
          console.log('Authentication status updated')
        }
        return e.detail
      })
    }

    document.addEventListener(
      'allauth.auth.change',
      onAuthChanged as EventListener
    )
    // TODO REFACTOR REQUEST
    // This shouldn't be running on every single page,
    // it's crazy to wait check a session before rendering the whole page.
    // It should only run if there's actually a session cookie present (
    getAuth()
      .then((data) => setAuth(data))
      .catch(() => {
        // This is not an error, it just means we're not authenticated right now
        setAuth(undefined)
      })
    getConfig()
      .then((data) => setConfig(data))
      .catch((e) => {
        console.error(e)
      })
    return () => {
      document.removeEventListener(
        'allauth.auth.change',
        onAuthChanged as EventListener
      )
    }
  }, [])

  return (
    <AuthContext.Provider value={{ auth, config, urls }}>
      {children}
    </AuthContext.Provider>
  )
}
