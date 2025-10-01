import type React from "react"
import type { ReactNode } from "react"
import { useEffect } from "react"

import LoadingOverlay from "@components/primitives/LoadingOverlay"
import { useRouter } from "next/router"
import type { NextRouter } from "next/router"

import { AuthChangeEvent, useAuthChange, useAuthStatus } from "./hooks"
import { Flows } from "./lib/allauth"
import type { AuthResponse } from "./lib/allauth"

export const URLs = Object.freeze({
  LOGIN_URL: "/account/login",
  LOGIN_REDIRECT_URL: "/powercurves",
  LOGOUT_REDIRECT_URL: "/"
})

const flow2path: Record<string, string> = {
  [Flows.LOGIN]: "/account/login",
  [Flows.LOGIN_BY_CODE]: "/account/login/confirm",
  [Flows.SIGNUP]: "/account/signup",
  [Flows.VERIFY_EMAIL]: "/account/verify-email",
  [Flows.PROVIDER_SIGNUP]: "/account/provider/signup",
  [Flows.MFA_AUTHENTICATE]: "/account/2fa/authenticate",
  [Flows.REAUTHENTICATE]: "/account/reauthenticate",
  [Flows.MFA_REAUTHENTICATE]: "/account/2fa/reauthenticate"
}

export function pathForFlow(flowId: string): string {
  const path = flow2path[flowId]
  if (!path) {
    throw new Error(`Unknown path for flow: ${flowId}`)
  }
  return path
}

export function pathForPendingFlow(auth: AuthResponse): string | null {
  const flow = auth.data?.flows?.find((flow) => flow.is_pending)
  if (flow) {
    return pathForFlow(flow.id)
  }
  return null
}

// Return the `next` target from the router query, or a default next value
export function getNext(router: NextRouter, defaultNext: string): string {
  // @ts-ignore
  const next = new URLSearchParams(router.query).get("next") || defaultNext
  console.log("NEXT", next)
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
  loading = <LoadingOverlay loading />
}: {
  children: React.ReactNode
  loading?: React.ReactNode
}): React.ReactNode {
  const router = useRouter()
  const status = useAuthStatus()
  const next = `next=${encodeURIComponent(router.asPath)}`
  if (!status.initialised) {
    return loading
  }
  if (status.isAuthenticated) {
    return children
  }
  router.push(`${URLs.LOGIN_URL}?${next}`)
}

/* Protects a route such that if you arrive on it, you are diverted
 * to the login flow, then back to this route post-login
 */
export function AnonymousRoute({
  children
}: {
  children: React.ReactNode
}): React.ReactNode {
  const status = useAuthStatus()
  const router = useRouter()
  if (!status.isAuthenticated) {
    return children
  }
  const next = getNext(router, URLs.LOGIN_REDIRECT_URL)
  router.push(next)
}

export type AllowMode = "authenticated" | "unauthenticated"

/**
 * TODO REFACTOR REQUEST This was added during bezier development and
 * is not used in Strands. Determine why this is used instead
 * of AnonymousRoute and AuthenticatedRoute, and either clarify the
 * functionality or collapse. Note: AnonymousRoute has identical
 * functionality, whilst AuthenticatedRoute is near-identical.
 */
export function BarrierRoute({
  allowMode,
  children
}: {
  allowMode: AllowMode
  children: ReactNode
}) {
  const status = useAuthStatus()
  const router = useRouter()
  const next = router.query.next as string

  useEffect(() => {
    if (!status?.initialised) return

    if (allowMode === "authenticated" && !status.isAuthenticated) {
      const url = next || URLs.LOGIN_URL
      router.push(url)
    }

    if (allowMode === "unauthenticated" && status.isAuthenticated) {
      const url = next || URLs.LOGIN_REDIRECT_URL
      router.push(url)
    }
  }, [status, next, allowMode, router])

  return children
}

export function AuthChangeRedirector({
  children
}: {
  children: React.ReactNode
}): React.ReactNode {
  const [auth, event] = useAuthChange()
  const router = useRouter()

  switch (event) {
    case AuthChangeEvent.LOGGED_OUT: {
      router.push(URLs.LOGOUT_REDIRECT_URL)
      return null
    }
    case AuthChangeEvent.LOGGED_IN: {
      router.push(getNext(router, URLs.LOGIN_REDIRECT_URL))
      return null
    }
    case AuthChangeEvent.REAUTHENTICATED: {
      router.push(getNext(router, URLs.LOGIN_REDIRECT_URL))
      return null
    }
    case AuthChangeEvent.REAUTHENTICATION_REQUIRED: {
      const next = `next=${encodeURIComponent(router.asPath)}`
      if (auth?.data?.flows) {
        const path = pathForFlow(auth.data.flows[0].id)
        // TODO PASS THE FLOW STATE THE THE NEW VIEW PER THE EXAMPLE APP
        router.push(`${path}?${next}`)
        return null
      }
      break
    }
    case AuthChangeEvent.FLOW_UPDATED: {
      if (auth) {
        const path = pathForPendingFlow(auth)
        if (path) {
          router.push(path)
          return null
        }
      }
      console.error("Flow update error. See auth, event:", auth, event)
      throw new Error()
    }
    default:
      break
  }

  // ...stay where we are
  return children
}
