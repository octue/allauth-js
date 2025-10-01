import { useContext, useEffect, useRef, useState } from "react"

import { AuthContext } from "../AuthContext"

export function useAuth() {
  return useContext(AuthContext)?.auth
}

export function useConfig() {
  return useContext(AuthContext)?.config
}

export function useUser() {
  const auth = useContext(AuthContext)?.auth
  const config = useContext(AuthContext)?.config
  return authInfo(auth, config).user
}

export function useAuthStatus() {
  const auth = useContext(AuthContext)?.auth
  const config = useContext(AuthContext)?.config
  const info = authInfo(auth, config)
  return info
}

function authInfo(auth, config) {
  if (typeof auth === "undefined" || config?.status !== 200) {
    return { initialised: false }
  }
  const isAuthenticated =
    auth.status === 200 || (auth.status === 401 && auth.meta.is_authenticated)
  const requiresReauthentication = isAuthenticated && auth.status === 401
  const pendingFlow = auth.data?.flows?.find((flow) => flow.is_pending)
  return {
    isAuthenticated,
    requiresReauthentication,
    user: isAuthenticated ? auth.data.user : null,
    pendingFlow,
    initialised: true
  }
}

export const AuthChangeEvent = Object.freeze({
  LOGGED_OUT: "LOGGED_OUT",
  LOGGED_IN: "LOGGED_IN",
  REAUTHENTICATED: "REAUTHENTICATED",
  REAUTHENTICATION_REQUIRED: "REAUTHENTICATION_REQUIRED",
  FLOW_UPDATED: "FLOW_UPDATED"
})

function determineAuthChangeEvent(fromAuth, toAuth, config) {
  let fromInfo = authInfo(fromAuth, config)
  const toInfo = authInfo(toAuth, config)
  if (toAuth.status === 410) {
    return AuthChangeEvent.LOGGED_OUT
  }
  // Corner case: user ID change. Treat as if we're transitioning from anonymous state.
  if (fromInfo.user && toInfo.user && fromInfo.user?.id !== toInfo.user?.id) {
    fromInfo = {
      isAuthenticated: false,
      requiresReauthentication: false,
      user: null
    }
  }
  if (!fromInfo.isAuthenticated && toInfo.isAuthenticated) {
    // You typically don't transition from logged out to reauthentication required.
    return AuthChangeEvent.LOGGED_IN
  }
  if (fromInfo.isAuthenticated && !toInfo.isAuthenticated) {
    return AuthChangeEvent.LOGGED_OUT
  }
  if (fromInfo.isAuthenticated && toInfo.isAuthenticated) {
    if (toInfo.requiresReauthentication) {
      return AuthChangeEvent.REAUTHENTICATION_REQUIRED
    }
    if (fromInfo.requiresReauthentication) {
      return AuthChangeEvent.REAUTHENTICATED
    }
    if (fromAuth.data.methods.length < toAuth.data.methods.length) {
      // If you do a page reload when on the reauthentication page, both fromAuth
      // and toAuth are authenticated, and it won't see the change without this.
      return AuthChangeEvent.REAUTHENTICATED
    }
  } else if (!fromInfo.isAuthenticated && !toInfo.isAuthenticated) {
    const fromFlow = fromInfo.pendingFlow
    const toFlow = toInfo.pendingFlow
    if (toFlow?.id && fromFlow?.id !== toFlow.id) {
      return AuthChangeEvent.FLOW_UPDATED
    }
  }
  // No change.
  return null
}

export function useAuthChange() {
  const auth = useAuth()
  const config = useConfig()
  const ref = useRef({ prevAuth: auth, event: null, didChange: false })
  const [, setForcedUpdate] = useState(0)
  useEffect(() => {
    if (ref.current.prevAuth) {
      ref.current.didChange = true
      const event = determineAuthChangeEvent(ref.current.prevAuth, auth, config)
      if (event) {
        ref.current.event = event
        setForcedUpdate((gen) => gen + 1)
      }
    }
    ref.current.prevAuth = auth
  }, [auth, config])

  const didChange = ref.current.didChange
  if (didChange) {
    ref.current.didChange = false
  }
  const event = ref.current.event
  if (event) {
    ref.current.event = null
  }

  return [auth, event]
}
