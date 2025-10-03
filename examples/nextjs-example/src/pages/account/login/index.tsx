// import { useConfig } from '@modules/allauth/hooks'
import { Button } from "@components/core/Button";
import { ErrorBox } from "@components/forms/ErrorBox";
import InputGroup from "@components/forms/fields/InputGroup";
import { FormLayout } from "@components/layout/FormLayout";
import { LogoTitle } from "@components/layout/LogoTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { MIN_PASSWORD_LENGTH } from "@modules/allauth/constants";
import useSetErrors from "@modules/allauth/hooks/useSetErrors";
import { login } from "@modules/allauth/lib/allauth";
import { AnonymousRoute } from "@modules/allauth/routing";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";

import Link from "next/link";

// import ProviderList from '../../../socialaccount/ProviderList'

// Define the validation schema
const schema = z.object({
  email: z.string().email("Invalid email address"),
  // username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    )
});

// Define the form data type
interface FormData {
  username: string;
  email: string;
  password: string;
}

function Login() {
  // const config = useConfig()

  // const hasProviders = config.data.socialaccount?.providers?.length > 0

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const setErrors = useSetErrors<FormData>(setError);

  // Reset the form values if new data is received (e.g. from API refresh)
  // Note: not relevant for login forms, typically for things like user settings which are now done all over graph
  // useEffect(() => {
  //   reset(defaultValues)
  // }, [reset, defaultValues])

  // Submit data to login handler
  const onSubmit = (data: FormData) => {
    login(data).then(setErrors).catch(console.error);
  };

  return (
    <FormLayout>
      <LogoTitle title="Log in to Strands" />
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <ErrorBox
          error={errors?.root?.nonFieldError as FieldError | undefined}
        />
        <InputGroup
          label="Email"
          id="email"
          error={errors?.email?.message}
          {...register("email")}
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
          {...register("password")}
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
        <Button type="submit" className="!mt-10 w-full" disabled={isSubmitting}>
          Log in
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
        href="/account/login/code"
      >
        Email me a login code
      </Link>
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
  );
}

/* TODO REFACTOR REQUEST Anonymous pages should be routed using next middleware
 * See _app.tsx
 */
export default function AnonymousLogin({ ...pageProps }) {
  return (
    <AnonymousRoute>
      <Login {...pageProps} />
    </AnonymousRoute>
  );
}
