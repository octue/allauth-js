import { useContext } from 'react'

import type { ConfigurationResponse } from '../../core/types'
import { AuthContext } from '../AuthContext'

export function useConfig(): ConfigurationResponse | undefined {
  return useContext(AuthContext)?.config
}
