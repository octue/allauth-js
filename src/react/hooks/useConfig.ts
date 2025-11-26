import { useContext } from 'react'

import { AuthContext } from '../AuthContext'
import type { ConfigurationResponse } from '../../core/types'

export function useConfig(): ConfigurationResponse | undefined {
  return useContext(AuthContext)?.config
}
