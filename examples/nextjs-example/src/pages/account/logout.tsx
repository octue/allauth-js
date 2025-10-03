import { useState } from "react";

import { Button } from "@components/core/Button";
import { LogoutIcon } from "@components/icons/Logout";
import { ReturnIcon } from "@components/icons/Return";
import { FormLayout } from "@components/layout/FormLayout";
import { LogoTitle } from "@components/layout/LogoTitle";
import { logout } from "@modules/allauth/lib/allauth";

import { apolloClient } from "graph/apollo";
import { useRouter } from "next/router";

export default function Logout() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // TODO REFACTOR REQUEST This handleClick needs to accept
  // onComplete and onError callbacks instead of the
  // application-specific logicc used here (to support this
  // module becoming part of a library)
  const handleClick = () => {
    setLoading(true);
    logout()
      .then(() => {
        router.push("/");
        apolloClient.clearStore();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleReturn = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <FormLayout>
      <LogoTitle
        title="Log out of Strands"
        subtitle="Are you sure you want to log out?"
      />
      <div className="flex w-full justify-end">
        <Button
          palette="gray"
          plain
          className="mr-6 font-light"
          onClick={handleReturn}
        >
          <ReturnIcon className="mr-2 size-4" />
          Return to app
        </Button>
        <Button disabled={loading} onClick={handleClick}>
          Log out <LogoutIcon className="ml-2 size-5" />
        </Button>
      </div>
    </FormLayout>
  );
}
