import { useContext } from 'react'

import { authInfo } from '../../core'
import type { AuthInfo } from '../../core/types'
import { AuthContext } from '../AuthContext'

export function useAuthStatus(): AuthInfo {
  const ctx = useContext(AuthContext)
  return authInfo(ctx?.auth, ctx?.config)
}
