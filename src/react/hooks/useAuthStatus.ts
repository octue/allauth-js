import { useContext } from 'react'

import { AuthContext } from '../AuthContext'
import { authInfo } from '../allauth'

export function useAuthStatus() {
  const auth = useContext(AuthContext)?.auth
  const config = useContext(AuthContext)?.config
  const info = authInfo(auth, config)
  return info
}
