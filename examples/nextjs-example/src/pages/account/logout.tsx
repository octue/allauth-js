import { useState } from 'react'

import { logout } from '@octue/allauth-js/core'
import {
  Button,
  Logout as LogoutIcon,
  Return as ReturnIcon,
} from '@octue/allauth-js/react'
import { useRouter } from 'next/router'
import { FormLayout } from '@/components/layout/FormLayout'

export default function Logout() {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleClick = () => {
    setLoading(true)
    logout()
      .then(() => {
        router.push('/')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
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
      <div className="flex w-full justify-end space-x-4">
        <Button palette="gray" plain onClick={handleReturn}>
          <ReturnIcon className="mr-2 w-4 h-4" />
          Return to app
        </Button>
        <Button palette="red" disabled={loading} onClick={handleClick}>
          {loading ? 'Logging out...' : 'Log out'}
          <LogoutIcon className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </FormLayout>
  )
}
