import { useContext } from 'react'

import { AuthContext } from '../AuthContext'

export function useConfig() {
  //@ts-ignore
  return useContext(AuthContext)?.config
}
