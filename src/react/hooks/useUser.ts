import { useContext } from 'react'

import { AuthContext } from '../AuthContext'

export function useUser() {
  const auth = useContext(AuthContext)?.auth
  const config = useContext(AuthContext)?.config
  return authInfo(auth, config).user
}
