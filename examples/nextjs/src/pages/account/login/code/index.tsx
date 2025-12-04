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
import { FormLayout } from '@/components/layout/FormLayout'

const schema = z.object({
  email: z.string().email('Invalid email address'),
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

        <Button type="submit" className="!mt-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending code...' : 'Send code'}
        </Button>
      </form>

      <div className="my-6 flex w-full items-center px-8">
        <div className="h-[1px] flex-grow bg-gray-300 dark:bg-white/70" />
        <span className="px-6 text-sm font-light text-gray-400 dark:text-white/70">
          Or
        </span>
        <div className="h-[1px] flex-grow bg-gray-300 dark:bg-white/70" />
      </div>

      <Link
        className="mt-4 flex items-center justify-center rounded-md border border-theme-600 bg-none px-6 py-1.5 text-sm font-normal leading-6 text-theme-600 shadow-sm hover:border-theme-500 hover:bg-theme-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-500"
        href="/account/signup"
      >
        Create an account
      </Link>
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
