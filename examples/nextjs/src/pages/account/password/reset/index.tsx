import { zodResolver } from '@hookform/resolvers/zod'
import { assertNever, requestPasswordReset } from '@octue/allauth-js/core'
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

const schema = z.object({
  email: z.email('Invalid email address'),
})

interface FormData {
  email: string
}

function PasswordReset() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const result = await requestPasswordReset(data.email)

      switch (result.status) {
        case 200:
          toast.success('Sent password reset link')
          router.push('/account/login')
          break
        case 401:
          // Code-based flow - pending flow handled by auth change event
          toast.success('Password reset initiated')
          break
        case 400:
          result.errors.forEach((err) => {
            if (err.param === 'email') {
              setError('email', {
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
    <FormLayout title="Request password reset">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <ErrorBox
          error={errors?.root?.nonFieldError as FieldError | undefined}
        />
        <InputGroup
          label="Email"
          id="email"
          error={errors?.email?.message}
          {...register('email')}
          autoComplete="email"
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
          type="submit"
          size="lg"
          className="mt-6! w-full"
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </form>
    </FormLayout>
  )
}

/* TODO REFACTOR REQUEST Anonymous pages should be routed using next middleware
 * See _app.tsx
 */
export default function AnonymousPasswordReset({ ...pageProps }) {
  return (
    <AnonymousRoute loading={<LoadingOverlay />}>
      <PasswordReset {...pageProps} />
    </AnonymousRoute>
  )
}
