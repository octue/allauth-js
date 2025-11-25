import { useEffect, useRef, useState } from 'react'

import { determineAuthChangeKind } from '../../core'
import type { AuthResponse } from '../../core/types'
import { useAuth } from './useAuth'
import { useConfig } from './useConfig'

export const useAuthChange = () => {
  const auth = useAuth()
  const config = useConfig()
  const ref = useRef<{
    prevAuth: AuthResponse | undefined
    event: string | null
    didChange: boolean
  }>({ prevAuth: auth, event: null, didChange: false })
  const [, setForcedUpdate] = useState(0)
  useEffect(() => {
    if (ref.current.prevAuth && auth && config) {
      ref.current.didChange = true
      const event = determineAuthChangeKind(ref.current.prevAuth, auth, config)
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

  return [auth, event] as const
}
