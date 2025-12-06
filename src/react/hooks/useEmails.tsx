import { useEffect, useState } from 'react'

import {
  addEmail,
  deleteEmail,
  getEmailAddresses,
  markEmailAsPrimary,
  requestEmailVerification,
} from '../../core'
import type {
  AddEmailResult,
  DeleteEmailResult,
  EmailAddress,
  EmailVerificationResult,
  MarkPrimaryResult,
} from '../../core'

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
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const add = async (email: string): Promise<AddEmailResult> => {
    setLoading(true)
    try {
      const result = await addEmail(email)
      if (result.ok) {
        setEmails(result.data)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const verify = async (email: string): Promise<EmailVerificationResult> => {
    setLoading(true)
    try {
      const result = await requestEmailVerification(email)
      return result
    } finally {
      setLoading(false)
    }
  }

  const remove = async (email: string): Promise<DeleteEmailResult> => {
    setLoading(true)
    try {
      const result = await deleteEmail(email)
      if (result.ok) {
        setEmails(result.data)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const makePrimary = async (email: string): Promise<MarkPrimaryResult> => {
    setLoading(true)
    try {
      const result = await markEmailAsPrimary(email)
      if (result.ok) {
        setEmails(result.data)
      }
      return result
    } finally {
      setLoading(false)
    }
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
