import { useEffect, useState } from 'react'

import {
  addEmail,
  deleteEmail,
  getEmailAddresses,
  markEmailAsPrimary,
  requestEmailVerification,
} from '../../core'
import type { EmailAddress } from '../../core'

export const useEmails = () => {
  const [emails, setEmails] = useState<EmailAddress[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getEmailAddresses()
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmails(resp.data)
        }
        // TODO Accept an error handler
      })
      .catch((e) => {
        // TODO Accept an error handler
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const add = (email: string) => {
    setLoading(true)
    addEmail(email)
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmails(resp.data)
        }
        // TODO Accept an error handler
      })
      .catch((e) => {
        // TODO Accept an error handler
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  //   TODO disambiguate the state for each of these handlers
  const verify = (email: string) => {
    setLoading(true)
    requestEmailVerification(email)
      .catch((e) => {
        // TODO Accept an error handler
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const remove = (email: string) => {
    setLoading(true)
    deleteEmail(email)
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmails(resp.data)
        }
      })
      .catch((e) => {
        // TODO Accept an error handler
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const makePrimary = (email: string) => {
    setLoading(true)
    markEmailAsPrimary(email)
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmails(resp.data)
        }
        // TODO Accept an error handler
      })
      .catch((e) => {
        // TODO Accept an error handler
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    emails,
    add,
    makePrimary,
    remove,
    verify,
    loading,
  }
}
