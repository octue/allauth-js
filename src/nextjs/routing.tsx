import type { ReactNode } from 'react'
import { useContext } from 'react'

import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'

import { AUTH_CHANGE_KIND } from '../core/constants'
import { flow2path } from '../core/urls'
import type { URLConfig } from '../core/types'
import { AuthContext } from '../react/AuthContext'
import { useAuthChange, useAuthStatus, useConfig } from '../react/hooks'
import type { AuthResponse, Flow } from '../core'

// Default URLs - can be overridden via AuthContextProvider props or backend config
const DEFAULT_URLS = Object.freeze({
  LOGIN_URL: '/account/login',
  LOGIN_REDIRECT_URL: '/account/settings',
  LOGOUT_REDIRECT_URL: '/',
})

// Deprecated: Use useURLs() hook instead for dynamic URL configuration
export const URLs = DEFAULT_URLS

// Hook to get merged URLs from context props, backend config, and defaults
function useURLs() {
  const context = useContext(AuthContext)
  const config = useConfig()

  // @ts-ignore
  const propsUrls: URLConfig | undefined = context?.urls
  const configUrls: URLConfig | undefined = config?.data?.urls

  // Merge URLs: props override config, config overrides defaults
  return {
    LOGIN_URL: propsUrls?.login || configUrls?.login || DEFAULT_URLS.LOGIN_URL,
    LOGIN_REDIRECT_URL: propsUrls?.loginRedirect || configUrls?.loginRedirect || DEFAULT_URLS.LOGIN_REDIRECT_URL,
    LOGOUT_REDIRECT_URL: propsUrls?.logoutRedirect || configUrls?.logoutRedirect || DEFAULT_URLS.LOGOUT_REDIRECT_URL,
  }
}

export function pathForFlow(flowId: string): string {
  const path = flow2path[flowId]
  if (!path) {
    throw new Error(`Unknown path for flow: ${flowId}`)
  }
  return path
}

export function pathForPendingFlow(auth: AuthResponse): string | null {
  const flow = auth.data?.flows?.find((flow: Flow) => flow.is_pending)
  if (flow) {
    return pathForFlow(flow.id)
  }
  return null
}

// Return the `next` target from the router query, or a default next value
export function getNext(router: NextRouter, defaultNext: string): string {
  // @ts-ignore
  const next = new URLSearchParams(router.query).get('next') || defaultNext
  console.log('NEXT', next)
  return next
  // TODO Chatgpt says the following is typesafe but I need to check functionality...
  // const rawNext = router.query.next
  // return (Array.isArray(rawNext) ? rawNext[0] : rawNext) || defaultNext
}

/* Protects a route such that if you arrive on it, you are diverted
 * to the login flow, then back to this route post-login
 */
export function AuthenticatedRoute({
  children,
  loading = null, //<LoadingOverlay loading />
}: {
  children: ReactNode
  loading?: ReactNode
}): ReactNode {
  const router = useRouter()
  const status = useAuthStatus()
  const urls = useURLs()
  const next = `next=${encodeURIComponent(router.asPath)}`
  if (!status.initialised) {
    return loading
  }
  if (status.isAuthenticated) {
    return children
  }
  router.push(`${urls.LOGIN_URL}?${next}`)
}

/* Protects a route such that if you arrive on it, you are diverted
 * to the logout flow, then back to this route post-logout
 */
export function AnonymousRoute({
  children,
}: {
  children: ReactNode
}): ReactNode {
  const status = useAuthStatus()
  const router = useRouter()
  const urls = useURLs()
  if (!status.isAuthenticated) {
    return children
  }
  const next = getNext(router, urls.LOGIN_REDIRECT_URL)
  router.push(next)
}

export function AuthChangeRedirector({
  children,
}: {
  children: ReactNode
}): ReactNode {
  const [auth, event] = useAuthChange()
  const router = useRouter()
  const urls = useURLs()

  switch (event) {
    case AUTH_CHANGE_KIND.LOGGED_OUT: {
      router.push(urls.LOGOUT_REDIRECT_URL)
      return null
    }
    case AUTH_CHANGE_KIND.LOGGED_IN: {
      router.push(getNext(router, urls.LOGIN_REDIRECT_URL))
      return null
    }
    case AUTH_CHANGE_KIND.REAUTHENTICATED: {
      router.push(getNext(router, urls.LOGIN_REDIRECT_URL))
      return null
    }
    case AUTH_CHANGE_KIND.REAUTHENTICATION_REQUIRED: {
      const next = `next=${encodeURIComponent(router.asPath)}`
      if (auth?.data?.flows) {
        const path = pathForFlow(auth.data.flows[0].id)
        // TODO PASS THE FLOW STATE THE THE NEW VIEW PER THE EXAMPLE APP
        router.push(`${path}?${next}`)
        return null
      }
      break
    }
    case AUTH_CHANGE_KIND.FLOW_UPDATED: {
      if (auth) {
        const path = pathForPendingFlow(auth)
        if (path) {
          router.push(path)
          return null
        }
      }
      console.error('Flow update error. See auth, event:', auth, event)
      throw new Error()
    }
    default:
      break
  }

  // ...stay where we are
  return children
}
