import { useContext } from 'react'

import { AuthContext } from '../AuthContext'

export function useAuth() {
  //@ts-ignore
  return useContext(AuthContext)?.auth
}
