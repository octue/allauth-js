import { Button } from '../common/Button'
import { BadgeCheck } from '../icons/BadgeCheck'

export interface Session {
  id?: number
  is_current: boolean
  created_at: string
  ip: string
  user_agent: string
  last_seen_at: string
}

export interface SessionsTableProps {
  className?: string
  currentSession: Session
  otherSessions: Session[]
  endSessions: (sessions: Session[]) => void
  trackActivity: boolean
  disabled: boolean
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  className,
  currentSession,
  otherSessions,
  endSessions,
  trackActivity,
  disabled,
}) => {
  const sessions = [currentSession, ...otherSessions]

  return (
    <div className={`bg-white px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Current sessions
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            All the places you are signed in. You can use this table to log out
            of other computers remotely.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            disabled={disabled || otherSessions.length <= 1}
            onClick={() => endSessions(otherSessions)}
          >
            Log out all other sessions
          </Button>
        </div>
      </div>
      <div className="mt-8 flow-root ">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Current
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Login time
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    IP
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Browser
                  </th>
                  {trackActivity && (
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Last seen
                    </th>
                  )}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.created_at}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-theme-600 sm:pl-0">
                      {session.is_current ? <BadgeCheck /> : ''}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                      {new Date(
                        Number(session.created_at) * 1000
                      ).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {session.ip}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {session.user_agent}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(
                        Number(session.last_seen_at) * 1000
                      ).toLocaleString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        type="button"
                        className="text-theme-600 hover:text-theme-800 disabled:text-gray-400"
                        disabled={disabled}
                        onClick={() => endSessions([session])}
                      >
                        Log out
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
