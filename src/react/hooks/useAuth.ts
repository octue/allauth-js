import { useContext } from 'react'

import { AuthContext } from '../AuthContext'
import type { AuthResponse } from '../../core/types'

export function useAuth(): AuthResponse | undefined {
  return useContext(AuthContext)?.auth
}
