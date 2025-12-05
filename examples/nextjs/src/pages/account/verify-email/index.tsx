import { Button } from '@octue/allauth-js/react'
import { FormLayout } from '@/components/layout/FormLayout'

export default function VerifyEmail() {
  return (
    <FormLayout title="Email Verification Required">
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          You have not verified your email address. Please check your email for
          a verification link before logging in.
        </p>
        <div className="space-y-3">
          <Button
            size="lg"
            type="button"
            className="w-full"
            href="/account/login"
          >
            Back to login
          </Button>
        </div>
      </div>
    </FormLayout>
  )
}
