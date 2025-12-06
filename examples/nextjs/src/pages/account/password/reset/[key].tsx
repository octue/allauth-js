import { zodResolver } from '@hookform/resolvers/zod'
import { assertNever, resetPassword } from '@octue/allauth-js/core'
import { AnonymousRoute } from '@octue/allauth-js/nextjs'
import { Button } from '@octue/allauth-js/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { LoadingOverlay } from '@/components/core/LoadingOverlay'
import { ErrorBox } from '@/components/forms/ErrorBox'
import { InputGroup } from '@/components/forms/fields/InputGroup'
import { FormLayout } from '@/components/layout/FormLayout'

const MIN_PASSWORD_LENGTH = 8

const schema = z.object({
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    ),
})

interface FormData {
  password: string
}

function PasswordResetKey() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const router = useRouter()
  const key = Array.isArray(router.query.key)
    ? router.query.key[0]
    : router.query.key

  const onSubmit = async (data: FormData) => {
    if (!key) return

    try {
      const result = await resetPassword(data.password, key)

      switch (result.status) {
        case 200:
          toast.success('Reset password successfully')
          router.push('/account/login')
          break
        case 401:
          // Password reset but not logged in - redirect to login
          toast.success('Reset password successfully')
          router.push('/account/login')
          break
        case 400:
          result.errors.forEach((err) => {
            if (err.param === 'password') {
              setError('password', {
                type: 'custom',
                message: err.message,
              })
            } else {
              setError('root.nonFieldError', {
                type: 'custom',
                message: err.message,
              })
            }
          })
          break
        case 409:
          toast.error('Your reset code is invalid or expired. Please try again')
          router.push('/account/password/reset')
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

  return (
    <FormLayout title="Reset password">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <ErrorBox
          error={errors?.root?.nonFieldError as FieldError | undefined}
        />
        <InputGroup
          label="New password"
          id="password"
          error={errors?.password?.message}
          {...register('password')}
          autoComplete={'new-password'}
          type="password"
          required
        >
          <Link
            className="-mb-1 ml-2 mt-1 text-xs text-theme-600 hover:text-theme-500 dark:text-theme-300"
            href="/account/login"
          >
            Back to login
          </Link>
        </InputGroup>
        <Button
          size="lg"
          type="submit"
          className="!mt-10 w-full"
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </form>
    </FormLayout>
  )
}

// TODO Either use server side props, or an initial fetch, to determine if the key
// import { getPasswordReset, resetPassword } from '@modules/allauth/lib/allauth'
// is valid prior to asking user for their new password.
// export async function getServerSideProps(context) {
//     const key = context.params.key
//     const resp = await getPasswordReset(key)
//     return { props: { key, keyResponse: resp } }
//   }

/* TODO REFACTOR REQUEST Anonymous pages should be routed using next middleware
 * See _app.tsx
 */
export default function AnonymousPasswordResetKey({ ...pageProps }) {
  return (
    <AnonymousRoute loading={<LoadingOverlay />}>
      <PasswordResetKey {...pageProps} />
    </AnonymousRoute>
  )
}
