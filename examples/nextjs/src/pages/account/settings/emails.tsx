import { useState } from 'react'

import { AuthenticatedRoute } from '@octue/allauth-js/nextjs'
import {
  Button,
  EmailsTable,
  EmailsTableSkeleton,
  useEmails,
} from '@octue/allauth-js/react'
import { Modal } from '@/components/layout/Modal'
import { SettingsLayout } from '@/components/layout/SettingsLayout'
import { AddEmailForm } from '@/containers/forms/AddEmailForm'

function EmailsPage() {
  const [open, setOpen] = useState<boolean>(false)

  const { emails, add, remove, makePrimary, verify, loading } = useEmails()

  return (
    <SettingsLayout>
      {loading && emails.length === 0 ? (
        <EmailsTableSkeleton />
      ) : (
        <>
          <EmailsTable
            emails={emails}
            add={add}
            remove={remove}
            makePrimary={makePrimary}
            verify={verify}
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
            <AddEmailForm onClose={() => setOpen(false)} add={add} />
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
