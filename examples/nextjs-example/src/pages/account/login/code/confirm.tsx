import { Button } from "@components/core/Button";
import { ErrorBox } from "@components/forms/ErrorBox";
import InputGroup from "@components/forms/fields/InputGroup";
import { FormLayout } from "@components/layout/FormLayout";
import { LogoTitle } from "@components/layout/LogoTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStatus } from "@modules/allauth/hooks";
import useSetErrors from "@modules/allauth/hooks/useSetErrors";
import { Flows, confirmLoginCode } from "@modules/allauth/lib/allauth";
import { AnonymousRoute } from "@modules/allauth/routing";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "react-hook-form";
import { z } from "zod";

const codeErrorMessage = "Code must be 6 characters long";

const schema = z.object({
  code: z.string().min(6, codeErrorMessage).max(6, codeErrorMessage)
});

interface FormData {
  code: string;
}

function LoginCodeConfirm() {
  const authStatus = useAuthStatus();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const setErrors = useSetErrors<FormData>(setError);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await confirmLoginCode(data.code);

      if (![200, 401].includes(response.status)) {
        setErrors(response);
      }
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "custom",
        message: "An error occurred. Please try again."
      });
    }
  };

  useEffect(() => {
    if (authStatus.pendingFlow?.id !== Flows.LOGIN_BY_CODE) {
      router.push("/account/login/code");
    }
  }, [authStatus, router]);

  return (
    <FormLayout>
      <LogoTitle title="Enter login code" />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <ErrorBox error={errors?.root?.message as FieldError | undefined} />
        <InputGroup
          label="Code"
          id="code"
          error={errors?.code?.message}
          {...register("code")}
          required
        />
        <br />
        The code expires shortly, so please enter it soon.
        <Button type="submit" className="!mt-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Log in"}
        </Button>
      </form>
    </FormLayout>
  );
}

export default function AnonymousLoginCodeConfirm({ ...pageProps }) {
  return (
    <AnonymousRoute>
      <LoginCodeConfirm {...pageProps} />
    </AnonymousRoute>
  );
}
