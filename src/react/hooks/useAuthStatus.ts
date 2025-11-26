import { useContext } from 'react'

import { authInfo } from '../../core'
import { AuthContext } from '../AuthContext'
import type { AuthInfo } from '../../core/types'

export function useAuthStatus(): AuthInfo {
  const ctx = useContext(AuthContext)
  return authInfo(ctx?.auth, ctx?.config)
}
