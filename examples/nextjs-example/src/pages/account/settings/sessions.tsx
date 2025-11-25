import { AuthenticatedRoute } from "@octue/allauth-js/nextjs"
import { SessionsTable, SessionsTableSkeleton, useSessions } from "@octue/allauth-js/react"
import { SettingsLayout } from "@/components/layout/SettingsLayout"

function SessionsPage() {
  const { currentSession, otherSessions, endSessions, trackActivity, loading } = useSessions()

  return (
    <SettingsLayout>
      {!currentSession || loading ? (
        <SessionsTableSkeleton />
      ) : (
        <SessionsTable
          currentSession={currentSession}
          otherSessions={otherSessions}
          endSessions={endSessions}
          trackActivity={trackActivity}
          disabled={loading}
        />
      )}
    </SettingsLayout>
  )
}

export default function Sessions() {
  return (
    <AuthenticatedRoute>
      <SessionsPage />
    </AuthenticatedRoute>
  )
}
