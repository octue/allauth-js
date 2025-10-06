import { useEffect, useState } from 'react'

import { endSessions, getSessions, type Session } from '../../core'
import { useConfig } from './useConfig'

export const useSessions = () => {
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
        // TODO Accept an error handler
      })
      .catch(console.error) // TODO Accept an error handler
      .finally(() => setLoading(false))
  }, [])

  const otherSessions = sessions.filter((session) => !session.is_current)
  const currentSession = sessions.filter((session) => session.is_current)[0]

  const _endSessions = (sessions: Session[]) => {
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

  return {
    currentSession,
    otherSessions,
    endSessions: _endSessions,
    trackActivity: config.data.usersessions.track_activity,
    loading,
  }
}
