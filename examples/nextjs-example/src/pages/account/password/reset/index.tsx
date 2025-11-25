import { zodResolver } from '@hookform/resolvers/zod'
import { requestPasswordReset } from '@octue/allauth-js/core'
import { AnonymousRoute } from '@octue/allauth-js/nextjs'
import { Button, useSetErrors } from '@octue/allauth-js/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
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

  const setErrors = useSetErrors<FormData>(setError)
  const router = useRouter()

  const onSubmit = (data: FormData) => {
    requestPasswordReset(data.email).then(setErrors).catch(console.error)
    toast.success('Sent password reset link')
    router.push('/account/login')
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
          className="mt-10! max-w-full"
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
    <AnonymousRoute>
      <PasswordReset {...pageProps} />
    </AnonymousRoute>
  )
}
