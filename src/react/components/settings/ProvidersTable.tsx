import { Button } from '../common/Button'

interface Props {
  className?: string
}

export const ProvidersTable: React.FC<Props> = ({ className }) => {
  return (
    <div className={`bg-white px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Social auth providers
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            There are no providers configured at this time. Coming soon!
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button disabled size="md">
            Add provider
          </Button>
        </div>
      </div>
    </div>
  )
}
