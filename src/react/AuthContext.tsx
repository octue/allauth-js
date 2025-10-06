import { createContext, useEffect, useState } from 'react'

import { getAuth, getConfig } from '../core'

interface AuthContextProviderProps {
  children: React.ReactNode
}
export const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState(undefined)
  const [config, setConfig] = useState(undefined)

  useEffect(() => {
    //@ts-ignore
    function onAuthChanged(e) {
      setAuth((auth) => {
        if (typeof auth === 'undefined') {
          console.log('Authentication status loaded')
        } else {
          console.log('Authentication status updated')
        }
        return e.detail
      })
    }

    document.addEventListener('allauth.auth.change', onAuthChanged)
    // TODO REFACTOR REQUEST
    // This shouldn't be running on every single page,
    // it's crazy to wait check a session before rendering the whole page.
    // It should only run if there's actually a session cookie present (
    getAuth()
      //@ts-ignore
      .then((data) => setAuth(data))
      .catch(() => {
        // This is not an error, it just means we're not authenticated right now
        //@ts-ignore
        setAuth(false)
      })
    getConfig()
      //@ts-ignore
      .then((data) => setConfig(data))
      .catch((e) => {
        console.error(e)
      })
    return () => {
      document.removeEventListener('allauth.auth.change', onAuthChanged)
    }
  }, [])

  return (
    //@ts-ignore
    <AuthContext.Provider value={{ auth, config }}>
      {children}
    </AuthContext.Provider>
  )
}
