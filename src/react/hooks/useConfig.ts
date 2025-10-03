import { useContext } from 'react'

import { AuthContext } from '../AuthContext'

export function useConfig() {
  return useContext(AuthContext)?.config
}
