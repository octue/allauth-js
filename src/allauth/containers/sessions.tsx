import { useEffect, useState } from "react"

import { useConfig } from "@allauth/hooks"
import { endSessions, getSessions } from "@allauth/lib/allauth"
import type { Session } from "@allauth/lib/allauth"
import SessionsTable from "@components/blocks/allauth/SessionsTable"

// TODO REFACTOR REQUEST Move this container logic to a hook, which can then
// be simply used in a reusable library to render a table.

function Sessions() {
  const config = useConfig()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getSessions()
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setSessions(resp.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const otherSessions = sessions.filter((session) => !session.is_current)
  const currentSession = sessions.filter((session) => session.is_current)[0]

  const handleEndSessions = (sessions: Session[]) => {
    setLoading(true)
    endSessions(sessions.map((s) => s.id))
      .then((resp) => {
        if (resp.data) {
          setSessions(resp.data)
        }
      })
      .catch(console.error)
      .then(() => setLoading(false))
  }

  if (currentSession) {
    return (
      <SessionsTable
        currentSession={currentSession}
        otherSessions={otherSessions}
        endSessions={handleEndSessions}
        trackActivity={config.data.usersessions.track_activity}
        disabled={loading}
      />
    )
  }
  return <p>loading sessions</p>
}

export default Sessions
