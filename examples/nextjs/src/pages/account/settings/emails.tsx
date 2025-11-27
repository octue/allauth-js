import { AuthenticatedRoute } from '@octue/allauth-js/nextjs'
import {
  EmailsTable,
  EmailsTableSkeleton,
  useEmails,
} from '@octue/allauth-js/react'
import { SettingsLayout } from '@/components/layout/SettingsLayout'

function EmailsPage() {
  const { emails, add, remove, makePrimary, verify, loading } = useEmails()

  return (
    <SettingsLayout>
      {loading && emails.length === 0 ? (
        <EmailsTableSkeleton />
      ) : (
        <EmailsTable
          emails={emails}
          add={add}
          remove={remove}
          makePrimary={makePrimary}
          verify={verify}
          disabled={loading}
        />
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
