import { useState } from 'react'

import { logout } from '@octue/allauth-js/core'
import {
  ArrowPath,
  Button,
  Logout as LogoutIcon,
  Return as ReturnIcon,
} from '@octue/allauth-js/react'
import { FormLayout } from '@/components/layout/FormLayout'

export default function Logout() {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleClick = () => {
    setLoggingOut(true)
    logout().finally(() => setLoggingOut(false))
  }

  const handleReturn = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <FormLayout
      title="Log out of allauth-js"
      subtitle="Are you sure you want to log out?"
    >
      <div className="flex w-full justify-between space-x-4">
        <Button palette="gray" plain onClick={handleReturn}>
          <ReturnIcon className="mr-2 w-5 h-5" />
          Return to app
        </Button>
        <Button palette="red" disabled={loggingOut} onClick={handleClick}>
          'Log out'
          {loggingOut ? (
            <ArrowPath spin className="ml-2 w-5 h-5" />
          ) : (
            <LogoutIcon className="ml-2 w-5 h-5" />
          )}
        </Button>
      </div>
    </FormLayout>
  )
}
