import { useContext } from 'react'

import { AuthContext } from '../AuthContext'
import { authInfo } from '../../core'

export function useAuthStatus() {
  //@ts-ignore
  const auth = useContext(AuthContext)?.auth
  //@ts-ignore
  const config = useContext(AuthContext)?.config
  const info = authInfo(auth, config)
  return info
}
