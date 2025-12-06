import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@octue/allauth-js/core'
import { AnonymousRoute } from '@octue/allauth-js/nextjs'
import { Button, useSetErrors } from '@octue/allauth-js/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoadingOverlay } from '@/components/core/LoadingOverlay'
import { ErrorBox } from '@/components/forms/ErrorBox'
import { InputGroup } from '@/components/forms/fields/InputGroup'
import { OrLine } from '@/components/forms/OrLine'
import { FormLayout } from '@/components/layout/FormLayout'

const MIN_PASSWORD_LENGTH = 8

// import ProviderList from '../../../socialaccount/ProviderList'

// Define the validation schema according to your allauth configuration. It looks like this:
const schema = z.object({
  email: z.email('Invalid email address'),
  // username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    ),
})

// Define the form data type based on the schema
type FormData = z.infer<typeof schema>

function Login() {
  // You can use the following to discover what providers are supported...
  // But we don't recommend it in production, because it causes a longer loading
  // flash before your auth pages are rendered. It's not something that changes
  // frequently so you're much better off hardcoding it.

  // const config = useConfig()
  // const hasProviders = config.data.socialaccount?.providers?.length > 0

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const setErrors = useSetErrors<FormData>(setError)

  const onSubmit = (data: FormData) => {
    login(data).then(setErrors).catch(console.error)
  }

  return (
    <FormLayout title="Log in to allauth-js">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <ErrorBox
          errors={
            errors?.root?.nonFieldError?.message
              ? [errors.root.nonFieldError.message]
              : undefined
          }
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
            href="/account/signup"
          >
            Not registered yet?
          </Link>
        </InputGroup>

        <InputGroup
          label="Password"
          id="password"
          type="password"
          error={errors?.password?.message}
          {...register('password')}
          autoComplete="current-password"
          required
        >
          <Link
            className="-mb-1 ml-2 mt-1 text-xs text-theme-600 hover:text-theme-500 dark:text-theme-300"
            href="/account/password/reset"
          >
            Forgot password?
          </Link>
        </InputGroup>
        <Button
          type="submit"
          className="mt-10! w-full font-semibold"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
      <OrLine />
      <Button outlined size="lg" palette="gray" href="/account/login/code">
        Email me a login code
      </Button>
      {/* {hasProviders ? (
        <>
          <h2>Or use a third-party</h2>
          <ProviderList callbackURL="/account/provider/callback" />
        </>
      ) : null} */}
      {/* <FormLinkLine
        href="/account/signup"
        purpose="No account?"
        action="Sign up here."
      /> */}
    </FormLayout>
  )
}

/* TODO REFACTOR REQUEST Anonymous pages should ideally be routed using
 * next middleware, this client-side process isn't ideal for SSR
 * See _app.tsx
 */
export default function AnonymousLogin({ ...pageProps }) {
  return (
    <AnonymousRoute loading={<LoadingOverlay />}>
      <Login {...pageProps} />
    </AnonymousRoute>
  )
}
