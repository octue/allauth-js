import type { ReactNode } from 'react'

import { Button } from '../common/Button'
import { ArrowPath } from '../icons/ArrowPath'
import { ArrowUpOnSquare } from '../icons/ArrowUpOnSquare'
import { BadgeCheck } from '../icons/BadgeCheck'
import { Envelope } from '../icons/Envelope'
import { ExclamationTriangle } from '../icons/ExclamationTriangle'
import { Trash } from '../icons/Trash'

interface Email {
  email: string
  primary: boolean
  verified: boolean
  verifying?: boolean
  makingPrimary?: boolean
  removing?: boolean
}

export interface EmailsTableProps {
  className?: string
  disabled: boolean
  emails: Email[]
  makePrimary: (email: string) => void
  remove: (email: string) => void
  verify: (email: string) => void
  actions?: ReactNode | null
}

export const EmailsTable = ({
  className,
  emails,
  makePrimary,
  verify,
  remove,
  disabled,
  actions = null,
}: EmailsTableProps) => {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Email addresses
          </h1>
          <p className="w-1/3 sm:w-1/2 xlg:w-full mt-2 text-sm text-gray-700">
            Email addresses linked to your account. Add or remove addresses, or
            request verification from this table.
          </p>
          {actions}
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
                    Email
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Verification status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {emails.map((email) => (
                  <tr key={email.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                      <div className="flex items-center">
                        {email.email}
                        {email.primary && (
                          <span className="ml-5 inline-flex items-center rounded-md bg-allauth-50/60 px-2 py-1 text-xs font-medium text-allauth-700 ring-1 ring-inset ring-allauth-600/20">
                            Primary
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                      {email.verified ? (
                        <div className="flex items-center text-green-600">
                          <BadgeCheck />
                          <span className="ml-2">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600">
                          <ExclamationTriangle></ExclamationTriangle>
                          <span className="ml-2">Unverified</span>
                        </div>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <div className="flex flex-row justify-end">
                        {!email.verified && (
                          <Button
                            size="sm"
                            plain
                            type="button"
                            disabled={disabled || email.verifying}
                            onClick={() => verify(email.email)}
                          >
                            Verify
                            {email.verifying ? (
                              <ArrowPath className="h-5 w-5" spin />
                            ) : (
                              <Envelope className="h-5 w-5" />
                            )}
                          </Button>
                        )}
                        {!email.primary && (
                          <Button
                            size="sm"
                            plain
                            type="button"
                            disabled={
                              disabled || !email.verified || email.makingPrimary
                            }
                            onClick={() => makePrimary(email.email)}
                          >
                            Make primary
                            {email.makingPrimary ? (
                              <ArrowPath className="h-5 w-5" spin />
                            ) : (
                              <ArrowUpOnSquare className="h-5 w-5" />
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          type="button"
                          plain
                          disabled={disabled || email.primary || email.removing}
                          onClick={() => remove(email.email)}
                        >
                          Remove
                          {email.removing ? (
                            <ArrowPath className="h-5 w-5" spin />
                          ) : (
                            <Trash className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
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
