import { useContext } from 'react'

import { authInfo } from '../../core'
import { AuthContext } from '../AuthContext'

export function useUser() {
  //@ts-ignore
  const auth = useContext(AuthContext)?.auth
  //@ts-ignore
  const config = useContext(AuthContext)?.config
  return authInfo(auth, config).user
}
