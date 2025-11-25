import { Button } from "@octue/allauth-js/react";
import { LoadingOverlay } from "@/components/core/LoadingOverlay";
import { ErrorBox } from "@/components/forms/ErrorBox";
import { FormLayout } from "@/components/layout/FormLayout";
import { useSetErrors } from "@octue/allauth-js/react";
import {
  getEmailVerification,
  verifyEmail
} from "@octue/allauth-js/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [verifying, setVerifying] = useState(true);
  const [verification, setVerification] = useState(Object);

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm();

  const setErrors = useSetErrors<FormData>(setError);
  const router = useRouter();
  const { key } = router.query;

  useEffect(() => {
    setVerifying(true);
    getEmailVerification(key)
      .then(setVerification)
      .catch(console.error)
      .finally(() => setVerifying(false));
  }, [key, setVerification]);

  const onSubmit = () => {
    verifyEmail(key)
      .then((response) => {
        if ([200, 401].includes(response.status)) {
          toast.success("Verified email");
          router.push("/");
        } else {
          toast.error(
            "Your email verification code is invalid or expired. Please try again"
          );
          router.push("/settings/security");
        }

        return response;
      })
      .catch((error) => {
        console.error(error);
        if (error.fieldErrors) {
          setErrors(error.fieldErrors);
        }
      });
  };

  if (verifying) {
    return <LoadingOverlay loading={true} />;
  }

  return (
    <FormLayout title="Verify email">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {!verification?.data?.email && (
          <div>
            <p>Your email verification code is invalid or expired</p>
            <Button className="mt-3" palette="theme" href="/">
              Back to homepage
            </Button>
          </div>
        )}
        <ErrorBox
          error={errors?.root?.nonFieldError as FieldError | undefined}
        />
        {verification?.data?.email && (
          <div>
            <p>
              Please confirm that{" "}
              <b>
                <a href={"mailto:" + verification?.data?.email}>
                  {verification?.data?.email}
                </a>{" "}
              </b>
              is an email address for user{" "}
              <b>{verification?.data?.user.username}</b>.
            </p>
            <Button
              type="submit"
              className="mt-3 w-full"
              disabled={isSubmitting}
            >
              Confirm
            </Button>
          </div>
        )}
      </form>
    </FormLayout>
  );
}
