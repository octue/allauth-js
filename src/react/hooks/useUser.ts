import { useContext } from 'react'

import { authInfo } from '../../core'
import type { User } from '../../core/types'
import { AuthContext } from '../AuthContext'

export interface UseUserResult {
  user: User | null
  loading: boolean
}

export function useUser(): UseUserResult {
  const ctx = useContext(AuthContext)
  const info = authInfo(ctx?.auth, ctx?.config)

  return {
    user: info.user ?? null,
    loading: info.isLoading,
  }
}
