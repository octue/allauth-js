import { useEffect, useState } from "react"

import {
  addEmail,
  deleteEmail,
  getEmailAddresses,
  markEmailAsPrimary,
  requestEmailVerification
} from "@allauth/lib/allauth"
import type { EmailAddress } from "@allauth/lib/allauth"
import EmailsTable from "@components/blocks/allauth/EmailsTable"

// TODO REFACTOR REQUEST Move this container logic to a hook, which can then
// be simply used in a reusable library to render a table.

const Emails = () => {
  const [emailAddresses, setEmailAddresses] = useState<EmailAddress[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getEmailAddresses()
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmailAddresses(resp.data)
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleAdd = (email: string) => {
    setLoading(true)
    addEmail(email)
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmailAddresses(resp.data)
        }
        // TODO Manage what happened
      })
      .catch((e) => {
        // TODO Display toast that something went wrong
        console.error(e)
      })
      .then(() => {
        setLoading(false)
      })
  }

  //   TODO disambiguate the state for each of these handlers
  const handleRequestVerification = (email: string) => {
    setLoading(true)
    requestEmailVerification(email)
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDelete = (email: string) => {
    setLoading(true)
    deleteEmail(email)
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmailAddresses(resp.data)
        }
        // TODO handle errors
      })
      .catch((e) => {
        // TODO Display toast
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleMakePrimary = (email: string) => {
    setLoading(true)
    markEmailAsPrimary(email)
      .then((resp) => {
        if (resp.status === 200 && resp.data) {
          setEmailAddresses(resp.data)
        }
        // TODO Handle errors
      })
      .catch((e) => {
        // TODO Display toast
        console.error(e)
      })
      .then(() => {
        setLoading(false)
      })
  }

  return (
    <EmailsTable
      emails={emailAddresses}
      add={handleAdd}
      makePrimary={handleMakePrimary}
      remove={handleDelete}
      verify={handleRequestVerification}
      disabled={loading}
    />
  )
}

export default Emails
