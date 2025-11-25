import { zodResolver } from '@hookform/resolvers/zod'
import { resetPassword } from '@octue/allauth-js/core'
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

  const setErrors = useSetErrors<FormData>(setError)
  const router = useRouter()
  const { key } = router.query

  const onSubmit = (data: FormData) => {
    resetPassword(data.password, key)
      .then((response) => {
        console.log(response)
        if ([200, 401].includes(response.status)) {
          toast.success('Reset password successfully')
          router.push('/account/login')
        } else {
          toast.error('Your reset code is invalid or expired. Please try again')
          router.push('/account/password/reset')
        }

        return response
      })
      .catch((error) => {
        console.error(error)
        if (error.fieldErrors) {
          setErrors(error.fieldErrors)
        }
      })
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
        <Button type="submit" className="!mt-10 w-full" disabled={isSubmitting}>
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
    <AnonymousRoute>
      <PasswordResetKey {...pageProps} />
    </AnonymousRoute>
  )
}
