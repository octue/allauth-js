import { useEffect, useState } from 'react'

import {
  assertNever,
  getEmailVerification,
  verifyEmail,
} from '@octue/allauth-js/core'
import { Button } from '@octue/allauth-js/react'
import { useRouter } from 'next/router'
import { type FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { LoadingOverlay } from '@/components/core/LoadingOverlay'
import { ErrorBox } from '@/components/forms/ErrorBox'
import { FormLayout } from '@/components/layout/FormLayout'

export default function VerifyEmail() {
  const [verifying, setVerifying] = useState(true)
  const [verification, setVerification] = useState(Object)

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm()

  const router = useRouter()
  const key = Array.isArray(router.query.key)
    ? router.query.key[0]
    : router.query.key
  console.log('key', key, router.query.key)
  useEffect(() => {
    if (!key) return
    setVerifying(true)
    getEmailVerification(key)
      .then((result) => {
        if (result.status === 200) {
          setVerification(result)
        }
      })
      .catch(console.error)
      .finally(() => setVerifying(false))
  }, [key])

  const onSubmit = async () => {
    if (!key) return

    try {
      const result = await verifyEmail(key)

      switch (result.status) {
        case 200:
          toast.success('Verified email')
          router.push('/account/login')
          break
        case 401:
          // Email verified but not logged in
          toast.success('Verified email')
          router.push('/account/login')
          break
        case 400:
          setError('root.nonFieldError', {
            type: 'custom',
            message: result.errors[0]?.message ?? 'Invalid verification code',
          })
          break
        case 409:
          toast.error(
            'Your email verification code is invalid or expired. Please try again'
          )
          router.push('/settings/security')
          break
        default:
          assertNever(result)
      }
    } catch (error) {
      console.error(error)
      setError('root.nonFieldError', {
        type: 'custom',
        message: 'An error occurred. Please try again.',
      })
    }
  }

  if (verifying) {
    return <LoadingOverlay />
  }

  return (
    <FormLayout title="Verify email">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {!verification?.data?.email && (
          <div>
            <p>Your email verification code is invalid or expired</p>
            <Button size="lg" className="mt-3" palette="allauth" href="/">
              Back to homepage
            </Button>
          </div>
        )}
        <ErrorBox
          error={errors?.root?.nonFieldError as FieldError | undefined}
        />
        {verification?.data?.email && (
          <div>
            <p>
              Please confirm that{' '}
              <b>
                <a href={`mailto:${verification?.data?.email}`}>
                  {verification?.data?.email}
                </a>{' '}
              </b>
              is an email address for user{' '}
              <b>{verification?.data?.user.username}</b>.
            </p>
            <Button
              size="lg"
              type="submit"
              className="mt-3 w-full"
              disabled={isSubmitting}
            >
              Confirm
            </Button>
          </div>
        )}
      </form>
    </FormLayout>
  )
}
