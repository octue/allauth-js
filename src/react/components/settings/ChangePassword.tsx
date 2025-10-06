import { Button } from '../common/Button'

export const ChangePassword = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Password
          </h1>
          <Button
            palette="theme"
            className="px-1 py-2 w-1/3 mt-1"
            href="/account/password/change"
          >
            Change password
          </Button>
        </div>
      </div>
    </div>
  )
}
