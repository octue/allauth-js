import { zodResolver } from '@hookform/resolvers/zod'
import { signUp } from '@octue/allauth-js/core'
import { AnonymousRoute } from '@octue/allauth-js/nextjs'
import { Button, useSetErrors } from '@octue/allauth-js/react'
import { track } from '@vercel/analytics'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoadingOverlay } from '@/components/core/LoadingOverlay'
import { ErrorBox } from '@/components/forms/ErrorBox'
import { InputGroup } from '@/components/forms/fields/InputGroup'
import { FormLayout } from '@/components/layout/FormLayout'

const MIN_PASSWORD_LENGTH = 8

// import ProviderList from '../../socialaccount/ProviderList'

// Define the form data type
interface FormData {
  username: string
  email: string
  password: string
}

// Define the validation schema
const schema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    ),
})

const trackSignUp = (response: { errors?: unknown }) => {
  if (!response?.errors) {
    track('Signup Success')
  }
}

function SignUp() {
  // const config = useConfig();
  // const hasProviders = config.data.socialaccount?.providers?.length > 0

  const {
    register,
    handleSubmit,
    setError,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const setErrors = useSetErrors<FormData>(setError)

  const onSubmit = (data: FormData) => {
    signUp<FormData>(data).then(setErrors).then(trackSignUp)
  }

  return (
    <FormLayout title="Sign up to allauth-js">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <ErrorBox
          errors={
            errors?.root?.nonFieldError?.message
              ? [errors.root.nonFieldError.message]
              : undefined
          }
        />

        <InputGroup
          help="Choose a public username that people can use to find your profile. Tip: Use your github account handle if you have one!"
          label="User Handle"
          error={errors?.username?.message}
          id="username"
          {...register('username')}
          // autoComplete="username"
          required
        >
          <Link
            className="-mb-1 ml-2 mt-1 text-xs text-theme-600 hover:text-theme-500 dark:text-theme-300"
            href="/account/login"
          >
            Already registered? Log in!
          </Link>
        </InputGroup>

        <InputGroup
          help="You'll use your email address to sign in later"
          label="Email address"
          error={errors?.email?.message}
          id="email"
          type="email"
          {...register('email')}
          autoComplete="email"
          required
        />

        <InputGroup
          help="Set a strong password to access your account."
          label="Password"
          error={errors?.password?.message}
          id="password"
          type="password"
          {...register('password')}
          autoComplete="new-password"
          required
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isSubmitting && !isDirty}
        >
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>

      {/* {hasProviders ? (
        <>
          <h2>Or use a third-party</h2>
          <ProviderList callbackURL="/account/provider/callback" />
        </>
      ) : null} */}
    </FormLayout>
  )
}

/* TODO REFACTOR REQUEST Anonymous pages should be routed using next middleware
 * See _app.tsx
 */
export default function AnonymousSignUp({ ...pageProps }) {
  return (
    <AnonymousRoute loading={<LoadingOverlay />}>
      <SignUp {...pageProps} />
    </AnonymousRoute>
  )
}

// TODO Refactoring anonymous routes to server side may look a bit like this
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // this is there you get the user session from the allauth app endpoint
//   // const session = await getServerSession(context.req, context.res, authOptions);

//   // If the user is already logged in, redirect
//   // if (session) {
//   //   return { redirect: { destination: "/" } };
//   // }

//   return {
//     props: {},
//   };
// }
