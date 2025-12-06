import { zodResolver } from '@hookform/resolvers/zod'
import { requestLoginCode } from '@octue/allauth-js/core'
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
import { OrLine } from '@/components/forms/OrLine'
import { FormLayout } from '@/components/layout/FormLayout'

const schema = z.object({
  email: z.email('Invalid email address'),
})

interface FormData {
  email: string
}

function LoginCode() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await requestLoginCode(data.email)
      if (response?.status === 401) {
        toast.success('Sent login code to email')
        router.push('/account/login/code/confirm')
      } else if (response?.errors) {
        setError('root', {
          type: 'custom',
          message: response.errors,
        })
      }
    } catch (error) {
      console.error(error)
      setError('root', {
        type: 'custom',
        message: 'An error occurred. Please try again.',
      })
    }
  }

  return (
    <FormLayout title="Send login code">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <ErrorBox error={errors?.root?.message as FieldError | undefined} />

        <InputGroup
          label="Email"
          id="email"
          type="email"
          error={errors?.email?.message}
          {...register('email')}
          required
          autoComplete="email"
        >
          <Link
            className="-mb-1 ml-2 mt-1 text-xs text-theme-600 hover:text-theme-500 dark:text-theme-300"
            href="/account/login"
          >
            Use password instead
          </Link>
        </InputGroup>

        <Button
          size="lg"
          type="submit"
          className="!mt-10 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending code...' : 'Send code'}
        </Button>
      </form>

      <OrLine />

      <Button
        size="lg"
        palette="gray"
        outlined
        type="submit"
        className="wt-full"
        href="/account/login"
      >
        Login with password
      </Button>
    </FormLayout>
  )
}

export default function AnonymousLoginCode({ ...pageProps }) {
  return (
    <AnonymousRoute loading={<LoadingOverlay />}>
      <LoginCode {...pageProps} />
    </AnonymousRoute>
  )
}
