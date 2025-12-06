import { useState } from 'react'

import { assertNever } from '@octue/allauth-js/core'
import { AuthenticatedRoute } from '@octue/allauth-js/nextjs'
import {
  Button,
  EmailsTable,
  EmailsTableSkeleton,
  useEmails,
} from '@octue/allauth-js/react'
import { toast } from 'react-toastify'
import { Modal } from '@/components/layout/Modal'
import { SettingsLayout } from '@/components/layout/SettingsLayout'
import { AddEmailForm } from '@/containers/forms/AddEmailForm'

function EmailsPage() {
  const [open, setOpen] = useState<boolean>(false)

  const { emails, add, remove, makePrimary, verify, loading } = useEmails()

  // Wrapper that handles results with exhaustive switch
  const handleVerify = async (email: string) => {
    const result = await verify(email)

    switch (result.status) {
      case 200:
        toast.success('Verification email sent!')
        break
      case 400:
        // Display validation errors
        toast.error(result.errors[0]?.message ?? 'Invalid request')
        break
      case 403:
        toast.error('Rate limited. Please wait before trying again.')
        break
      case 429:
        toast.error('Too many requests. Please wait before trying again.')
        break
      default:
        assertNever(result)
    }
  }

  const handleAdd = async (email: string) => {
    const result = await add(email)

    switch (result.status) {
      case 200:
        toast.success('Email added successfully!')
        setOpen(false)
        break
      case 400:
        toast.error(result.errors[0]?.message ?? 'Invalid email address')
        break
      case 401:
        toast.error('Please log in again to add an email address.')
        break
      case 409:
        toast.error('Cannot add email address at this time.')
        break
      case 429:
        toast.error('Too many requests. Please wait before trying again.')
        break
      default:
        assertNever(result)
    }
  }

  const handleRemove = async (email: string) => {
    const result = await remove(email)

    switch (result.status) {
      case 200:
        toast.success('Email removed successfully!')
        break
      case 400:
        toast.error(result.errors[0]?.message ?? 'Could not remove email')
        break
      case 429:
        toast.error('Too many requests. Please wait before trying again.')
        break
      default:
        assertNever(result)
    }
  }

  const handleMakePrimary = async (email: string) => {
    const result = await makePrimary(email)

    switch (result.status) {
      case 200:
        toast.success('Primary email updated!')
        break
      case 400:
        toast.error(
          result.errors[0]?.message ?? 'Could not update primary email'
        )
        break
      case 429:
        toast.error('Too many requests. Please wait before trying again.')
        break
      default:
        assertNever(result)
    }
  }

  return (
    <SettingsLayout>
      {loading && emails.length === 0 ? (
        <EmailsTableSkeleton />
      ) : (
        <>
          <EmailsTable
            emails={emails}
            remove={handleRemove}
            makePrimary={handleMakePrimary}
            verify={handleVerify}
            disabled={loading}
            actions={
              <Button
                onClick={() => setOpen(true)}
                type="button"
                className="mt-4"
              >
                Add email
              </Button>
            }
          />

          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="Add email address"
          >
            <AddEmailForm onClose={() => setOpen(false)} add={handleAdd} />
          </Modal>
        </>
      )}
    </SettingsLayout>
  )
}

export default function Emails() {
  return (
    <AuthenticatedRoute>
      <EmailsPage />
    </AuthenticatedRoute>
  )
}
