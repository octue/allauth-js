import { useContext } from 'react'

import type { AuthResponse } from '../../core/types'
import { AuthContext } from '../AuthContext'

export function useAuth(): AuthResponse | undefined {
  return useContext(AuthContext)?.auth
}
